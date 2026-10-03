import React from 'react';
import { Calendar, AlertCircle, User, Sparkles, MapPin, Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PlaceholderScreen({ screenId, onNavigate, activePet, professionals = [] }) {
  const configs = {
    appointments: {
      title: "Prise de rendez-vous",
      subtitle: "Trouver un professionnel et réserver en ligne",
      icon: Calendar,
      color: "#0F4C5C",
      badge: "Étape suivante du pitch",
      previewItems: [
        "Recherche géolocalisée avec filtres espèces & tarifs transparents",
        "Transmission automatique du résumé du tri au vétérinaire",
        "Synchronisation directe avec le passeport santé de l'animal"
      ],
      quickPreview: (
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 text-left shadow-2xs space-y-2 mt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#0F4C5C]">
            <span>Clinique des Batignolles</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Prochain : Lun. 09h30</span>
          </div>
          <p className="text-xs text-slate-600">42 rue Nollet, 75017 Paris • 1.2 km</p>
          <div className="text-[11px] text-slate-400">Consultation : 45€ - 65€ • Prise en charge {activePet?.speciesLabel}</div>
        </div>
      )
    },
    emergencies: {
      title: "Urgences 24h/24",
      subtitle: "Centres hospitaliers et cliniques de garde à Paris",
      icon: AlertCircle,
      color: "#D90429",
      badge: "Module Urgences",
      previewItems: [
        "Carte interactive des urgences ouvertes avec délais d'attente estimés",
        "Régulation téléphonique directe avec le vétérinaire de garde",
        "Envoi instantané de la fiche clinique d'urgence et des allergies"
      ],
      quickPreview: (
        <div className="bg-white rounded-2xl p-3 border border-rose-200 text-left shadow-2xs space-y-2 mt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#D90429]">
            <span>Urgences Vétérinaires Paris Nuit</span>
            <span className="text-[#D90429] bg-rose-50 px-2 py-0.5 rounded-full animate-pulse">Ouvert 24/7</span>
          </div>
          <p className="text-xs text-slate-600">8 bd Voltaire, 75011 Paris • 1.8 km</p>
          <p className="text-[11px] text-slate-500">Délai estimé : 20 min • Tél : 01 43 55 99 99</p>
        </div>
      )
    },
    profile: {
      title: "Espace Propriétaire",
      subtitle: "Compte de Léa & Gestion du foyer",
      icon: User,
      color: "#0F4C5C",
      badge: "Profil & Paramètres",
      previewItems: [
        "Gestion multi-animaux (Moka, Oslo, Pixel)",
        "Notifications de rappels vaccinaux et antiparasitaires",
        "Partage de garde & accès co-propriétaire / petsitter"
      ],
      quickPreview: (
        <div className="bg-white rounded-2xl p-3 border border-slate-200/80 text-left shadow-2xs space-y-1 mt-3">
          <div className="text-xs font-bold text-slate-900">Léa Martin (27 ans)</div>
          <div className="text-[11px] text-slate-500">Paris 11e • 3 animaux enregistrés</div>
        </div>
      )
    }
  };

  const current = configs[screenId] || configs.appointments;
  const Icon = current.icon;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-center text-center space-y-4">
      
      {/* Icon pill */}
      <div 
        className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-md border"
        style={{ backgroundColor: `${current.color}15`, borderColor: `${current.color}30`, color: current.color }}
      >
        <Icon className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span 
          className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border mb-1"
          style={{ backgroundColor: `${current.color}10`, borderColor: `${current.color}25`, color: current.color }}
        >
          {current.badge}
        </span>
        <h2 className="text-xl font-extrabold text-slate-900">
          {current.title}
        </h2>
        <p className="text-xs text-slate-500 max-w-[280px] mx-auto">
          {current.subtitle}
        </p>
      </div>

      {/* Feature list teaser */}
      <div className="w-full bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs text-left space-y-2.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Fonctionnalités en cours de développement
        </h4>
        <div className="space-y-2">
          {current.previewItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {current.quickPreview}
      </div>

      {/* Return button */}
      <button
        onClick={() => onNavigate('home')}
        className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold shadow-2xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Revenir à l'accueil</span>
      </button>

    </div>
  );
}
