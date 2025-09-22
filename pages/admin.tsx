import { useState } from "react";
import { seedFirestoreData, clearAllReports } from "@/lib/seedData";
import { AnalyticsService } from "@/lib/analytics";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeedData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const success = await seedFirestoreData();
      if (success) {
        setMessage("✅ Sample data seeded successfully!");
        AnalyticsService.trackCustomEvent("admin_seed_data", { success: true });
      } else {
        setMessage("❌ Failed to seed data. Check console for errors.");
        AnalyticsService.trackCustomEvent("admin_seed_data", {
          success: false,
        });
      }
    } catch (error) {
      setMessage("❌ Error seeding data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    setLoading(true);
    setMessage("");

    try {
      const success = await clearAllReports();
      if (success) {
        setMessage("🗑️ Data cleared successfully!");
        AnalyticsService.trackCustomEvent("admin_clear_data", {
          success: true,
        });
      } else {
        setMessage("❌ Failed to clear data. Check console for errors.");
        AnalyticsService.trackCustomEvent("admin_clear_data", {
          success: false,
        });
      }
    } catch (error) {
      setMessage("❌ Error clearing data: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Admin Panel
        </h1>

        <div className="space-y-4">
          <button
            onClick={handleSeedData}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Seeding..." : "Seed Sample Data"}
          </button>

          <button
            onClick={handleClearData}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Clearing..." : "Clear All Data"}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm text-gray-700">
            {message}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          <p>This page helps you manage Firestore data for testing.</p>
          <p>
            Visit <code>/admin</code> to access this panel.
          </p>
        </div>
      </div>
    </div>
  );
}
