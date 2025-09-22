import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from "firebase/storage";
import { storage } from "./firebase";

export class StorageService {
  // Upload a single file
  static async uploadFile(
    file: File, 
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      
      // Upload file
      const uploadTask = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  // Upload multiple files
  static async uploadMultipleFiles(
    files: File[],
    basePath: string,
    onProgress?: (progress: number) => void
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `${Date.now()}_${index}_${file.name}`;
        const filePath = `${basePath}/${fileName}`;
        return this.uploadFile(file, filePath, onProgress);
      });

      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs;
    } catch (error) {
      console.error("Error uploading multiple files:", error);
      throw error;
    }
  }

  // Upload report media
  static async uploadReportMedia(
    files: File[],
    reportId: string,
    onProgress?: (progress: number) => void
  ): Promise<string[]> {
    const basePath = `reports/${reportId}/media`;
    return this.uploadMultipleFiles(files, basePath, onProgress);
  }

  // Delete file
  static async deleteFile(filePath: string): Promise<void> {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  // Get file metadata
  static async getFileMetadata(filePath: string) {
    try {
      const fileRef = ref(storage, filePath);
      const metadata = await getMetadata(fileRef);
      return metadata;
    } catch (error) {
      console.error("Error getting file metadata:", error);
      throw error;
    }
  }

  // List files in a directory
  static async listFiles(directoryPath: string) {
    try {
      const listRef = ref(storage, directoryPath);
      const result = await listAll(listRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          return {
            name: itemRef.name,
            url,
            metadata,
            path: itemRef.fullPath,
          };
        })
      );

      return files;
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }
}
