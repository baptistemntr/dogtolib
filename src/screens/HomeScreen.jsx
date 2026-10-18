import React from 'react';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ChevronRight, 
  HeartPulse, 
  ShieldCheck, 
  AlertCircle, 
  PhoneCall, 
  Activity,
  FileCheck,
  CheckCircle2,
  HelpCircle,
  MapPin
} from 'lucide-react';
import { SpeciesBadge, SpeciesIcon } from '../components/SpeciesIcon';

export default function HomeScreen({ pet, onStartTriage, onNavigate, onOpenPassport }) {
  if (!pet) return null;

  const scoreBadge = {
    up_to_date: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      dot: 'bg-emerald-500',
      icon: CheckCircle2,
      label: 'À jour'
    },
    upcoming: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      dot: 'bg-[#E36414]',
      icon: Clock,
      label: 'À prévoir'
    },
    overdue: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      dot: 'bg-[#D90429]',
      icon: AlertCircle,
      label: 'En retard'
    }
  }[pet.preventionScore.status] || {
    bg: 'bg-slate-100 border-slate-200 text-slate-700',
    dot: 'bg-slate-400',
    icon: HelpCircle,
    label: 'Statut'
  };

  const ScoreIcon = scoreBadge.icon;

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-20 pt-3 space-y-4">
      
      {/* Active Pet Hero Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#0F4C5C]/10 relative overflow-hidden">
        {/* Subtle species watermark pattern in background */}
        <div className="absolute -top-4 -right-4 opacity-5 pointer-events-none text-[#0F4C5C]">
          <SpeciesIcon species={pet.species} className="w-40 h-40" />
        </div>

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="relative">
            <img
              src={pet.photo}
              alt={pet.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#0F4C5C] text-white p-1 rounded-full shadow-xs">
              <SpeciesIcon species={pet.species} className="w-3 h-3" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-[#0F4C5C] tracking-tight truncate">
                {pet.name}
              </h1>
              <SpeciesBadge species={pet.species} />
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {pet.speciesLabel} • {pet.age}
            </p>

            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
              <span className="bg-slate-100 px-2 py-0.5 rounded-md font-semibold text-slate-700">
                ⚖️ {pet.weight}
              </span>
              <span className="truncate text-slate-400">
                Puce : {pet.chipNumber.slice(-8)}
              </span>
            </div>
          </div>
        </div>

        {/* Prevention Score Box */}
        <div 
          onClick={onOpenPassport}
          className={`mt-3.5 p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${scoreBadge.bg}`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-2xs shrink-0`}>
              <ScoreIcon className="w-4 h-4 text-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Santé préventive : {scoreBadge.label}
                </span>
              </div>
              <p className="text-[11px] opacity-90 leading-tight mt-0.5">
                {pet.preventionScore.description}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
        </div>
      </div>

      {/* BIG PRIMARY CTA: "Mon animal ne va pas bien" */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E36414] to-[#F77F00] rounded-3xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300"></div>
        <button
          onClick={onStartTriage}
          className="relative w-full bg-gradient-to-r from-[#E36414] to-[#EA580C] hover:from-[#C5530E] hover:to-[#DD4D0A] text-white p-4 rounded-3xl shadow-lg shadow-[#E36414]/30 flex items-center justify-between text-left transition-all duration-200 active:scale-[0.98]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
              <HeartPulse className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-100 block">
                Assistant d'orientation 24h/24
              </span>
              <h2 className="text-base font-extrabold text-white leading-tight">
                Mon animal ne va pas bien
              </h2>
              <p className="text-xs text-orange-100/90 mt-0.5">
                Évaluer les symptômes en 5 questions
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 ml-2">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>

      {/* Prochain Rendez-vous */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0F4C5C]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Prochain rendez-vous
            </h3>
          </div>
          <span className="text-[11px] text-[#0F4C5C] font-semibold hover:underline cursor-pointer" onClick={() => onNavigate('appointments')}>
            Voir tout
          </span>
        </div>

        {pet.nextAppointment ? (
          <div className="bg-[#F6F1E9] p-3 rounded-2xl border border-[#0F4C5C]/10 flex items-start gap-3">
            <div className="bg-white px-3 py-2 rounded-xl text-center shadow-2xs border border-slate-200/60 shrink-0">
              <span className="block text-[10px] font-bold text-[#E36414] uppercase leading-none">
                {pet.nextAppointment.date.split(' ')[0]}
              </span>
              <span className="block text-base font-extrabold text-slate-800 leading-tight">
                {pet.nextAppointment.date.split(' ')[1]}
              </span>
              <span className="block text-[10px] text-slate-500 font-semibold leading-none">
                {pet.nextAppointment.time}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold mb-1">
                Confirmé
              </div>
              <p className="text-xs font-bold text-slate-900 truncate">
                {pet.nextAppointment.reason}
              </p>
              <p className="text-[11px] text-slate-600 truncate">
                {pet.nextAppointment.practitioner}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {pet.nextAppointment.clinic}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 p-3 rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Aucun rendez-vous planifié pour {pet.name}
            </p>
            <button
              onClick={() => onNavigate('appointments')}
              className="mt-2 text-xs font-bold text-[#0F4C5C] bg-[#0F4C5C]/10 hover:bg-[#0F4C5C]/20 px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1"
            >
              Planifier un contrôle
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Accès Rapide Urgences */}
      <div 
        onClick={() => onNavigate('emergencies')}
        className="bg-white rounded-3xl p-4 shadow-sm border border-rose-100 flex items-center justify-between cursor-pointer hover:bg-rose-50/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#D90429] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#D90429] uppercase tracking-wider">
                Urgences vétérinaires
              </h3>
              <span className="w-2 h-2 rounded-full bg-[#D90429] animate-ping"></span>
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Clinique de garde Paris 24h/24
            </p>
            <p className="text-[11px] text-slate-500">
              À 1.8 km • Sans rendez-vous • 01 43 55 99 99
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
      </div>

      {/* Carte des spots canins à Paris (Nouveau) */}
      <div 
        onClick={() => onNavigate('map')}
        className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-3xl p-4 border border-emerald-200/80 shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                Nouveau • Paris Canin
              </span>
            </div>
            <h3 className="text-xs font-extrabold text-slate-900 mt-0.5">
              Carte des spots & adresses
            </h3>
            <p className="text-[11px] text-slate-600">
              Parcs, pupuccinos, boutiques & toiletteurs
            </p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-100/80 group-hover:bg-emerald-200 text-emerald-800 flex items-center justify-center transition-colors">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Conseil de prévention personnalisé par espèce */}
      <div className="bg-gradient-to-br from-white to-[#F6F1E9] rounded-3xl p-3.5 border border-slate-200/80 text-left">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0F4C5C] mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Conseil prévention du mois</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          {pet.species === 'chat' && "L'automne favorise la formation de boules de poils chez le chat d'intérieur. Pensez à brosser Moka 2 fois par semaine et vérifier qu'elle s'hydrate bien."}
          {pet.species === 'chien' && "À 7 ans, Oslo entre dans sa phase senior. Un bilan articulaire et une surveillance du poids aident à préserver son confort de marche lors des balades."}
          {pet.species === 'lapin' && "Le foin doit composer 80% de l'alimentation de Pixel pour assurer l'usure de ses dents et la motilité continue de son système digestif."}
        </p>
      </div>

    </div>
  );
}
