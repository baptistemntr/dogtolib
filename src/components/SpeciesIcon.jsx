import React from 'react';

export function SpeciesIcon({ species, className = "w-6 h-6", color = "currentColor" }) {
  if (species === 'chat' || species === 'Cat') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Stylized cat head */}
        <path d="M12 5c-4 0-7 2.5-7 6.5 0 3 2 5.5 5 6.3V21h4v-3.2c3-.8 5-3.3 5-6.3 0-4-3-6.5-7-6.5z" />
        <path d="M5 10L3 3l6 3" />
        <path d="M19 10l2-7-6 3" />
        <circle cx="9" cy="12" r="1" fill={color} />
        <circle cx="15" cy="12" r="1" fill={color} />
        <path d="M11 15h2" />
      </svg>
    );
  }

  if (species === 'lapin' || species === 'Rabbit') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Friendly bunny with upright/lop ears */}
        <path d="M7 11c0-2-1-7 1.5-8.5 2-1 3 3 2.5 7.5" />
        <path d="M17 11c0-2 1-7-1.5-8.5-2-1-3 3-2.5 7.5" />
        <ellipse cx="12" cy="15" rx="6" ry="5.5" />
        <circle cx="9.5" cy="14" r="1" fill={color} />
        <circle cx="14.5" cy="14" r="1" fill={color} />
        <path d="M11 17h2" />
        <path d="M12 17v1.5" />
      </svg>
    );
  }

  // Chien (default)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Friendly dog with floppy ears */}
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.707.807 2 2 2" />
      <path d="M14 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.707-.807 2-2 2" />
      <path d="M4 14c0 4.5 3.5 7 8 7s8-2.5 8-7c0-4-3.5-7-8-7s-8 3-8 7z" />
      <circle cx="9" cy="13" r="1" fill={color} />
      <circle cx="15" cy="13" r="1" fill={color} />
      <path d="M10.5 17h3" />
      <path d="M12 15.5v1.5" />
    </svg>
  );
}

export function SpeciesBadge({ species }) {
  const configs = {
    chat: {
      label: "Félin",
      bg: "bg-[#0F4C5C]/10",
      text: "text-[#0F4C5C]",
      border: "border-[#0F4C5C]/20"
    },
    chien: {
      label: "Canin",
      bg: "bg-emerald-50 text-emerald-800",
      text: "text-emerald-700",
      border: "border-emerald-200"
    },
    lapin: {
      label: "NAC",
      bg: "bg-[#E36414]/10",
      text: "text-[#E36414]",
      border: "border-[#E36414]/20"
    }
  };

  const current = configs[species] || configs.chien;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase border ${current.bg} ${current.text} ${current.border}`}>
      <SpeciesIcon species={species} className="w-3.5 h-3.5" color="currentColor" />
      {current.label}
    </span>
  );
}
