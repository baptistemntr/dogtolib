import React, { useState } from 'react';
import PhoneFrame from './components/PhoneFrame';
import BottomNav from './components/BottomNav';
import PetSelector from './components/PetSelector';
import QrShareModal from './components/QrShareModal';
import HomeScreen from './screens/HomeScreen';
import PassportScreen from './screens/PassportScreen';
import TriageScreen from './screens/TriageScreen';
import PlaceholderScreen from './screens/PlaceholderScreen';
import { initialData } from './data/mockData';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [appData, setAppData] = useState(initialData);
  const [currentScreen, setCurrentScreen] = useState('home'); // 'home' | 'passport' | 'triage' | 'appointments' | 'emergencies' | 'profile'
  const [activePetId, setActivePetId] = useState(initialData.activePetId);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const activePet = appData.pets.find(p => p.id === activePetId) || appData.pets[0];

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Switch pet
  const handleSelectPet = (petId) => {
    setActivePetId(petId);
  };

  // Start symptom triage
  const handleStartTriage = () => {
    setCurrentScreen('triage');
  };

  // Scenario completion: Booking appointment from Triage
  const handleBookFromTriage = (triageResult) => {
    // Automatically book the Monday 09:30 slot at Clinique des Batignolles for active pet (Moka scenario)
    const newAppointment = {
      date: "Lun. 5 Oct.",
      time: "09h30",
      clinic: "Clinique Vétérinaire des Batignolles",
      practitioner: "Dr. Paul Renaud",
      reason: `Consultation sous 48h : ${triageResult.title}`,
      address: "42 rue Nollet, 75017 Paris",
      confirmed: true
    };

    // Also append the medical triage event to the animal's life timeline
    const newTimelineEvent = {
      id: Date.now(),
      date: "Dim. 4 Oct. 20h45",
      title: "Tri des symptômes : Épisode de vomissements",
      type: "illness",
      details: "Orientation : Consultation recommandée sous 48h. Rendez-vous réservé pour lundi 09h30. Fiche clinique transmise au Dr. Renaud."
    };

    setAppData(prev => ({
      ...prev,
      pets: prev.pets.map(p => {
        if (p.id === activePetId) {
          return {
            ...p,
            nextAppointment: newAppointment,
            timeline: [newTimelineEvent, ...p.timeline]
          };
        }
        return p;
      })
    }));

    showToast(`Rendez-vous réservé lundi 09h30 pour ${activePet.name} !`);
    setCurrentScreen('passport');
  };

  // Save report to passport without booking
  const handleSaveToPassport = ({ symptom, duration, resultTitle, date }) => {
    const newTimelineEvent = {
      id: Date.now(),
      date: date || "Dim. 4 Oct.",
      title: `Bilan d'évaluation : ${resultTitle}`,
      type: "illness",
      details: `Symptôme évalué : ${symptom} (${duration}). Rapport archivé dans le dossier préventif de l'animal.`
    };

    setAppData(prev => ({
      ...prev,
      pets: prev.pets.map(p => {
        if (p.id === activePetId) {
          return {
            ...p,
            timeline: [newTimelineEvent, ...p.timeline]
          };
        }
        return p;
      })
    }));
  };

  return (
    <PhoneFrame currentTime="20:45">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="absolute top-12 left-4 right-4 z-50 bg-[#0F4C5C] text-white p-3 rounded-2xl shadow-xl flex items-center justify-between border border-white/20 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-white/70 hover:text-white p-1">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Pet Selector (visible on Home and Passport) */}
      {(currentScreen === 'home' || currentScreen === 'passport') && (
        <PetSelector
          pets={appData.pets}
          activePetId={activePetId}
          onSelectPet={handleSelectPet}
        />
      )}

      {/* Screen Routing */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {currentScreen === 'home' && (
          <HomeScreen
            pet={activePet}
            onStartTriage={handleStartTriage}
            onNavigate={(screen) => setCurrentScreen(screen)}
            onOpenPassport={() => setCurrentScreen('passport')}
          />
        )}

        {currentScreen === 'passport' && (
          <PassportScreen
            pet={activePet}
            onOpenShare={() => setIsShareModalOpen(true)}
          />
        )}

        {currentScreen === 'triage' && (
          <TriageScreen
            pet={activePet}
            onCancel={() => setCurrentScreen('home')}
            onBookAppointment={handleBookFromTriage}
            onSaveToPassport={handleSaveToPassport}
          />
        )}

        {['appointments', 'emergencies', 'profile'].includes(currentScreen) && (
          <PlaceholderScreen
            screenId={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
            activePet={activePet}
            professionals={appData.professionals}
          />
        )}
      </div>

      {/* Bottom Navigation (hidden during active triage flow for full focus) */}
      {currentScreen !== 'triage' && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
        />
      )}

      {/* QR Code Sharing Modal */}
      <QrShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        pet={activePet}
      />
    </PhoneFrame>
  );
}
