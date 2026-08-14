"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 glassmorphism glow-green shadow-2xl">
      <div
        ref={containerRef}
        className="relative w-full h-full select-none cursor-ew-resize"
        onMouseDown={() => {
          isDragging.current = true;
        }}
        onTouchStart={() => {
          isDragging.current = true;
        }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Before Layer (Dirty Paint / Scratch Mockup using gradient overlay) */}
        <div className="absolute inset-0 bg-[#16181b]">
          <img
            src="/paint_before.png"
            alt="До детейлинга (царапины и тусклый цвет)"
            className="w-full h-full object-cover pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
          <div className="absolute left-6 top-6 px-4 py-2 rounded-full border border-red-500/30 bg-red-950/70 text-red-400 text-xs uppercase tracking-wider font-bold z-10 backdrop-blur-sm">
            До детейлинга (След затиров и царапин)
          </div>
        </div>

        {/* After Layer (Ultra Mirror Glass Glossy Polish Accent using neon green glow & sparkles) */}
        <div
          className="absolute inset-y-0 left-0 right-0 overflow-hidden bg-[#070809]"
          style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
        >
          <img
            src="/paint_after.png"
            alt="После полировки и керамики (зеркальный блеск)"
            className="w-full h-full object-cover pointer-events-none select-none"
            style={{ width: containerRef.current?.getBoundingClientRect().width }}
          />
          
          {/* Luxury After Details & Reflections */}
          <div className="absolute inset-0 bg-gradient-to-tr from-lime-900/10 via-transparent to-emerald-900/10 pointer-events-none" />
          
          {/* Neon Glow Light Bars imitating professional detailing dry lamp reflection */}
          <div className="absolute w-[30%] h-[150%] -top-[25%] left-[20%] bg-lime-500/10 blur-[80px] rotate-12 transform pointer-events-none" />
          <div className="absolute w-[15%] h-[150%] -top-[25%] left-[55%] bg-emerald-500/10 blur-[60px] rotate-12 transform pointer-events-none" />

          {/* Sparkles / Shine indicators */}
          <div className="absolute top-[20%] left-[15%] w-8 h-8 text-lime-400 opacity-80 animate-pulse pointer-events-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v18M3 12h18" strokeLinecap="round" />
            </svg>
          </div>
          <div className="absolute bottom-[25%] left-[35%] w-6 h-6 text-lime-300 opacity-90 animate-ping pointer-events-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3v18M3 12h18" strokeLinecap="round" />
            </svg>
          </div>

          <div className="absolute left-6 top-6 px-4 py-2 rounded-full border border-lime-500/40 bg-lime-950/80 text-lime-400 text-xs uppercase tracking-wider font-bold z-10 backdrop-blur-sm whitespace-nowrap">
            После полировки & керамики PANDA
          </div>
        </div>

        {/* Comparison Divider Handle Line */}
        <div
          className="absolute inset-y-0 w-[2px] bg-lime-500 cursor-ew-resize z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle center badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#0d0e10] border-2 border-lime-500 flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform duration-150">
            <div className="flex space-x-1">
              <span className="w-1.5 h-3 border-l-2 border-lime-400 transform -rotate-12"></span>
              <span className="w-1.5 h-3 border-r-2 border-lime-400 transform rotate-12"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
