import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Camera, 
  Calendar, 
  PhoneCall, 
  Sparkles,
  Info,
  Check,
  UploadCloud,
  FileCheck2,
  Stethoscope
} from 'lucide-react';
import { SpeciesBadge } from '../components/SpeciesIcon';

export default function TriageScreen({ pet, onCancel, onBookAppointment, onSaveToPassport }) {
  // Step: 1, 2, 3, 4, 5, 'result'
  const [step, setStep] = useState(1);

  // Form states
  const [symptom, setSymptom] = useState('vomiting'); // 'vomiting', 'diarrhea', 'appetite', 'lethargy', 'limp', 'skin', 'other'
  const [duration, setDuration] = useState('today'); // 'less_2h', 'today', '24_48h', 'more_3d'
  const [behavior, setBehavior] = useState('eating_less_reactive'); // 'normal', 'eating_less_reactive', 'prostrated', 'apathetic'
  const [gravitySigns, setGravitySigns] = useState(['none']); // ['respiratory', 'bloated_belly', 'convulsions', 'blood', 'none']
  const [photoAdded, setPhotoAdded] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  // Toggle gravity signs (multi-select with 'none' mutual exclusion)
  const toggleGravitySign = (key) => {
    if (key === 'none') {
      setGravitySigns(['none']);
      return;
    }
    const filtered = gravitySigns.filter(s => s !== 'none');
    if (filtered.includes(key)) {
      const remaining = filtered.filter(s => s !== key);
      setGravitySigns(remaining.length === 0 ? ['none'] : remaining);
    } else {
      setGravitySigns([...filtered, key]);
    }
  };

  // Deterministic evaluation logic based on rules
  const evaluateTriage = () => {
    const hasEmergencySign = gravitySigns.some(s => ['respiratory', 'bloated_belly', 'convulsions', 'blood'].includes(s));
    
    // Level 1: Urgence immédiate
    if (hasEmergencySign || behavior === 'apathetic') {
      return {
        level: 'emergency',
        title: "Urgence vétérinaire immédiate",
        color: "#D90429",
        bgBadge: "bg-rose-100 text-[#D90429] border-rose-300",
        borderCard: "border-rose-300",
        why: "Présence de signaux d'alerte vitaux nécessitant une prise en charge médicale sans délai (détresse physiologique, suspicion d'occlusion ou état de choc).",
        criticalSignsWarning: [
          "Altération brutale de l'état de conscience",
          "Difficultés respiratoires persistantes",
          "Hypothermie ou gencives très pâles/bleutées"
        ],
        recommendedAction: "emergency_call",
        actionLabel: "Appeler les urgences 24/7 (01 43 55 99 99)"
      };
    }

    // Level 2: Rendez-vous sous 48 h (Matches Moka vomiting on Sunday evening scenario!)
    if (
      symptom === 'vomiting' ||
      symptom === 'diarrhea' ||
      duration === 'today' ||
      duration === '24_48h' ||
      behavior === 'eating_less_reactive' ||
      behavior === 'prostrated'
    ) {
      return {
        level: 'consult_48h',
        title: "À voir en consultation sous 48 h",
        subtitle: "Créneau recommandé dès lundi matin",
        color: "#E36414",
        bgBadge: "bg-orange-100 text-[#E36414] border-orange-300",
        borderCard: "border-orange-300",
        why: `Les épisodes répétés chez le ${pet.speciesLabel.toLowerCase()} peuvent entraîner une déshydratation rapide et nécessitent un examen clinique pour écarter toute gastrite aiguë ou ingestion de corps étranger.`,
        criticalSignsWarning: [
          "Si les vomissements deviennent incoercibles (plus de 3 fois en quelques heures)",
          "Si l'animal cesse totalement de boire ou devient prostré",
          "Si vous observez du sang rouge ou marc de café dans les rejets",
          "Si le ventre devient dur ou douloureux à la palpation"
        ],
        recommendedAction: "book_48h",
        actionLabel: "Prendre rendez-vous (conseillé lundi matin)"
      };
    }

    // Level 3: Suivi à distance / Téléconseil
    if (duration === 'less_2h' && behavior === 'normal') {
      return {
        level: 'teleconsult',
        title: "Suivi à distance ou téléconseil",
        color: "#0F4C5C",
        bgBadge: "bg-[#0F4C5C]/15 text-[#0F4C5C] border-[#0F4C5C]/30",
        borderCard: "border-[#0F4C5C]/30",
        why: "L'animal conserve son dynamisme et son appétit. Une première évaluation à distance avec votre clinique habituelle permet de vérifier la conduite à tenir.",
        criticalSignsWarning: [
          "Apparition de léthargie ou refus de s'alimenter dans les 12h",
          "Aggravation de la fréquence des symptômes"
        ],
        recommendedAction: "teleconsult",
        actionLabel: "Demander un téléconseil à votre vétérinaire"
      };
    }

    // Level 4: Surveillance à domicile
    return {
      level: 'home_watch',
      title: "Surveillance attentive à domicile",
      color: "#2A9D8F",
      bgBadge: "bg-emerald-100 text-emerald-800 border-emerald-300",
      borderCard: "border-emerald-300",
      why: "Épisode isolé sans altération de l'état général. Maintien de l'observation pendant 24 à 48 heures avec diète légère possible.",
      criticalSignsWarning: [
        "Répétition du symptôme plus de 2 fois dans la journée",
        "Baisse d'énergie brutale ou fièvre ressentie"
      ],
      recommendedAction: "home_guide",
      actionLabel: "Consulter le guide de surveillance 24h"
    };
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setStep('result');
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onCancel();
    } else if (step === 'result') {
      setStep(5);
    } else {
      setStep(step - 1);
    }
  };

  const result = evaluateTriage();

  return (
    <div className="flex-1 flex flex-col bg-[#F6F1E9] h-full overflow-hidden select-none">
      
      {/* Top Header with Progress Bar */}
      <div className="bg-white px-4 pt-2 pb-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Annuler' : 'Retour'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#0F4C5C]">
              {step === 'result' ? 'Bilan' : `Étape ${step} sur 5`}
            </span>
          </div>

          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {pet.name}
          </span>
        </div>

        {/* 5-Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
          {[1, 2, 3, 4, 5].map((i) => {
            const isCompleted = step === 'result' || step > i;
            const isCurrent = step === i;
            return (
              <div
                key={i}
                className={`flex-1 h-full mx-0.5 first:ml-0 last:mr-0 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#0F4C5C]'
                    : isCurrent
                    ? 'bg-[#E36414]'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        
        {/* ================= STEP 1: Symptôme principal ================= */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E36414]">
                Question 1 / 5
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                Quel est le signe ou symptôme principal chez {pet.name} ?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sélectionnez le motif qui vous inquiète le plus actuellement.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'vomiting', label: 'Vomissements ou régurgitations', desc: 'Rejets alimentaires, mousse blanche ou bile', icon: '🤮' },
                { id: 'diarrhea', label: 'Diarrhée ou selles très liquides', desc: 'Troubles du transit, selles fréquentes', icon: '💧' },
                { id: 'appetite', label: 'Perte totale d’appétit / Refus d’eau', desc: 'Ne touche plus sa gamelle habituelle', icon: '🥣' },
                { id: 'lethargy', label: 'Abattement ou prostration', desc: 'Semble faible, reste couché(e), isolé(e)', icon: '💤' },
                { id: 'limp', label: 'Boiterie ou douleur à une patte', desc: 'Difficulté à poser une patte, raideur', icon: '🐾' },
                { id: 'skin', label: 'Démangeaisons ou grattage intense', desc: 'Léchage compulsif, plaques rouges', icon: '🩹' },
                { id: 'other', label: 'Autre comportement inhabituel', desc: 'Changement d’attitude sans signe physique évident', icon: '❓' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSymptom(item.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    symptom === item.id
                      ? 'bg-white border-[#0F4C5C] ring-2 ring-[#0F4C5C]/20 shadow-sm'
                      : 'bg-white/80 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    symptom === item.id ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white' : 'border-slate-300'
                  }`}>
                    {symptom === item.id && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 2: Depuis quand ================= */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E36414]">
                Question 2 / 5
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                Depuis quand avez-vous remarqué ce symptôme ?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                La durée permet d'évaluer le risque de déshydratation ou d'évolution.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'less_2h', label: 'Moins de 2 heures', desc: 'Très récent, apparition soudaine' },
                { id: 'today', label: 'Aujourd’hui (quelques heures)', desc: 'Plusieurs épisodes au cours de la journée' },
                { id: '24_48h', label: 'Depuis 24 à 48 heures', desc: 'Persiste depuis hier ou avant-hier' },
                { id: 'more_3d', label: 'Depuis plus de 3 jours', desc: 'Trouble installé ou récurrent' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDuration(item.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    duration === item.id
                      ? 'bg-white border-[#0F4C5C] ring-2 ring-[#0F4C5C]/20 shadow-sm'
                      : 'bg-white/80 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    duration === item.id ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white' : 'border-slate-300'
                  }`}>
                    {duration === item.id && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 3: Appétit & Comportement ================= */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#E36414]">
                Question 3 / 5
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                Quel est l'état d'esprit et l'appétit de {pet.name} ?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                La réactivité est un indicateur de bien-être essentiel chez l'animal.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'normal', label: 'Mange et joue normalement', desc: 'Vif, curieux, réagit immédiatement à son nom' },
                { id: 'eating_less_reactive', label: 'Mange un peu moins, mais reste réactif(ve)', desc: 'Moins d’énergie que d’habitude mais s’intéresse à son entourage' },
                { id: 'prostrated', label: 'Refuse de s’alimenter et reste prostré(e)', desc: 'Reste couché(e) dans son coin, refuse friandises et caresses' },
                { id: 'apathetic', label: 'Apathique, ne réagit presque plus', desc: 'Regard terne, ne se lève plus ou faiblesse extrême' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setBehavior(item.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    behavior === item.id
                      ? 'bg-white border-[#0F4C5C] ring-2 ring-[#0F4C5C]/20 shadow-sm'
                      : 'bg-white/80 border-slate-200/80 hover:bg-white'
                  }`}
                >
                  <div className="pr-2">
                    <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border shrink-0 flex items-center justify-center ${
                    behavior === item.id ? 'border-[#0F4C5C] bg-[#0F4C5C] text-white' : 'border-slate-300'
                  }`}>
                    {behavior === item.id && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 4: Signes de gravité ================= */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D90429]">
                Question 4 / 5 — Signes d'alerte
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                Observez-vous un ou plusieurs signes critiques ?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Cochez tous les signes observés ou confirmez leur absence.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'respiratory', label: 'Difficulté respiratoire ou halètement gueule ouverte', critical: true },
                { id: 'bloated_belly', label: 'Ventre très gonflé, dur ou douloureux au toucher', critical: true },
                { id: 'convulsions', label: 'Convulsions, tremblements intenses ou perte d’équilibre', critical: true },
                { id: 'blood', label: 'Présence visible de sang (vomi, urine, selles)', critical: true },
                { id: 'none', label: 'Aucun de ces signes critiques', critical: false },
              ].map((item) => {
                const isSelected = gravitySigns.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleGravitySign(item.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? item.critical
                          ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-200'
                          : 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.critical ? (
                        <AlertTriangle className={`w-4 h-4 ${isSelected ? 'text-[#D90429]' : 'text-slate-400'}`} />
                      ) : (
                        <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      )}
                      <span className={`text-xs font-bold ${
                        isSelected 
                          ? item.critical ? 'text-[#D90429]' : 'text-emerald-900' 
                          : 'text-slate-800'
                      }`}>
                        {item.label}
                      </span>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                      isSelected
                        ? item.critical ? 'bg-[#D90429] border-[#D90429] text-white' : 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 5: Ajout de photo (simulé) ================= */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0F4C5C]">
                Question 5 / 5 (Facultatif)
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                Souhaitez-vous joindre une photo ou courte vidéo ?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                La photo sera transmise au dossier vétérinaire pour faciliter le diagnostic.
              </p>
            </div>

            {/* Simulated Upload Container */}
            <div 
              onClick={() => setPhotoAdded(!photoAdded)}
              className={`border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer ${
                photoAdded
                  ? 'border-[#0F4C5C] bg-[#0F4C5C]/5'
                  : 'border-slate-300 bg-white hover:border-[#0F4C5C]/50'
              }`}
            >
              {photoAdded ? (
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <img
                      src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=300&auto=format&fit=crop&q=80"
                      alt="Aperçu photo"
                      className="w-28 h-28 object-cover rounded-2xl mx-auto shadow-md border-2 border-white"
                    />
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white p-1 rounded-full">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F4C5C]">Photo analysable enregistrée</p>
                    <p className="text-[11px] text-slate-400">Cliquez pour modifier ou retirer</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#E36414] mx-auto flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Ajouter une photo (rejet, lésion, posture)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Simuler l'appareil photo ou la galerie
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-full">
                    Prendre un cliché fictif
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 bg-white rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#0F4C5C] shrink-0 mt-0.5" />
              <span>
                Vous pouvez passer cette étape sans photo. Le tri est calculé en fonction de vos observations cliniques.
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP RESULT ================= */}
        {step === 'result' && (
          <div className="space-y-4 animate-in zoom-in-95 duration-200">
            
            {/* Main Result Card */}
            <div className={`bg-white rounded-3xl p-5 border-2 shadow-md ${result.borderCard}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${result.bgBadge}`}>
                  Niveau d'orientation
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">
                  Patient : {pet.name}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 leading-tight mb-1" style={{ color: result.color }}>
                {result.title}
              </h2>
              {result.subtitle && (
                <p className="text-xs font-bold text-slate-700 mb-2">
                  {result.subtitle}
                </p>
              )}

              {/* Pourquoi cette orientation */}
              <div className="bg-[#F6F1E9]/70 rounded-2xl p-3 border border-slate-200/60 my-3 text-left">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Pourquoi cette évaluation ?
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {result.why}
                </p>
              </div>

              {/* Signes d'alerte qui feraient passer en urgence */}
              <div className="bg-rose-50/70 rounded-2xl p-3 border border-rose-200/80 text-left my-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#D90429] mb-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Signes qui feraient passer immédiatement en urgence :</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-700 list-disc list-inside">
                  {result.criticalSignsWarning.map((warning, wIdx) => (
                    <li key={wIdx}>{warning}</li>
                  ))}
                </ul>
              </div>

              {/* Bouton d'action principale recommandé */}
              <div className="mt-4 space-y-2">
                {result.recommendedAction === 'emergency_call' ? (
                  <a
                    href="tel:0143559999"
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#D90429] hover:bg-[#b00320] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{result.actionLabel}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => onBookAppointment(result)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#E36414] hover:bg-[#C5530E] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 transition-all active:scale-98"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{result.actionLabel}</span>
                  </button>
                )}

                {/* Enregistrer dans le passeport de l'animal */}
                <button
                  onClick={() => {
                    onSaveToPassport({
                      symptom,
                      duration,
                      resultTitle: result.title,
                      date: "Aujourd'hui 20h45"
                    });
                    setSavedNotification(true);
                    setTimeout(() => setSavedNotification(false), 2500);
                  }}
                  className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    savedNotification
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-[#0F4C5C] hover:bg-slate-50'
                  }`}
                >
                  {savedNotification ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      Fiche enregistrée dans le passeport de {pet.name} !
                    </>
                  ) : (
                    <>
                      <FileCheck2 className="w-4 h-4" />
                      Enregistrer ce bilan dans le passeport
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* MENTION LÉGALE VISIBLE OBLIGATOIRE */}
            <div className="bg-slate-100/90 rounded-2xl p-3 border border-slate-200 text-center">
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                ⚖️ <strong>Orientation indicative</strong>, ne remplace pas l'avis d'un vétérinaire. En cas de doute ou d'aggravation subite, contactez une permanence d'urgence.
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Sticky Action Bar (steps 1 to 5) */}
      {step !== 'result' && (
        <div className="bg-white p-3.5 border-t border-slate-200 shrink-0 flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Précédent
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F4C5C] hover:bg-[#16697A] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <span>{step === 5 ? 'Voir le résultat du tri' : 'Question suivante'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
