import { Report } from './types';
import { generateMockReport } from './mock-data';

export class MockWebSocket {
  private listeners: ((data: any) => void)[] = [];
  private interval: NodeJS.Timeout | null = null;

  connect() {
    // Simulate WebSocket connection
    console.log('Mock WebSocket connected');
    
    // Send new reports every 15-30 seconds
    this.interval = setInterval(() => {
      const newReport = generateMockReport();
      this.emit('new_report', newReport);
    }, 15000 + Math.random() * 15000); // 15-30 seconds
  }

  on(event: string, callback: (data: any) => void) {
    this.listeners.push(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.forEach(callback => callback({ event, data }));
  }

  disconnect() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.listeners = [];
    console.log('Mock WebSocket disconnected');
  }
}