import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Bell, User, Wifi, WifiOff } from "lucide-react";

export default function Header() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
    setLastSync(new Date().toLocaleTimeString());

    const interval = setInterval(() => {
      setLastSync(new Date().toLocaleTimeString());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left - Agency Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-800 font-bold text-lg">🏛️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Government of India
              </h1>
              <p className="text-sm text-gray-600">
                Ministry of Earth Sciences - Authority Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search incidents, locations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right - Status & User */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center space-x-2 text-sm">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className={isOnline ? "text-green-600" : "text-red-600"}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          {/* Last Sync - only render on client */}
          {mounted && (
            <div className="text-sm text-gray-600">Last sync: {lastSync}</div>
          )}

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              2
            </span>
          </motion.button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right text-sm">
              <div className="font-medium text-gray-900">Officer Name</div>
              <div className="text-gray-600">District Authority</div>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
