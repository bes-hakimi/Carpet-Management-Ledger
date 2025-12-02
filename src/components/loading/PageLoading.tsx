"use client";
import "./style.css";

export default function PageLoading() {
  return (
    <div className="loading-container">
      <div className="text-center space-y-8">
        {/* Animated Spinner */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full animate-ping"></div>
          <div className="absolute inset-2 border-4 border-primary-300 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 border-4 border-primary-500 rounded-full animate-spin"></div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">
            در حال بارگذاری
            <span className="mr-2">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </h3>
          
          <p className="text-gray-600 text-sm">
            لطفاً چند لحظه صبر کنید
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    </div>
  );
}