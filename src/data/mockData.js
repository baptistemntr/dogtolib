// Dogtolib - Données fictives centrales (in-memory)
// Modifiables facilement pour le pitch et les démonstrations

export const initialData = {
  owner: {
    name: "Léa",
    age: 27,
    city: "Paris 11e",
    email: "lea.martin@example.fr",
    phone: "06 12 34 56 78",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  
  activePetId: "moka",

  pets: [
    {
      id: "moka",
      name: "Moka",
      species: "chat",
      speciesLabel: "Chat européen",
      gender: "Femelle stérilisée",
      age: "3 ans",
      birthDate: "14 Avril 2023",
      chipNumber: "250 26 960 481 2934",
      passportNumber: "FR-75-098241",
      weight: "4.2 kg",
      idealWeight: "4.0 - 4.5 kg",
      photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80",
      icon: "Cat",
      accentColor: "#0F4C5C",
      accentBg: "#EBF4F6",
      allergies: ["Aucune allergie connue"],
      preventionScore: {
        status: "up_to_date", // "up_to_date", "upcoming", "overdue"
        label: "À jour",
        description: "Tous les rappels et bilans sont conformes",
        color: "#2A9D8F",
        badgeBg: "#E8F7F5"
      },
      nextAppointment: {
        date: "Lun. 5 Oct.",
        time: "10h30",
        clinic: "Clinique Vétérinaire des Batignolles",
        practitioner: "Dr. Paul Renaud",
        reason: "Bilan annuel et détartrage préventif",
        address: "42 rue Nollet, 75017 Paris",
        confirmed: true
      },
      vaccines: [
        { name: "Typhus - Coryza (RCP)", date: "15 Janvier 2026", nextDue: "15 Janvier 2027", status: "ok", practitioner: "Dr. Paul Renaud" },
        { name: "Leucose féline (FeLV)", date: "15 Janvier 2026", nextDue: "15 Janvier 2027", status: "ok", practitioner: "Dr. Paul Renaud" },
        { name: "Rage (Rabisin)", date: "12 Juin 2025", nextDue: "12 Juin 2028", status: "ok", practitioner: "Dr. Marc Vasseur" }
      ],
      treatments: [
        { name: "Milbemax (Vermifuge)", frequency: "1 comprimé tous les 6 mois", lastGiven: "1er Septembre 2026", nextDue: "1er Mars 2027", status: "active" },
        { name: "Frontline Combo (Antiparasitaire)", frequency: "1 pipette par mois en période estivale", lastGiven: "15 Août 2026", nextDue: "15 Octobre 2026", status: "active" }
      ],
      documents: [
        { id: "doc-1", title: "Certificat d'identification I-CAD", date: "18 Mai 2023", size: "340 Ko", type: "PDF" },
        { id: "doc-2", title: "Compte-rendu stérilisation", date: "12 Octobre 2023", size: "520 Ko", type: "PDF" },
        { id: "doc-3", title: "Bilan sanguin de contrôle 2 ans", date: "15 Janvier 2025", size: "890 Ko", type: "PDF" },
        { id: "doc-4", title: "Passeport européen officiel", date: "12 Juin 2025", size: "1.2 Mo", type: "PDF" }
      ],
      timeline: [
        { id: 1, date: "15 Janvier 2026", title: "Rappel vaccinal annuel & Pesée (4.2 kg)", type: "vaccine", details: "Vaccins RCP + Leucose administrés. Examen clinique parfait, dentition saine." },
        { id: 2, date: "12 Octobre 2025", title: "Détartrage & polissage préventif", type: "care", details: "Intervention sous anesthésie légère. Réveil rapide et sans complication." },
        { id: 3, date: "12 Juin 2025", title: "Vaccination Rage & Passeport Européen", type: "vaccine", details: "Délivrance du passeport pour vacances en Espagne. Vaccination antirabique." },
        { id: 4, date: "15 Janvier 2025", title: "Contrôle de routine 2 ans (Pesée: 4.1 kg)", type: "checkup", details: "Bilan sanguin préventif normal. Recommandation alimentation stérilisée." },
        { id: 5, date: "10 Septembre 2024", title: "Épisode gastrite passagère", type: "illness", details: "Vomissements herbe + nourriture. Traitement pansement gastrique 3 jours." },
        { id: 6, date: "16 Janvier 2024", title: "Premier rappel annuel vaccins", type: "vaccine", details: "Rappel Typhus/Coryza. Poids stable à 3.9 kg." },
        { id: 7, date: "12 Octobre 2023", title: "Stérilisation & tatouage de sécurité", type: "surgery", details: "Ovariectomie sans incident. Convalescence sous collerette 7 jours." },
        { id: 8, date: "15 Juillet 2023", title: "Primo-vaccination 2e injection", type: "vaccine", details: "Poursuite du protocole vaccinal de croissance." },
        { id: 9, date: "18 Juin 2023", title: "Première visite pédiatrique & Puce I-CAD", type: "id", details: "Identification électronique 250 26 960 481 2934. Pesée: 1.1 kg." },
        { id: 10, date: "18 Mai 2023", title: "Adoption à la SPA de Gennevilliers", type: "milestone", details: "Adoption de Moka à l'âge de 2 mois par Léa." }
      ]
    },
    {
      id: "oslo",
      name: "Oslo",
      species: "chien",
      speciesLabel: "Labrador Retriever",
      gender: "Mâle castré",
      age: "7 ans (Senior)",
      birthDate: "3 Mars 2019",
      chipNumber: "250 26 874 112 5590",
      passportNumber: "FR-75-045189",
      weight: "32.5 kg",
      idealWeight: "31.0 - 33.0 kg",
      photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80",
      icon: "Dog",
      accentColor: "#2A9D8F",
      accentBg: "#EAF5F3",
      allergies: ["Bœuf (dermatite atopique)", "Pollen graminées"],
      preventionScore: {
        status: "overdue",
        label: "En retard",
        description: "Rappel vaccin CHPPiL en retard de 18 jours",
        color: "#E76F51",
        badgeBg: "#FDECE8"
      },
      nextAppointment: null,
      vaccines: [
        { name: "CHPPi - Lepto (CHPPiL)", date: "15 Septembre 2025", nextDue: "15 Septembre 2026", status: "late", practitioner: "Dr. Sophie Bernard" },
        { name: "Toux de chenil (Bb/Pi)", date: "15 Septembre 2025", nextDue: "15 Septembre 2026", status: "late", practitioner: "Dr. Sophie Bernard" },
        { name: "Rage (Rabisin)", date: "15 Septembre 2024", nextDue: "15 Septembre 2027", status: "ok", practitioner: "Dr. Sophie Bernard" }
      ],
      treatments: [
        { name: "Seraquin (Soutien articulaire)", frequency: "2 comprimés par jour le matin", lastGiven: "Aujourd'hui", nextDue: "Demain matin", status: "active" },
        { name: "NexGard Spectra (Antiparasitaire)", frequency: "1 comprimé à croquer par mois", lastGiven: "10 Septembre 2026", nextDue: "10 Octobre 2026", status: "active" },
        { name: "Shampooing Douxo Calm", frequency: "1 bain apaisant tous les 15 jours", lastGiven: "20 Septembre 2026", nextDue: "4 Octobre 2026", status: "active" }
      ],
      documents: [
        { id: "doc-1", title: "Certificat I-CAD & Pédigrée LOF", date: "10 Mai 2019", size: "450 Ko", type: "PDF" },
        { id: "doc-2", title: "Radio des hanches (Dépistage dysplasie A/A)", date: "14 Avril 2020", size: "3.2 Mo", type: "IMG" },
        { id: "doc-3", title: "Bilan sanguin gériatrique complet", date: "15 Mars 2026", size: "1.1 Mo", type: "PDF" }
      ],
      timeline: [
        { id: 1, date: "15 Mars 2026", title: "Bilan Senior 7 ans (Pesée: 32.5 kg)", type: "checkup", details: "Contrôle rénal et hépatique normal. Début supplémentation cartilagineuse." },
        { id: 2, date: "15 Septembre 2025", title: "Rappel vaccinal complet annuel", type: "vaccine", details: "CHPPiL + Toux de chenil. Léger embonpoint à surveiller." },
        { id: 3, date: "22 Mai 2025", title: "Séance ostéopathie articulaire", type: "care", details: "Traitement raideur lombaire post-baignade. Bonne réponse." },
        { id: 4, date: "14 Novembre 2024", title: "Poussée allergique cutanée", type: "illness", details: "Prurit pattes et ventre. Mise en place alimentation hypoallergénique." },
        { id: 5, date: "15 Septembre 2024", title: "Rappel vaccinal & Rage 3 ans", type: "vaccine", details: "Vaccination antirabique renouvelée pour 3 ans." },
        { id: 6, date: "10 Janvier 2024", title: "Pesée trimestrielle (32.8 kg)", type: "weight", details: "Poids stabilisé grâce aux rations fractionnées." },
        { id: 7, date: "12 Avril 2021", title: "Castration chirurgicale préventive", type: "surgery", details: "Chirurgie ambulatoire sans complications." },
        { id: 8, date: "14 Avril 2020", title: "Radio officielle hanches/coudes", type: "checkup", details: "Examen de dépistage dysplasie: Score A (indemne)." },
        { id: 9, date: "10 Juin 2019", title: "Primo-vaccination chiot & Puce", type: "id", details: "Puce 250 26 874 112 5590. Poids: 6.8 kg." },
        { id: 10, date: "3 Mai 2019", title: "Arrivée dans la famille", type: "milestone", details: "Adoption d'Oslo à 8 semaines auprès d'un élevage familial." }
      ]
    },
    {
      id: "pixel",
      name: "Pixel",
      species: "lapin",
      speciesLabel: "Lapin nain bélier",
      gender: "Mâle",
      age: "1 an",
      birthDate: "10 Septembre 2025",
      chipNumber: "250 26 900 341 8812",
      passportNumber: "FR-75-110294",
      weight: "1.45 kg",
      idealWeight: "1.3 - 1.6 kg",
      photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop&q=80",
      icon: "Rabbit",
      accentColor: "#E36414",
      accentBg: "#FDF0E8",
      allergies: ["Foin poussiéreux (éternuements)"],
      preventionScore: {
        status: "upcoming",
        label: "À prévoir",
        description: "Rappel Myxomatose & VHD1-2 dans 12 jours",
        color: "#E36414",
        badgeBg: "#FDF0E8"
      },
      nextAppointment: {
        date: "Jeu. 15 Oct.",
        time: "15h30",
        clinic: "Cabinet Spécialisé NAC Dr. Sophie Martin",
        practitioner: "Dr. Sophie Martin",
        reason: "Rappel vaccinal VHD / Myxomatose et contrôle dentaire",
        address: "18 rue Cambronne, 75015 Paris",
        confirmed: true
      },
      vaccines: [
        { name: "Nobivac Myxo-RHD PLUS (VHD1, VHD2, Myxo)", date: "20 Octobre 2025", nextDue: "20 Octobre 2026", status: "upcoming", practitioner: "Dr. Sophie Martin" }
      ],
      treatments: [
        { name: "Vitamine C liquide", frequency: "0.5 ml 2x par semaine", lastGiven: "Mercredi", nextDue: "Samedi", status: "active" },
        { name: "Brossage régulier mue", frequency: "Quotidien en période de mue", lastGiven: "Hier", nextDue: "Aujourd'hui", status: "active" }
      ],
      documents: [
        { id: "doc-1", title: "Certificat d'adoption association", date: "15 Juillet 2026", size: "290 Ko", type: "PDF" },
        { id: "doc-2", title: "Carnet de santé officiel NAC", date: "20 Juillet 2026", size: "1.5 Mo", type: "PDF" }
      ],
      timeline: [
        { id: 1, date: "20 Juillet 2026", title: "Premier bilan de santé NAC & Pesée (1.45 kg)", type: "checkup", details: "Contrôle occlusion incisives et molaires parfait. Transit régulier." },
        { id: 2, date: "15 Juillet 2026", title: "Adoption via association Marguerite & Cie", type: "milestone", details: "Arrivée de Pixel dans son nouvel enclos aménagé." },
        { id: 3, date: "20 Octobre 2025", title: "Primo-vaccination Nobivac Myxo-RHD PLUS", type: "vaccine", details: "Protection combinée 3 pathologies en injection unique." },
        { id: 4, date: "10 Septembre 2025", title: "Naissance", type: "milestone", details: "Naissance en portée de 4 lapereaux." }
      ]
    }
  ],

  // 8 professionnels de santé autour de Paris
  professionals: [
    {
      id: "pro-1",
      name: "Clinique Vétérinaire des Batignolles",
      type: "Clinique généraliste",
      category: "generalist",
      address: "42 rue Nollet, 75017 Paris",
      distance: "1.2 km",
      species: ["chat", "chien"],
      priceRange: "45€ - 65€",
      consultationPrice: "48€",
      nextSlot: "Lundi à 09h30",
      urgentSlots: true,
      phone: "01 42 29 10 20",
      rating: 4.9,
      reviewCount: 142
    },
    {
      id: "pro-2",
      name: "Clinique Vétérinaire Saint-Antoine",
      type: "Clinique généraliste",
      category: "generalist",
      address: "128 rue du Faubourg Saint-Antoine, 75012 Paris",
      distance: "2.1 km",
      species: ["chat", "chien", "lapin"],
      priceRange: "48€ - 70€",
      consultationPrice: "50€",
      nextSlot: "Lundi à 11h15",
      urgentSlots: true,
      phone: "01 43 45 78 90",
      rating: 4.8,
      reviewCount: 98
    },
    {
      id: "pro-3",
      name: "Cabinet Vétérinaire Monceau",
      type: "Cabinet généraliste",
      category: "generalist",
      address: "15 rue de Monceau, 75008 Paris",
      distance: "2.4 km",
      species: ["chat", "chien"],
      priceRange: "50€ - 75€",
      consultationPrice: "55€",
      nextSlot: "Mardi à 14h00",
      urgentSlots: false,
      phone: "01 45 63 22 11",
      rating: 4.7,
      reviewCount: 64
    },
    {
      id: "pro-4",
      name: "Hôpital Vétérinaire de Montmartre",
      type: "Hôpital & Imagerie",
      category: "generalist",
      address: "59 rue Marcadet, 75018 Paris",
      distance: "2.9 km",
      species: ["chat", "chien", "lapin"],
      priceRange: "55€ - 85€",
      consultationPrice: "60€",
      nextSlot: "Lundi à 14h30",
      urgentSlots: true,
      phone: "01 46 06 33 00",
      rating: 4.9,
      reviewCount: 210
    },
    {
      id: "pro-5",
      name: "Urgences Vétérinaires Paris Nuit & 24/7",
      type: "Service d'urgences 24h/24",
      category: "emergency",
      address: "8 boulevard Voltaire, 75011 Paris",
      distance: "1.8 km",
      species: ["chat", "chien", "lapin"],
      priceRange: "85€ - 130€",
      consultationPrice: "95€",
      nextSlot: "Immédiat (Sans RDV)",
      urgentSlots: true,
      phone: "01 43 55 99 99",
      rating: 4.8,
      reviewCount: 380,
      emergencyNotice: "Permanence 24h/24 7j/7 - Tri d'urgence régulé"
    },
    {
      id: "pro-6",
      name: "Dr. Sophie Martin — Spécialiste NAC",
      type: "Vétérinaire spécialisé NAC",
      category: "specialist",
      address: "18 rue Cambronne, 75015 Paris",
      distance: "4.5 km",
      species: ["lapin"],
      priceRange: "52€ - 75€",
      consultationPrice: "54€",
      nextSlot: "Mercredi à 15h30",
      urgentSlots: false,
      phone: "01 47 34 50 12",
      rating: 5.0,
      reviewCount: 88
    },
    {
      id: "pro-7",
      name: "Ostéovet — Marie Delorme",
      type: "Ostéopathe animalière",
      category: "complementary",
      address: "34 rue d'Hauteville, 75010 Paris",
      distance: "2.5 km",
      species: ["chat", "chien"],
      priceRange: "65€ - 80€",
      consultationPrice: "70€",
      nextSlot: "Jeudi à 11h15",
      urgentSlots: false,
      phone: "06 88 44 22 11",
      rating: 4.9,
      reviewCount: 52
    },
    {
      id: "pro-8",
      name: "L'Atelier Canin & Félin",
      type: "Toilettage & Soins dermatologiques",
      category: "grooming",
      address: "21 rue La Fayette, 75009 Paris",
      distance: "1.9 km",
      species: ["chat", "chien"],
      priceRange: "40€ - 70€",
      consultationPrice: "45€",
      nextSlot: "Vendredi à 14h30",
      urgentSlots: false,
      phone: "01 48 78 12 34",
      rating: 4.7,
      reviewCount: 73
    }
  ]
};
