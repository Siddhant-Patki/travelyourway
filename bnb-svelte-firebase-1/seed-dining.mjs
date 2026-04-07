import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAQ1NGJ2WmCZBHiH-IU3lk90b76UFU9OLY",
  authDomain: "hotel-booking-33562.firebaseapp.com",
  projectId: "hotel-booking-33562",
  storageBucket: "hotel-booking-33562.appspot.com",
  messagingSenderId: "125700564668",
  appId: "1:125700564668:web:7ed98199d06eb66e54d2b9",
  measurementId: "G-SRKPPW5ZBJ"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const dinings = [
  {
    title: "Bukhara",
    description: "Legendary North-West Frontier cuisine served in a rustic setting. Famous for its dal bukhara slow-cooked overnight and the sikandari raan. A true Delhi institution since 1977.",
    cuisine: "Indian",
    location: "New Delhi, India",
    imgSrc: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800",
    pricePerPerson: 3500,
    maxGuests: 8,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Osteria Francescana",
    description: "Three-Michelin-star temple of modern Italian cuisine in Modena. Chef Massimo Bottura reimagines classic Italian dishes with stunning avant-garde creativity.",
    cuisine: "Italian",
    location: "Modena, Italy",
    imgSrc: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    pricePerPerson: 12000,
    maxGuests: 6,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Ultraviolet",
    description: "The world's most exclusive restaurant — one table, 10 guests, 20 courses. Each dish is paired with bespoke sounds, scents, and visuals for a fully immersive multi-sensory experience.",
    cuisine: "Continental",
    location: "Shanghai, China",
    imgSrc: "https://images.unsplash.com/photo-1550966871-3ed3cbe818b5?w=800",
    pricePerPerson: 18000,
    maxGuests: 10,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Narisawa",
    description: "Two-Michelin-star Tokyo restaurant celebrating the harmony between nature and cuisine. Yoshihiro Narisawa sources ingredients from Japanese forests, rivers, and oceans.",
    cuisine: "Japanese",
    location: "Minato, Tokyo, Japan",
    imgSrc: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
    pricePerPerson: 9500,
    maxGuests: 4,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Quintonil",
    description: "Modern Mexican cuisine celebrating indigenous ingredients and pre-Hispanic flavours. Located in the upscale Polanco district, consistently ranked among Latin America's best restaurants.",
    cuisine: "Mexican",
    location: "Polanco, Mexico City, Mexico",
    imgSrc: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
    pricePerPerson: 5500,
    maxGuests: 6,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Hakkasan Mayfair",
    description: "Michelin-starred Cantonese restaurant in the heart of London's Mayfair. Signature dishes include the Peking duck and roasted silver cod with champagne and honey.",
    cuisine: "Chinese",
    location: "Mayfair, London, UK",
    imgSrc: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
    pricePerPerson: 7800,
    maxGuests: 8,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Le Bernardin",
    description: "New York's most celebrated seafood restaurant. Chef Eric Ripert's four-star destination transforms the finest oceanic ingredients into works of art on the plate.",
    cuisine: "Continental",
    location: "Midtown Manhattan, New York, USA",
    imgSrc: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
    pricePerPerson: 14500,
    maxGuests: 6,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Gaggan Anand",
    description: "Progressive Indian cuisine in Bangkok. Chef Gaggan Anand's menu features 25+ courses of playful, boundary-pushing dishes inspired by street food elevated to haute cuisine.",
    cuisine: "Indian",
    location: "Bangkok, Thailand",
    imgSrc: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800",
    pricePerPerson: 8200,
    maxGuests: 4,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Septime",
    description: "The darling of Paris's neo-bistro scene. Chef Bertrand Grébaut crafts simple, seasonal French menus with produce from their own farm. Book months in advance.",
    cuisine: "Continental",
    location: "Bastille, Paris, France",
    imgSrc: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800",
    pricePerPerson: 6500,
    maxGuests: 4,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Sukiyabashi Jiro",
    description: "The legendary 10-seat sushi counter that inspired a documentary. Chef Jiro Ono's omakase is considered the pinnacle of sushi craftsmanship. Reservation required months ahead.",
    cuisine: "Japanese",
    location: "Ginza, Tokyo, Japan",
    imgSrc: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=800",
    pricePerPerson: 22000,
    maxGuests: 2,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Noma",
    description: "Redefining New Nordic cuisine from a historic warehouse in Copenhagen. René Redzepi's seasonal menus explore fermentation, foraging, and the wild flavours of Scandinavia.",
    cuisine: "Continental",
    location: "Christianshavn, Copenhagen, Denmark",
    imgSrc: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    pricePerPerson: 16000,
    maxGuests: 6,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
  {
    title: "Trattoria da Enzo al 29",
    description: "Beloved Roman trattoria in Trastevere serving honest cucina romana. The cacio e pepe and coda alla vaccinara are the stuff of legend. No frills, just perfection.",
    cuisine: "Italian",
    location: "Trastevere, Rome, Italy",
    imgSrc: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    pricePerPerson: 2800,
    maxGuests: 6,
    isAvailable: true,
    userId: "admin",
    createdAt: new Date(),
  },
];

async function seed() {
  console.log(`Seeding ${dinings.length} dining listings...`);
  for (const dining of dinings) {
    const ref = await addDoc(collection(firestore, 'dining'), dining);
    console.log(`✓ Added: ${dining.title} (${dining.cuisine}) — ${ref.id}`);
  }
  console.log('\nDone! All dining listings seeded successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
