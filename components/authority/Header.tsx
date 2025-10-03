import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  User,
  Wifi,
  WifiOff,
  Shield,
  AlertTriangle,
} from "lucide-react";

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
    <header className="bg-white border-b-2 border-blue-800 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left - Police Department Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 police-gradient rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">
                Rakshaq Citizen Safety
              </h1>
              <p className="text-sm text-gray-700 font-medium">
                Indian Police Crime Analysis Dashboard
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
              placeholder="Search crimes, locations, suspects..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200"
            />
          </div>
        </div>

        {/* Right - Status & User */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center space-x-2 text-sm">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <span
              className={
                isOnline
                  ? "text-green-700 font-medium"
                  : "text-red-700 font-medium"
              }
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>

          {/* Last Sync - only render on client */}
          {mounted && (
            <div className="text-sm text-gray-600 font-medium">
              Last sync: {lastSync}
            </div>
          )}

          {/* Emergency Alert */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <AlertTriangle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              3
            </span>
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              5
            </span>
          </motion.button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right text-sm">
              <div className="font-semibold text-gray-900">
                Inspector Rajesh Kumar
              </div>
              <div className="text-gray-600 font-medium">
                Crime Analysis Unit
              </div>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-200">
              <User className="w-5 h-5 text-blue-700" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
