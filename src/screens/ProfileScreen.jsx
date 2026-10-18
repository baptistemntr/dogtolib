import React, { useState } from 'react';
import { 
  User, Bell, Shield, Heart, Share2, Plus, Settings, 
  ChevronRight, CheckCircle2, Lock, Download, Smartphone
} from 'lucide-react';

export default function ProfileScreen({ 
  pets = [], 
  activePetId, 
  onSelectPet, 
  onNavigate, 
  onOpenToast 
}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    vaccines: true,
    treatments: true,
    appointments: true,
    emergencyAlerts: true
  });

  const toggleNotif = (key) => {
    setNotificationsEnabled(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (onOpenToast) {
        onOpenToast(next[key] ? "Notification activée" : "Notification désactivée");
      }
      return next;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-slate-50">
      
      {/* Top Header Profile */}
      <div className="bg-[#0F4C5C] text-white pt-6 pb-6 px-4 rounded-b-[2.5rem] shadow-md">
        <div className="flex items-center gap-3">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
            alt="Léa Martin" 
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
          />
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full inline-block mb-1">
              Compte vérifié FranceConnect
            </span>
            <h1 className="text-lg font-black tracking-tight leading-tight">Léa Martin</h1>
            <p className="text-xs text-white/80">Paris 11e • {pets.length} animaux protégés</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        
        {/* Pets Management */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm">Mes compagnons ({pets.length})</h3>
            <button 
              onClick={() => onOpenToast && onOpenToast("Formulaire d'ajout d'animal ouvert")}
              className="text-[11px] font-bold text-[#0F4C5C] flex items-center gap-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter un animal
            </button>
          </div>

          <div className="space-y-2">
            {pets.map(pet => {
              const isActive = pet.id === activePetId;
              return (
                <div 
                  key={pet.id}
                  onClick={() => onSelectPet(pet.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-teal-50/60 border-[#0F4C5C] shadow-2xs' 
                      : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={pet.photo} 
                      alt={pet.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-white shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-xs">{pet.name}</span>
                        {isActive && (
                          <span className="text-[9px] bg-[#0F4C5C] text-white px-1.5 py-0.5 rounded-full font-bold">
                            Actif
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{pet.speciesLabel} • {pet.age} • {pet.weight}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pet.preventionScore?.status === 'up_to_date'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : pet.preventionScore?.status === 'overdue'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {pet.preventionScore?.label || 'À jour'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications & Preventive Alerts */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#0F4C5C]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Rappels de santé préventifs</h3>
              <p className="text-[10px] text-slate-500">Notifications push et alertes vétérinaires</p>
            </div>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            {[
              { key: 'vaccines', title: 'Rappels vaccinaux annuels', desc: 'Alerte 30j et 7j avant la date d\'échéance' },
              { key: 'treatments', title: 'Traitements antiparasitaires', desc: 'Rappels mensuels pipettes et vermifuges' },
              { key: 'appointments', title: 'Rappels de rendez-vous', desc: 'SMS et notification la veille et H-2' },
              { key: 'emergencyAlerts', title: 'Alertes sanitaires locales', desc: 'Cas de chenil ou leishmaniose à Paris' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-bold text-slate-800">{item.title}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </div>
                <button
                  onClick={() => toggleNotif(item.key)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                    notificationsEnabled[item.key] ? 'bg-[#0F4C5C]' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      notificationsEnabled[item.key] ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Care & Co-owner */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#0F4C5C]">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Partage de garde & Petsitter</h3>
                <p className="text-[10px] text-slate-500">Autoriser un tiers à accéder au carnet</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">Julien Martin (Co-titulaire)</span>
              <p className="text-[11px] text-slate-500">Accès complet • julien.m@example.fr</p>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Actif</span>
          </div>

          <button 
            onClick={() => onOpenToast && onOpenToast("Lien d'invitation temporaire copié !")}
            className="w-full py-2.5 rounded-xl border border-[#0F4C5C]/30 text-[#0F4C5C] font-bold text-xs hover:bg-teal-50/50 transition-colors"
          >
            + Inviter un petsitter / garde temporaire
          </button>
        </div>

      </div>

    </div>
  );
}
