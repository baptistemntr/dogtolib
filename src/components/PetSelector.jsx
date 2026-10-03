import React from 'react';
import { SpeciesIcon } from './SpeciesIcon';

export default function PetSelector({ pets, activePetId, onSelectPet }) {
  return (
    <div className="px-4 pt-2 pb-3 bg-white/70 backdrop-blur-md border-b border-[#0F4C5C]/10 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
        {pets.map((pet) => {
          const isActive = pet.id === activePetId;
          return (
            <button
              key={pet.id}
              onClick={() => onSelectPet(pet.id)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-200 border text-left shrink-0 ${
                isActive
                  ? 'bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-sm shadow-[#0F4C5C]/25 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="relative">
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className={`w-7 h-7 rounded-full object-cover border ${
                    isActive ? 'border-white' : 'border-slate-200'
                  }`}
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    isActive ? 'bg-[#E36414] text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <SpeciesIcon species={pet.species} className="w-2.5 h-2.5" color="currentColor" />
                </span>
              </div>
              <div className="pr-1">
                <p className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-800'}`}>
                  {pet.name}
                </p>
                <p className={`text-[10px] leading-none ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                  {pet.species === 'chat' ? 'Chat' : pet.species === 'chien' ? 'Chien' : 'Lapin'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
