import React, { useState } from 'react';
import { X, Check, Copy, ShieldCheck, Clock, Share2 } from 'lucide-react';
import { SpeciesBadge } from './SpeciesIcon';

export default function QrShareModal({ isOpen, onClose, pet }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pet) return null;

  const shareUrl = `https://dogtolib.app/pass/${pet.id}?token=dk_7a8f92b&exp=24h`;

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-[340px] p-6 shadow-2xl border border-slate-100 relative text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative mb-2">
            <img
              src={pet.photo}
              alt={pet.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#0F4C5C]/20 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1">
              <SpeciesBadge species={pet.species} />
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            Passeport de {pet.name}
          </h3>
          <p className="text-xs text-slate-500">Puce : {pet.chipNumber}</p>
        </div>

        {/* QR Code Container */}
        <div className="bg-[#F6F1E9] p-4 rounded-2xl border border-dashed border-[#0F4C5C]/30 flex flex-col items-center justify-center my-3 relative group">
          {/* Simulated QR Pattern SVG */}
          <div className="w-44 h-44 bg-white p-3 rounded-xl shadow-xs flex items-center justify-center relative">
            <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
              {/* Corner markers */}
              <rect x="5" y="5" width="26" height="26" rx="4" fill="#0F4C5C" />
              <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="13" width="10" height="10" rx="1" fill="#0F4C5C" />

              <rect x="69" y="5" width="26" height="26" rx="4" fill="#0F4C5C" />
              <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
              <rect x="77" y="13" width="10" height="10" rx="1" fill="#0F4C5C" />

              <rect x="5" y="69" width="26" height="26" rx="4" fill="#0F4C5C" />
              <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
              <rect x="13" y="77" width="10" height="10" rx="1" fill="#0F4C5C" />

              {/* Data modules simulation */}
              <rect x="36" y="8" width="6" height="6" rx="1" />
              <rect x="46" y="8" width="6" height="12" rx="1" />
              <rect x="56" y="8" width="6" height="6" rx="1" />
              
              <rect x="36" y="24" width="12" height="6" rx="1" />
              <rect x="52" y="20" width="8" height="8" rx="1" />
              
              <rect x="8" y="36" width="6" height="6" rx="1" />
              <rect x="18" y="36" width="10" height="6" rx="1" />
              <rect x="8" y="46" width="14" height="6" rx="1" />
              <rect x="8" y="56" width="6" height="8" rx="1" />

              <rect x="69" y="36" width="12" height="6" rx="1" />
              <rect x="85" y="40" width="6" height="14" rx="1" />
              <rect x="72" y="48" width="8" height="8" rx="1" />

              <rect x="36" y="68" width="8" height="8" rx="1" />
              <rect x="48" y="72" width="6" height="16" rx="1" />
              <rect x="58" y="66" width="8" height="6" rx="1" />
              <rect x="36" y="82" width="8" height="8" rx="1" />
              <rect x="70" y="70" width="6" height="6" rx="1" />
              <rect x="80" y="76" width="12" height="6" rx="1" />
              <rect x="72" y="86" width="14" height="6" rx="1" />

              {/* Center badge */}
              <rect x="38" y="38" width="24" height="24" rx="6" fill="#E36414" />
              <circle cx="50" cy="50" r="6" fill="white" />
              <circle cx="46" cy="44" r="1.5" fill="white" />
              <circle cx="54" cy="44" r="1.5" fill="white" />
            </svg>
          </div>

          {/* Badge 24h validity */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            Accès sécurisé valable 24 h
          </div>
        </div>

        {/* PIN Code for quick consultation */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-3 text-left">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>Code d'accès praticien</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Chiffré
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-base font-extrabold tracking-widest text-[#0F4C5C]">
              482 • 910
            </span>
            <span className="text-[10px] bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded font-medium">
              Usage unique
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCopy}
          className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-[#0F4C5C] hover:bg-[#16697A] text-white shadow-sm'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" /> Lien sécurisé copié !
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copier le lien temporaire
            </>
          )}
        </button>

        <p className="text-[10px] text-slate-400 mt-2">
          Le vétérinaire consulte l'historique complet sans installer l'application.
        </p>
      </div>
    </div>
  );
}
