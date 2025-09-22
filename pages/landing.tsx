// // // pages/landing.tsx
// // import Link from "next/link";

// // export default function LandingPage() {
// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
// //       <div className="w-full max-w-5xl">
// //         <div className="text-center mb-8">
// //           <h1 className="text-3xl font-bold text-gray-900">
// //             Ocean Hazard Analysis
// //           </h1>
// //           <p className="text-gray-600 mt-2">Choose your portal to continue</p>
// //         </div>

// // <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //   {/* Analyst card */}
// //   <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
// //     <h2 className="text-xl font-semibold text-gray-900">Analyst</h2>
// //     <p className="text-gray-600 mt-1 mb-5">
// //       Review, validate and act on incoming reports.
// //     </p>
// //     <div className="flex gap-3">
// //       <Link
// //         href={{
// //           pathname: "/sign-in",
// //           query: { dest: "/analytical_dashboard" },
// //         }}
// //         className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
// //       >
// //         Sign In
// //       </Link>
// //       <Link
// //         href={{
// //           pathname: "/sign-up",
// //           query: { dest: "/analytical_dashboard" },
// //         }}
// //         className="px-4 py-2 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors"
// //       >
// //         Sign Up
// //       </Link>
// //     </div>
// //   </div>

// //   {/* Authority card */}
// //   <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
// //     <h2 className="text-xl font-semibold text-gray-900">Authority</h2>
// //     <p className="text-gray-600 mt-1 mb-5">
// //       Operational dashboard for authority workflows.
// //     </p>
// //     <div className="flex gap-3">
// //       <Link
// //         href={{
// //           pathname: "/sign-in",
// //           query: { dest: "/authority_dashboard" },
// //         }}
// //         className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
// //       >
// //         Sign In
// //       </Link>
// //       <Link
// //         href={{
// //           pathname: "/sign-up",
// //           query: { dest: "/authority_dashboard" },
// //         }}
// //         className="px-4 py-2 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors"
// //       >
// //         Sign Up
// //       </Link>
// //     </div>
// //   </div>
// // </div>

// //         <p className="text-sm text-gray-500 mt-6 text-center">
// //           You’ll be redirected to the selected dashboard after authentication.
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

import React, { useState, useEffect } from "react";
import {
  Shield,
  BarChart3,
  Waves,
  ArrowRight,
  Globe,
  Anchor,
  Navigation,
  Award,
  MapPin,
  Clock,
} from "lucide-react";

const LandingPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [language, setLanguage] = useState("english"); // 'hindi' or 'english'
  const [currentTime, setCurrentTime] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    setIsClient(true);

    // Set initial time
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCardSelect = (cardType) => {
    setSelectedCard(cardType);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "hindi" ? "english" : "hindi"));
  };

  // Language content object
  const content = {
    hindi: {
      govHeader: "भारत सरकार",
      ministry: "पृथ्वी विज्ञान मंत्रालय",
      systemName: "राष्ट्रीय महासागर निगरानी प्रणाली",
      mainTitle: "समुद्री खतरा विश्लेषण पोर्टल",
      subtitle: "उन्नत समुद्री खुफिया एवं तटीय सुरक्षा प्रणाली",
      coastlineText:
        "भारत की 7,517 किमी तटरेखा की सुरक्षा वास्तविक समय निगरानी के माध्यम से",
      analystPortalTitle: "विश्लेषक पोर्टल",
      analystDescription:
        "समुद्री सुरक्षा संचालन के लिए उन्नत डेटा विश्लेषण, खतरा रिपोर्ट सत्यापन, और वास्तविक समय खतरा मूल्यांकन।",
      authorityPortalTitle: "प्राधिकरण पोर्टल",
      authorityDescription:
        "आपातकालीन समन्वय, परिचालन कार्यप्रवाह, और तटीय रक्षा प्रबंधन के लिए मिशन-महत्वपूर्ण कमांड केंद्र।",
      signIn: "साइन इन",
      signUp: "पंजीकरण",
      realTimeAnalysis: "वास्तविक समय विश्लेषण",
      reportValidation: "रिपोर्ट सत्यापन",
      commandCenter: "कमांड केंद्र",
      emergencyResponse: "आपातकालीन प्रतिक्रिया",
      systemStatus: "सिस्टम स्थिति: संचालित",
      portalSelected: "पोर्टल चयनित",
      selectPortal: "कृपया अपना एक्सेस पोर्टल चुनें",
      authRedirect:
        "सुरक्षित प्रमाणीकरण आपको चयनित डैशबोर्ड पर पुनर्निर्देशित करेगा",
      copyright:
        "© 2025 भारत सरकार • पृथ्वी विज्ञान मंत्रालय • सभी अधिकार सुरक्षित",
    },
    english: {
      govHeader: "Government of India",
      ministry: "Ministry of Earth Sciences",
      systemName: "National Ocean Monitoring System",
      mainTitle: "Ocean Hazard Analysis Portal",
      subtitle: "Advanced Maritime Intelligence & Coastal Security System",
      coastlineText:
        "Safeguarding India's 7,517 km coastline through real-time monitoring and analysis",
      analystPortalTitle: "Analyst Portal",
      analystDescription:
        "Advanced data analytics, hazard report validation, and real-time threat assessment for maritime security operations.",
      authorityPortalTitle: "Authority Portal",
      authorityDescription:
        "Mission-critical command center for emergency coordination, operational workflows, and coastal defense management.",
      signIn: "Sign In",
      signUp: "Sign Up",
      realTimeAnalysis: "Real-time Analysis",
      reportValidation: "Report Validation",
      commandCenter: "Command Center",
      emergencyResponse: "Emergency Response",
      systemStatus: "System Status: Operational",
      portalSelected: "Portal Selected",
      selectPortal: "Please select your access portal",
      authRedirect:
        "Secure authentication will redirect you to the selected dashboard",
      copyright:
        "© 2025 Government of India • Ministry of Earth Sciences • All Rights Reserved",
    },
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      {/* Indian Government Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <Waves className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-orange-600">
                    {currentContent.govHeader}
                  </div>
                  <div className="text-xs text-slate-600">
                    {currentContent.ministry}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-slate-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>IST: {isClient ? currentTime : "--:--:--"}</span>
              </div>
              <div className="w-px h-4 bg-slate-300"></div>
              <button
                onClick={toggleLanguage}
                className="text-slate-600 hover:text-orange-600 transition-colors duration-200 font-medium"
              >
                {language === "hindi" ? "English" : "हिन्दी"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Tricolor Inspired Gradients */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-br from-orange-100/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-tr from-green-100/30 to-transparent"></div>

        {/* Ocean Wave Patterns */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="ocean-waves"
              x="0"
              y="0"
              width="100"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 25 Q25 15 50 25 T100 25"
                stroke="#0ea5e9"
                strokeWidth="0.5"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M0 35 Q25 25 50 35 T100 35"
                stroke="#06b6d4"
                strokeWidth="0.3"
                fill="none"
                opacity="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ocean-waves)" />
        </svg>

        {/* Floating Government Emblems */}
        <div className="absolute top-1/4 left-10 w-2 h-2 bg-orange-400/60 rounded-full animate-pulse"></div>
        <div
          className="absolute top-1/3 right-20 w-1 h-1 bg-green-500/60 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-blue-500/60 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-50 to-green-50 rounded-full border border-orange-200/50 mb-6">
              <MapPin className="w-4 h-4 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-slate-700">
                {currentContent.systemName}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600">
                {currentContent.mainTitle}
              </span>
            </h1>

            <div className="flex justify-center items-center mb-8">
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 via-white to-green-400 rounded-full"></div>
            </div>

            <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-4xl mx-auto leading-relaxed mb-4">
              {currentContent.subtitle}
            </p>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
              {currentContent.coastlineText}
            </p>
          </div>

          {/* Portal Selection Cards */}
          <div
            className={`grid lg:grid-cols-2 gap-8 mb-16 transition-all duration-1000 delay-300 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Analyst Portal */}
            <div
              className={`group relative cursor-pointer transition-all duration-500 ${
                selectedCard === "analyst" ? "scale-105" : "hover:scale-102"
              }`}
              onClick={() => handleCardSelect("analyst")}
              style={{
                filter:
                  selectedCard === "analyst"
                    ? "drop-shadow(0 25px 50px rgba(59, 130, 246, 0.25))"
                    : "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))",
              }}
            >
              <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 p-8 h-full">
                {/* Selection Indicator */}
                {selectedCard === "analyst" && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Government Badge */}
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded border border-slate-200 flex items-center justify-center">
                    <Award className="w-4 h-4 text-slate-600" />
                  </div>
                </div>

                <div className="mb-8">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      selectedCard === "analyst"
                        ? "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-2xl transform rotate-3"
                        : "bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-600 group-hover:from-blue-100 group-hover:to-cyan-100"
                    }`}
                  >
                    <BarChart3 className="w-10 h-10" />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                    {currentContent.analystPortalTitle}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {currentContent.analystDescription}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="/sign-in?dest=/analytical_dashboard"
                      className="flex-1 text-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl block"
                    >
                      {currentContent.signIn}
                    </a>
                    <a
                      href="/sign-up?dest=/analytical_dashboard"
                      className="flex-1 text-center bg-white border-2 border-blue-200 hover:border-blue-400 text-blue-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-50 block"
                    >
                      {currentContent.signUp}
                    </a>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-slate-600">
                      <Globe className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{currentContent.realTimeAnalysis}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Navigation className="w-4 h-4 mr-2 text-cyan-500" />
                      <span>{currentContent.reportValidation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Authority Portal */}
            <div
              className={`group relative cursor-pointer transition-all duration-500 ${
                selectedCard === "authority" ? "scale-105" : "hover:scale-102"
              }`}
              onClick={() => handleCardSelect("authority")}
              style={{
                filter:
                  selectedCard === "authority"
                    ? "drop-shadow(0 25px 50px rgba(16, 185, 129, 0.25))"
                    : "drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1))",
              }}
            >
              <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-3xl border border-white/60 p-8 h-full">
                {/* Selection Indicator */}
                {selectedCard === "authority" && (
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Government Badge */}
                <div className="absolute top-4 right-4">
                  <div className="w-12 h-8 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded border border-slate-200 flex items-center justify-center">
                    <Award className="w-4 h-4 text-slate-600" />
                  </div>
                </div>

                <div className="mb-8">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      selectedCard === "authority"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-2xl transform -rotate-3"
                        : "bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 group-hover:from-emerald-100 group-hover:to-teal-100"
                    }`}
                  >
                    <Shield className="w-10 h-10" />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                    {currentContent.authorityPortalTitle}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {currentContent.authorityDescription}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="/sign-in?dest=/authority_dashboard"
                      className="flex-1 text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl block"
                    >
                      {currentContent.signIn}
                    </a>
                    <a
                      href="/sign-up?dest=/authority_dashboard"
                      className="flex-1 text-center bg-white border-2 border-emerald-200 hover:border-emerald-400 text-emerald-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-emerald-50 block"
                    >
                      {currentContent.signUp}
                    </a>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-slate-600">
                      <Anchor className="w-4 h-4 mr-2 text-emerald-500" />
                      <span>{currentContent.commandCenter}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Shield className="w-4 h-4 mr-2 text-teal-500" />
                      <span>{currentContent.emergencyResponse}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <div
            className={`text-center transition-all duration-1000 delay-600 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-50 via-white to-emerald-50 rounded-2xl border border-blue-200/50 backdrop-blur-xl shadow-lg">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm font-medium text-slate-700">
                  {currentContent.systemStatus}
                </span>
              </div>
              <div className="w-px h-6 bg-slate-300 mx-4"></div>
              <div className="text-sm text-slate-600">
                {selectedCard
                  ? `${
                      selectedCard === "analyst"
                        ? currentContent.analystPortalTitle
                        : currentContent.authorityPortalTitle
                    } ${currentContent.portalSelected}`
                  : currentContent.selectPortal}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`text-center mt-16 transition-all duration-1000 delay-900 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex justify-center items-center space-x-4 mb-6">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-20 h-0.5 bg-gradient-to-r from-orange-400 via-blue-400 to-green-400 rounded-full"></div>
              <div
                className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                style={{ animationDelay: "200ms" }}
              ></div>
            </div>
            <p className="text-sm text-slate-500">
              {currentContent.authRedirect}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {currentContent.copyright}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
