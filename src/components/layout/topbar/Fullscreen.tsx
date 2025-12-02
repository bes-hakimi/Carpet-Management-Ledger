"use client";
import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export default function Fullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // رفتن به حالت فول‌اسکرین
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      // خروج از حالت فول‌اسکرین
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch((err) => {
        console.error("Error attempting to exit full-screen mode:", err);
      });
    }
  };

  return (
    <div className="flex items-center gap-4 p-1 rounded-md hover:cursor-pointer
                bg-gradient-to-r from-primary-500 via-primary-500/80 to-primary-500/60">
      <button
        onClick={toggleFullscreen}
        className="text-white hover:cursor-pointer hover:scale-110 transition-all"
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>
    </div>

  );
}
