import React from 'react';
import { Home, FileHeart, Calendar, AlertCircle, User, MapPin } from 'lucide-react';

export default function BottomNav({ currentScreen, onNavigate }) {
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'map', label: 'Carte', icon: MapPin },
    { id: 'passport', label: 'Passeport', icon: FileHeart },
    { id: 'appointments', label: 'RDV', icon: Calendar },
    { id: 'emergencies', label: 'Urgences', icon: AlertCircle, urgent: true },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shrink-0 z-40">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id;
        const isUrgent = item.urgent;

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 relative min-w-[50px] ${
              isActive
                ? isUrgent
                  ? 'text-[#D90429]'
                  : 'text-[#0F4C5C]'
                : isUrgent
                ? 'text-slate-500 hover:text-[#D90429]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                }`}
              />
              {isUrgent && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D90429] animate-ping opacity-75"></span>
              )}
            </div>
            <span
              className={`text-[10px] mt-1 font-medium tracking-tight ${
                isActive ? 'font-bold' : ''
              }`}
            >
              {item.label}
            </span>
            {isActive && (
              <span
                className={`absolute bottom-0 w-6 h-0.5 rounded-full ${
                  isUrgent ? 'bg-[#D90429]' : 'bg-[#0F4C5C]'
                }`}
              ></span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
