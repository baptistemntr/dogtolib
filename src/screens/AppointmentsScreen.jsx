import React, { useState } from 'react';
import { 
  Calendar, Search, MapPin, Clock, Star, ShieldCheck, Check, 
  ChevronRight, ArrowLeft, Filter, Phone, AlertCircle, X, Sparkles, CheckCircle2
} from 'lucide-react';

export default function AppointmentsScreen({ 
  activePet, 
  professionals = [], 
  onBookAppointment, 
  onNavigate,
  onOpenToast 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPro, setSelectedPro] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedReason, setSelectedReason] = useState('Consultation générale & Bilan');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Motifs de rendez-vous
  const consultationReasons = [
    { id: 'general', label: 'Consultation générale & Bilan', duration: '20 min', price: '48€' },
    { id: 'vaccine', label: 'Vaccination & Rappel annuel', duration: '20 min', price: '65€' },
    { id: 'teeth', label: 'Contrôle dentaire & Détartrage', duration: '30 min', price: '50€' },
    { id: 'dermatology', label: 'Dermatologie & Démangeaisons', duration: '25 min', price: '55€' },
    { id: 'urgent_check', label: 'Consultation sous 48h (Symptôme)', duration: '30 min', price: '55€' },
    { id: 'osteo', label: 'Séance ostéopathie & mobilités', duration: '45 min', price: '70€' }
  ];

  // Catégories de filtres
  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'generalist', label: 'Cliniques' },
    { id: 'specialist', label: 'Spécialistes' },
    { id: 'urgent', label: 'Créneaux urgents' },
    { id: 'complementary', label: 'Médecines douces' }
  ];

  // Jours avec créneaux fictifs mais réalistes
  const availableDays = [
    { day: "Aujourd'hui", date: "Dim. 18 Oct.", slots: ["16h30", "17h15", "18h00"] },
    { day: "Demain", date: "Lun. 19 Oct.", slots: ["09h30", "10h15", "11h00", "14h30", "16h00"] },
    { day: "Mardi", date: "Mar. 20 Oct.", slots: ["10h00", "11h30", "15h00", "16h45", "17h30"] }
  ];

  // Filtrage des professionnels
  const filteredPros = professionals.filter(pro => {
    // Ne pas inclure le centre d'urgence pure dans la recherche classique de RDV (réservé à l'onglet Urgences)
    if (pro.category === 'emergency') return false;

    // Filtre catégorie
    if (selectedCategory === 'urgent' && !pro.urgentSlots) return false;
    if (selectedCategory !== 'all' && selectedCategory !== 'urgent' && pro.category !== selectedCategory) return false;

    // Filtre recherche textuelle
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = pro.name.toLowerCase().includes(q);
      const matchType = pro.type.toLowerCase().includes(q);
      const matchAddress = pro.address.toLowerCase().includes(q);
      if (!matchName && !matchType && !matchAddress) return false;
    }

    return true;
  });

  const handleOpenBooking = (pro, slot, date) => {
    setSelectedPro(pro);
    setSelectedSlot({ time: slot, date: date });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedPro || !selectedSlot) return;

    const newAppointment = {
      date: selectedSlot.date,
      time: selectedSlot.time,
      clinic: selectedPro.name,
      practitioner: selectedPro.practitioner || "Dr. Vétérinaire",
      reason: selectedReason,
      address: selectedPro.address,
      confirmed: true
    };

    onBookAppointment({
      title: selectedReason,
      appointment: newAppointment
    });

    setIsConfirmModalOpen(false);
    setBookingSuccess(true);
    if (onOpenToast) {
      onOpenToast(`Rendez-vous confirmé le ${selectedSlot.date} à ${selectedSlot.time} pour ${activePet?.name || 'votre animal'} !`);
    }

    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20 bg-slate-50">
      
      {/* Top Header */}
      <div className="bg-[#0F4C5C] text-white pt-6 pb-5 px-4 rounded-b-[2rem] shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Calendar className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight leading-tight">Prendre rendez-vous</h1>
              <p className="text-[11px] text-white/80 font-medium">Pour {activePet?.name} ({activePet?.speciesLabel})</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-300" />
            100% Vétérinaires vérifiés
          </span>
        </div>

        {/* Search Input */}
        <div className="relative mt-2">
          <Search className="w-4 h-4 text-white/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nom du praticien, clinique ou arrondissement..."
            className="w-full bg-white/15 text-white placeholder-white/60 text-xs rounded-2xl pl-10 pr-4 py-2.5 border border-white/20 focus:outline-none focus:bg-white/25 focus:border-white/40 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-3 pt-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-white text-[#0F4C5C] shadow-sm'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        
        {/* Next Appointment Card (if already scheduled) */}
        {activePet?.nextAppointment && (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Rendez-vous à venir confirmé
              </span>
              <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {activePet.nextAppointment.date} • {activePet.nextAppointment.time}
              </span>
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">{activePet.nextAppointment.clinic}</h3>
            <p className="text-xs text-slate-600">{activePet.nextAppointment.practitioner} • {activePet.nextAppointment.reason}</p>
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-emerald-200/60 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                {activePet.nextAppointment.address}
              </span>
              <button 
                onClick={() => onNavigate('passport')}
                className="font-bold text-[#0F4C5C] hover:underline"
              >
                Voir dans le carnet →
              </button>
            </div>
          </div>
        )}

        {/* Results Count & Subtitle */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-700">
            {filteredPros.length} vétérinaires disponibles autour de vous
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Paris & Île-de-France</span>
        </div>

        {/* List of Professionals */}
        <div className="space-y-3">
          {filteredPros.map(pro => (
            <div 
              key={pro.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs hover:border-[#0F4C5C]/30 transition-all"
            >
              {/* Top pro header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{pro.name}</h3>
                  <p className="text-[11px] text-slate-500 font-medium">{pro.type}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {pro.rating}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{pro.reviewCount} avis</span>
                    <span className="text-slate-400">•</span>
                    <span className="flex items-center gap-0.5 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {pro.distance}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-[#0F4C5C] block">dès {pro.consultationPrice}</span>
                  <span className="text-[10px] text-slate-400">Conventionné</span>
                </div>
              </div>

              {/* Address */}
              <div className="text-[11px] text-slate-500 mt-2 bg-slate-50 px-2.5 py-1 rounded-xl flex items-center justify-between">
                <span>📍 {pro.address}</span>
                <a href={`tel:${pro.phone}`} className="font-bold text-[#0F4C5C] flex items-center gap-1 hover:underline">
                  <Phone className="w-3 h-3" />
                  {pro.phone}
                </a>
              </div>

              {/* Slots Calendar Grid (Doctolib style) */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Prochains créneaux de consultation :
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  {availableDays.map((dayItem, dIdx) => (
                    <div key={dIdx} className="bg-slate-50 rounded-2xl p-2 border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-700 block">{dayItem.day}</span>
                      <span className="text-[9px] text-slate-400 block mb-1.5">{dayItem.date}</span>
                      
                      <div className="space-y-1">
                        {dayItem.slots.slice(0, 3).map((slot, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleOpenBooking(pro, slot, dayItem.date)}
                            className="w-full py-1 px-1 rounded-lg bg-teal-50 hover:bg-[#0F4C5C] text-[#0F4C5C] hover:text-white font-bold text-[10px] transition-colors border border-teal-200/60 hover:border-transparent active:scale-95"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Confirmation Booking Modal */}
      {isConfirmModalOpen && selectedPro && selectedSlot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white rounded-t-[2.5rem] sm:rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#0F4C5C]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Confirmer votre rendez-vous</h3>
                  <p className="text-[10px] text-slate-500">Pour {activePet?.name} ({activePet?.speciesLabel})</p>
                </div>
              </div>
              <button 
                onClick={() => setIsConfirmModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Date & Pro Recap */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Date et heure</span>
                <span className="text-xs font-black text-[#0F4C5C] bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
                  {selectedSlot.date} à {selectedSlot.time}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 pt-1">{selectedPro.name}</div>
              <div className="text-[11px] text-slate-500">{selectedPro.address}</div>
            </div>

            {/* Reason selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">
                Motif de consultation :
              </label>
              <div className="space-y-1">
                {consultationReasons.map(reason => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.label)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      selectedReason === reason.label
                        ? 'bg-teal-50/80 border-[#0F4C5C] text-[#0F4C5C] font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 text-xs'
                    }`}
                  >
                    <div>
                      <div className="text-xs">{reason.label}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{reason.duration}</div>
                    </div>
                    <span className="text-xs font-bold">{reason.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Auto-sync badge */}
            <div className="bg-emerald-50 rounded-2xl p-2.5 border border-emerald-200 flex items-start gap-2 text-[11px] text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Dossier Dogtolib pré-rempli :</strong> Les vaccins, antécédents et allergies de {activePet?.name} seront automatiquement synchronisés pour le praticien.
              </span>
            </div>

            {/* CTA Confirm */}
            <button
              onClick={handleConfirmBooking}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0F4C5C] hover:bg-[#0c3c49] active:scale-98 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Confirmer ce rendez-vous</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
