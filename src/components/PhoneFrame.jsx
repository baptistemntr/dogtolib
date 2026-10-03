import React from 'react';

export default function PhoneFrame({ children, currentTime = "20:45" }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 md:py-8 w-full select-none">
      {/* Projection presentation bar (for pitch context) */}
      <div className="hidden md:flex items-center justify-between w-full max-w-[390px] mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-300">Dogtolib Live Prototype</span>
        </div>
        <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50 text-[11px]">
          Présentation Master
        </span>
      </div>

      {/* Realistic Mobile Device Frame */}
      <div className="relative w-[390px] h-[830px] max-h-[95vh] bg-[#F6F1E9] rounded-[44px] shadow-[0_25px_70px_rgba(0,0,0,0.6),0_0_0_12px_#272D37,0_0_0_14px_#373E4A] overflow-hidden flex flex-col border border-white/20">
        
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-7 pt-3 pb-2 text-xs font-semibold text-slate-800 pointer-events-none select-none">
          <span className="tracking-tight text-[13px] font-bold text-slate-800">{currentTime}</span>
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-1.5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#0F4C5C]/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-800">
            {/* Signal */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 18.25A10.93 10.93 0 011 12C1 5.92 5.92 1 12 1s11 4.92 11 11c0 2.3-.7 4.44-1.9 6.22l-.62-.62A9.95 9.95 0 0021 12c0-4.97-4.03-9-9-9z"/>
              <path d="M2 22h20L12 10 2 22z"/>
            </svg>
            {/* Wifi */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0012 4z"/>
            </svg>
            {/* Battery */}
            <div className="w-5 h-2.5 border border-slate-700 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-3.5 bg-slate-800 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="flex-1 w-full flex flex-col pt-10 overflow-hidden relative">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/30 rounded-full pointer-events-none z-50"></div>
      </div>
    </div>
  );
}
