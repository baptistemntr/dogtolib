import React, { useState } from 'react';
import { 
  Share2, 
  ShieldCheck, 
  Syringe, 
  Pill, 
  FileText, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  Sparkles,
  Download,
  ExternalLink,
  ChevronDown,
  Info,
  Heart
} from 'lucide-react';
import { SpeciesBadge, SpeciesIcon } from '../components/SpeciesIcon';

export default function PassportScreen({ pet, onOpenShare }) {
  const [activeTab, setActiveTab] = useState('identity'); // 'identity' | 'vaccines' | 'treatments' | 'documents'

  if (!pet) return null;

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-20 pt-2 space-y-4">
      
      {/* Top Header Card with Share Action */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#0F4C5C] text-white p-0.5 rounded-full">
                <SpeciesIcon species={pet.species} className="w-2.5 h-2.5" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-[#0F4C5C] tracking-tight">
                  Passeport de {pet.name}
                </h1>
              </div>
              <p className="text-xs text-slate-500">
                N° {pet.passportNumber}
              </p>
            </div>
          </div>

          {/* Bouton Partager */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#0F4C5C] hover:bg-[#16697A] text-white text-xs font-bold shadow-sm transition-all active:scale-95 shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Partager</span>
          </button>
        </div>

        {/* Navigation Tabs - Segmented control sobre et moderne */}
        <div className="grid grid-cols-4 w-full bg-[#F6F1E9] p-1 rounded-2xl mt-4 border border-[#0F4C5C]/10 gap-1">
          {[
            { id: 'identity', label: 'Identité' },
            { id: 'vaccines', label: 'Vaccins' },
            { id: 'treatments', label: 'Traitements' },
            { id: 'documents', label: 'Documents' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full py-1.5 px-0.5 rounded-xl text-center transition-all text-[11px] leading-tight ${
                  isActive
                    ? 'bg-white text-[#0F4C5C] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      {activeTab === 'identity' && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Informations administratives & légales
            </h2>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F6F1E9]/60 p-2.5 rounded-xl border border-slate-200/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Espèce & Race</span>
                <span className="font-bold text-slate-800">{pet.speciesLabel}</span>
              </div>
              <div className="bg-[#F6F1E9]/60 p-2.5 rounded-xl border border-slate-200/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Sexe & Statut</span>
                <span className="font-bold text-slate-800">{pet.gender}</span>
              </div>
              <div className="bg-[#F6F1E9]/60 p-2.5 rounded-xl border border-slate-200/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Date de naissance</span>
                <span className="font-bold text-slate-800">{pet.birthDate}</span>
              </div>
              <div className="bg-[#F6F1E9]/60 p-2.5 rounded-xl border border-slate-200/50">
                <span className="text-[10px] text-slate-400 block font-semibold">Poids actuel / Cible</span>
                <span className="font-bold text-slate-800">{pet.weight} ({pet.idealWeight})</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Numéro d'identification I-CAD (Puce électronique)
              </span>
              <div className="flex items-center justify-between font-mono font-bold text-sm text-[#0F4C5C]">
                <span>{pet.chipNumber}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-sans font-semibold">
                  Validée I-CAD
                </span>
              </div>
            </div>

            {/* Allergies & Sensibilités */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Allergies et sensibilités signalées</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {pet.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="bg-white/90 border border-amber-300 text-amber-900 text-[11px] font-semibold px-2 py-0.5 rounded-lg shadow-2xs"
                  >
                    ⚠️ {allergy}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vaccines' && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Protocole vaccinal
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {pet.preventionScore.label}
              </span>
            </div>

            <div className="space-y-2.5">
              {pet.vaccines.map((vax, index) => {
                const isOverdue = vax.status === 'late';
                const isUpcoming = vax.status === 'upcoming';
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-2xl border transition-all ${
                      isOverdue
                        ? 'bg-rose-50/60 border-rose-200'
                        : isUpcoming
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-[#F6F1E9]/40 border-slate-200/70'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{vax.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Administré le : {vax.date}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Praticien : {vax.practitioner}
                        </p>
                      </div>

                      <div className="text-right">
                        {isOverdue ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#D90429] bg-rose-100 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3" /> En retard
                          </span>
                        ) : isUpcoming ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#E36414] bg-orange-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> À prévoir
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> À jour
                          </span>
                        )}
                        <p className="text-[10px] font-semibold text-slate-600 mt-1">
                          Prochain rappel : {vax.nextDue}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'treatments' && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Traitements & Antiparasitaires
            </h2>

            <div className="space-y-2.5">
              {pet.treatments.map((treatment, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#F6F1E9]/40 border border-slate-200/70"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F4C5C]">{treatment.name}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Actif
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 font-medium">
                    Posologie : {treatment.frequency}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <span>Donné : {treatment.lastGiven}</span>
                    <span className="font-semibold text-slate-700">Prochain : {treatment.nextDue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Documents & Certificats officiels
            </h2>

            <div className="space-y-2">
              {pet.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0F4C5C] shrink-0 shadow-2xs">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{doc.title}</p>
                      <p className="text-[10px] text-slate-400">
                        {doc.date} • {doc.type} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <button className="text-slate-400 group-hover:text-[#0F4C5C] p-1.5 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIFE TIMELINE (Une timeline de vie de l'animal, de l'adoption à aujourd'hui) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E36414]" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Timeline de vie de {pet.name}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {pet.timeline.length} événements
          </span>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#0F4C5C]/20">
          {pet.timeline.map((event, index) => {
            const isFirst = index === 0;
            return (
              <div key={event.id} className="relative group">
                {/* Node Bullet */}
                <span
                  className={`absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                    isFirst
                      ? 'bg-[#E36414] ring-orange-100 scale-125'
                      : event.type === 'vaccine'
                      ? 'bg-[#0F4C5C]'
                      : event.type === 'surgery'
                      ? 'bg-purple-600'
                      : event.type === 'illness'
                      ? 'bg-rose-500'
                      : 'bg-slate-400'
                  }`}
                />

                <div className="bg-[#F6F1E9]/50 rounded-2xl p-2.5 border border-slate-200/60 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-0.5">
                    <span>{event.date}</span>
                    <span className="uppercase text-[9px] px-1.5 py-0.2 rounded bg-white border border-slate-200 font-bold text-slate-600">
                      {event.type}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">
                    {event.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {event.details}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
