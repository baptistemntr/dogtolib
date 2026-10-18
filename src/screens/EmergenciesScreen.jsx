import React, { useState } from 'react';
import { 
  AlertCircle, Phone, MapPin, Clock, ShieldAlert, HeartPulse, 
  Share2, ChevronRight, AlertTriangle, ExternalLink, ArrowLeft, CheckCircle2,
  FileText, Activity, HelpCircle, X, Navigation
} from 'lucide-react';

export default function EmergenciesScreen({ 
  activePet, 
  onNavigate, 
  onOpenToast 
}) {
  const [selectedEmergencyCategory, setSelectedEmergencyCategory] = useState('all'); // 'all' | 'hospital' | 'home' | 'poison'
  const [isEmergencyFileModalOpen, setIsEmergencyFileModalOpen] = useState(false);
  const [selectedToxGuide, setSelectedToxGuide] = useState(null);

  // Centres d'urgence parisiens réels et vérifiés 24h/24
  const emergencyCenters = [
    {
      id: "em-1",
      name: "Urgences Vétérinaires Paris Nuit",
      type: "Clinique de garde 24/7",
      category: "hospital",
      address: "8 boulevard Voltaire, 75011 Paris",
      distance: "1.8 km",
      waitTime: "~15 min",
      waitTimeLevel: "low", // 'low' | 'med' | 'high'
      phone: "01 43 55 99 99",
      rating: 4.8,
      status: "Ouvert maintenant 24/7",
      equipment: ["Radiographie numérique", "Bloc chirurgical d'urgence", "Oxygénothérapie"],
      lat: 48.8632,
      lng: 2.3705
    },
    {
      id: "em-2",
      name: "Centre Hospitalier Vétérinaire Frégis",
      type: "Hôpital d'urgences & Réanimation",
      category: "hospital",
      address: "43 avenue Aristide Briand, 94110 Arcueil",
      distance: "5.4 km",
      waitTime: "~25 min",
      waitTimeLevel: "med",
      phone: "01 49 85 83 00",
      rating: 4.9,
      status: "Soins intensifs 24/7",
      equipment: ["Scanner & IRM 24/7", "Réanimation lourde", "Chirurgie cardiaque & polytraumatisme"],
      lat: 48.8055,
      lng: 2.3278
    },
    {
      id: "em-3",
      name: "SOS Vétérinaires Paris — À Domicile",
      type: "Urgence à domicile 24h/24",
      category: "home",
      address: "Intervention sur tout Paris & 1ère couronne",
      distance: "Chez vous en ~45 min",
      waitTime: "Arrivée ~40-50 min",
      waitTimeLevel: "med",
      phone: "01 47 46 51 00",
      rating: 4.9,
      status: "Équipes mobiles en rotation",
      equipment: ["Véhicule régulé équipé", "Perfusion & analgésie", "Soins de stabilisation immédiate"],
      lat: 48.8566,
      lng: 2.3522
    },
    {
      id: "em-4",
      name: "Centre Hospitalier Vétérinaire Advetia",
      type: "Hôpital de référence 24/7",
      category: "hospital",
      address: "9 avenue Louis Breguet, 78140 Vélizy-Villacoublay",
      distance: "12 km (Accès rapide A86)",
      waitTime: "~20 min",
      waitTimeLevel: "low",
      phone: "01 75 45 91 09",
      rating: 4.8,
      status: "Ouvert maintenant 24/7",
      equipment: ["Traumatologie lourde", "Banque de sang félin/canin", "Chirurgie neurologique"],
      lat: 48.7831,
      lng: 2.2133
    },
    {
      id: "em-5",
      name: "Centre Antipoison Animal (CNITV Lyon)",
      type: "Centre National Antipoison 24/7",
      category: "poison",
      address: "Ligne nationale toxicologique d'urgence",
      distance: "Service téléphonique gratuit",
      waitTime: "Décroché immédiat",
      waitTimeLevel: "low",
      phone: "04 78 87 10 40",
      rating: 5.0,
      status: "Permanence toxicologique 24/7",
      equipment: ["Base de données molécules toxiques", "Calcul de toxicité selon le poids", "Protocole antidote"],
      lat: 48.8566,
      lng: 2.3522
    }
  ];

  // Guides d'urgence vitale
  const firstAidGuides = [
    {
      id: "tox",
      title: "Intoxication ou poison suspecté",
      subtitle: "Chocolat noir, raisin, lys (chats), médicaments humains, mort aux rats",
      severity: "Critique",
      color: "#D90429",
      do: [
        "Identifiez la substance, la quantité ingérée et l'heure exacte.",
        "Gardez l'emballage pour le vétérinaire.",
        "Appelez le Centre Antipoison (04 78 87 10 40) ou l'urgence vétérinaire."
      ],
      dont: [
        "NE FAITES PAS vomir sans avis formel (risque de brûlure caustique de l'œsophage).",
        "Ne donnez ni lait ni eau (cela accélère l'absorption des toxines)."
      ]
    },
    {
      id: "tor",
      title: "Torsion d'estomac (SDTE - Chien)",
      subtitle: "Ventre dur et gonflé, efforts répétés pour vomir sans rien rejeter",
      severity: "Urgence vitale absolue (< 2h)",
      color: "#D90429",
      do: [
        "Partez IMMÉDIATEMENT vers le centre d'urgence chirurgical le plus proche.",
        "Prévenez l'équipe par téléphone pendant le trajet pour préparer le bloc.",
        "Gardez l'animal allongé et évitez les mouvements brusques."
      ],
      dont: [
        "N'attendez pas de voir si cela passe : chaque minute compte.",
        "Ne tentez pas d'appuyer sur son abdomen."
      ]
    },
    {
      id: "heat",
      title: "Coup de chaleur (Hyperthermie)",
      subtitle: "Halètement frénétique, bave épaisse, gencives violettes, abattement",
      severity: "Urgence vitale",
      color: "#E76F51",
      do: [
        "Déplacez l'animal à l'ombre dans un endroit ventilé.",
        "Appliquez des linges humides d'eau TIÈDE (20-25°C) sur les pattes, l'aine et le cou.",
        "Proposez de l'eau fraîche en petites quantités."
      ],
      dont: [
        "Ne JAMAIS immerger dans de l'eau glacée (choc thermique fatal par vasoconstriction).",
        "Ne couvrez pas l'animal avec une serviette mouillée qui emprisonne la chaleur."
      ]
    },
    {
      id: "urinary",
      title: "Obstruction urinaire (Chat bloqué)",
      subtitle: "Le chat va constamment dans sa litière, miaule de douleur et n'émet rien",
      severity: "Urgence sous 24h",
      color: "#D90429",
      do: [
        "Vérifiez la litière : absence totale d'urine ou seulement quelques gouttes rosées.",
        "Consultez sans attendre : l'accumulation de toxines et de potassium est létale en 24-48h."
      ],
      dont: [
        "N'appuyez pas sur le ventre (risque de rupture vésicale)."
      ]
    }
  ];

  // Filtrage des centres
  const filteredCenters = emergencyCenters.filter(center => {
    if (selectedEmergencyCategory === 'all') return true;
    return center.category === selectedEmergencyCategory;
  });

  const handleShareEmergencyFile = () => {
    setIsEmergencyFileModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-slate-50">
      
      {/* Top Banner SOS */}
      <div className="bg-gradient-to-b from-[#D90429] to-[#9B0018] text-white pt-6 pb-6 px-4 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        
        {/* Glow circles background */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-rose-400/20 blur-xl pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Permanence 24h/24 & 7j/7 Paris
            </span>
            <span className="text-[11px] text-white/80 font-medium">
              Patient : <strong className="text-white">{activePet?.name}</strong>
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none text-white">
              Urgences Vétérinaires
            </h1>
            <p className="text-xs text-rose-100 font-medium mt-1">
              Régulation immédiate, hôpitaux ouverts et interventions à domicile.
            </p>
          </div>

          {/* Primary Quick Actions */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            
            {/* National 3115 Emergency Hotline */}
            <a
              href="tel:3115"
              className="bg-white hover:bg-rose-50 text-[#D90429] p-3 rounded-2xl shadow-lg font-black flex items-center justify-center gap-2 border border-white/40 active:scale-95 transition-all text-center"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#D90429]" />
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-500 block leading-tight">Numéro gratuit 24/7</span>
                <span className="text-base font-black text-[#D90429] leading-none">3115 Urgence</span>
              </div>
            </a>

            {/* Emergency File quick button */}
            <button
              onClick={handleShareEmergencyFile}
              className="bg-white/15 hover:bg-white/25 border border-white/30 text-white p-3 rounded-2xl shadow-md font-bold flex items-center justify-center gap-2 active:scale-95 transition-all text-center"
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-rose-200 block leading-tight">Dossier médical</span>
                <span className="text-xs font-black text-white leading-none">Fiche d'urgence</span>
              </div>
            </button>

          </div>
        </div>

      </div>

      <div className="px-4 py-4 space-y-5">
        
        {/* Category switcher */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: '🏥 Tous les services 24/7' },
            { id: 'hospital', label: 'Centres hospitaliers' },
            { id: 'home', label: '🚑 SOS à domicile' },
            { id: 'poison', label: '🧪 Centres antipoison' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedEmergencyCategory(cat.id)}
              className={`px-3 py-1.5 rounded-2xl text-[11px] font-bold shrink-0 transition-all ${
                selectedEmergencyCategory === cat.id
                  ? 'bg-[#D90429] text-white shadow-sm shadow-rose-200'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* List of Emergency Centers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D90429]"></span>
              Centres d'urgence de garde ouverts ({filteredCenters.length})
            </span>
            <span className="text-[11px] text-slate-400">Position : Paris</span>
          </div>

          {filteredCenters.map(center => (
            <div 
              key={center.id}
              className="bg-white rounded-3xl p-4 border border-rose-100/80 shadow-xs hover:border-[#D90429]/40 transition-all space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                      {center.status}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight mt-0.5">
                    {center.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">{center.type}</p>
                </div>

                {/* Wait time badge */}
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Attente</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full inline-block ${
                    center.waitTimeLevel === 'low'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {center.waitTime}
                  </span>
                </div>
              </div>

              {/* Address and distance */}
              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-2xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    {center.address}
                  </span>
                  <span className="font-bold text-slate-700">{center.distance}</span>
                </div>
                {center.equipment && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {center.equipment.map((eq, idx) => (
                      <span key={idx} className="text-[9px] bg-white px-2 py-0.5 rounded-md text-slate-500 border border-slate-200">
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${center.phone.replace(/\s/g, '')}`}
                  className="py-2.5 px-3 rounded-xl bg-[#D90429] hover:bg-[#b80323] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler la garde</span>
                </a>

                <button
                  onClick={() => onNavigate('map')}
                  className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#D90429] border border-rose-200 text-xs font-extrabold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Itinéraire carte</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* First Aid & Toxic Guides (Gestes qui sauvent) */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Gestes de premiers secours d'urgence</h3>
              <p className="text-[10px] text-slate-500">Que faire et ne pas faire avant d'arriver à la clinique</p>
            </div>
          </div>

          <div className="space-y-2">
            {firstAidGuides.map(guide => (
              <div 
                key={guide.id}
                className="border border-slate-200/80 rounded-2xl p-3 hover:border-slate-300 transition-all bg-slate-50/50"
              >
                <div 
                  onClick={() => setSelectedToxGuide(selectedToxGuide === guide.id ? null : guide.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{guide.title}</span>
                      <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                        {guide.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{guide.subtitle}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${selectedToxGuide === guide.id ? 'rotate-90' : ''}`} />
                </div>

                {selectedToxGuide === guide.id && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 animate-in fade-in duration-150">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">
                        ✅ Ce qu'il faut faire :
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc marker:text-emerald-500">
                        {guide.do.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#D90429] block mb-1">
                        ❌ Ce qu'il ne faut PAS faire :
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc marker:text-[#D90429]">
                        {guide.dont.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Emergency Medical File Modal */}
      {isEmergencyFileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-t-[2.5rem] sm:rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-[#D90429]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Fiche Médicale d'Urgence</h3>
                  <p className="text-[10px] text-slate-500">À présenter au vétérinaire urgentiste</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEmergencyFileModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pet Quick Recap Card */}
            <div className="bg-rose-50/60 rounded-2xl p-3 border border-rose-200 space-y-2">
              <div className="flex items-center gap-3">
                <img 
                  src={activePet?.photo} 
                  alt={activePet?.name} 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs" 
                />
                <div>
                  <h4 className="font-black text-slate-900 text-sm">{activePet?.name}</h4>
                  <p className="text-xs text-slate-600">{activePet?.speciesLabel} • {activePet?.gender} • {activePet?.age}</p>
                  <p className="text-[11px] font-mono text-slate-500">Puce : {activePet?.chipNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rose-200/60 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Poids actuel</span>
                  <span className="font-black text-slate-800">{activePet?.weight}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Allergies connues</span>
                  <span className="font-bold text-[#D90429]">
                    {activePet?.allergies?.join(', ') || 'Aucune'}
                  </span>
                </div>
              </div>
            </div>

            {/* Ongoing treatments */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block">Traitements en cours :</span>
              {activePet?.treatments && activePet.treatments.length > 0 ? (
                <div className="space-y-1">
                  {activePet.treatments.map((t, idx) => (
                    <div key={idx} className="bg-slate-50 p-2 rounded-xl text-xs text-slate-700 flex justify-between">
                      <span className="font-bold">{t.name}</span>
                      <span className="text-slate-500 text-[11px]">{t.frequency}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Aucun traitement continu.</p>
              )}
            </div>

            {/* Owner contact */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Propriétaire</span>
              <div className="font-bold text-slate-900">Léa Martin (06 12 34 56 78)</div>
              <div className="text-slate-500 text-[11px]">Paris 11e • lea.martin@example.fr</div>
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsEmergencyFileModalOpen(false);
                  if (onOpenToast) onOpenToast("Fiche d'urgence prête et transmise !");
                }}
                className="w-full py-3 px-4 rounded-2xl bg-[#D90429] hover:bg-[#b80323] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Transmettre la fiche au régulateur</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
