import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- INTERFACES ---

export interface CtaButton {
  id: string;
  text: string;
  link: string;
}

export interface HeroSection {
  headline: string;
  subheading: string;
  backgroundMedia: string;
  mediaType: 'image' | 'video';
  ctaButtons: CtaButton[];
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  quote: string;
  rating: number;
}

// CORRECTED: This interface now matches your event data object
export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location :string;
  organizer:string;
  imagebase64: string; // This holds the URL or base64 string
}

// --- STATE ---

interface HomeState {
  hero: HeroSection;
  testimonials: Testimonial[];
  events: Event[]; // ADDED: events property (as an array)
}

const initialState: HomeState = {
  hero: {
    headline: 'Embark on a Sacred Journey',
    subheading: 'Discover Spiritual Ziyarat Tours to Iran & Iraq',
    backgroundMedia: '',
    mediaType: 'image',
    ctaButtons: [
      { id: '1', text: 'View Packages', link: '/packages' },
      { id: '2', text: 'Contact Us', link: '/contact' },
    ],
  },
  testimonials: [
    {
      id: '1',
      name: 'Sarah Ahmed',
      photo: 'https://i.pinimg.com/736x/0a/0e/d1/0a0ed1898b109ff6218baae199857d9f.jpg',
      quote: 'A transformative spiritual experience that exceeded all expectations.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Imran Shaikh',
      photo: 'https://i.pinimg.com/1200x/bf/8f/7c/bf8f7c5460e75014424781ac53862167.jpg',
      quote: 'Visiting the shrines of Najaf and Karbala was a lifelong dream come true. The arrangements were smooth and deeply spiritual.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Zainab Rizvi',
      photo: 'https://i.pinimg.com/736x/40/ff/56/40ff56579f87721462b578eab4ab48fa.jpg',
      quote: 'Every moment in Iran and Iraq felt sacred. The group guidance made it easy to focus on prayers and reflection.',
      rating: 4,
    },
    {
      id: '4',
      name: 'Ali Hussain',
      photo: 'https://i.pinimg.com/1200x/41/e0/39/41e0398984b0f1a0c79acfb0694bfcce.jpg',
      quote: 'A beautifully organized ziarat tour — from Mashhad to Karbala, every place was filled with peace and devotion.',
      rating: 3,
    },
  ], // FIXED: Added missing comma here
  
  // FIXED: 'events' is now an array containing your event object
  events: [
    {
      id: "1",
  title: "ALAMI JASHN BAB-UL-HAWAIJI",
  date: "04 Shaban, 2025",
  description: "Join the Alami Jashn from Karbla, Iraq. The event will be held at Sardaab Imam Hasan (a.s.) and Haram Maula-Imam Abbas (a.s.).",
  location: "Karbla, Iraq", // <-- ADDED
  organizer: "Ar-Rahman Tours, Mumbai", // <-- ADDED
  imagebase64: "https://i.ytimg.com/vi/Toh44O_c2Ps/maxresdefault.jpg"// Replace this with the correct path to your image
    }
    
  ]
};

// --- SLICE ---

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    // --- Hero Reducers ---
    updateHeroHeadline: (state, action: PayloadAction<string>) => {
      state.hero.headline = action.payload;
    },
    updateHeroSubheading: (state, action: PayloadAction<string>) => {
      state.hero.subheading = action.payload;
    },
    updateHeroMedia: (state, action: PayloadAction<{ media: string; type: 'image' | 'video' }>) => {
      state.hero.backgroundMedia = action.payload.media;
      state.hero.mediaType = action.payload.type;
    },
    addCtaButton: (state, action: PayloadAction<CtaButton>) => {
      state.hero.ctaButtons.push(action.payload);
    },
    updateCtaButton: (state, action: PayloadAction<CtaButton>) => {
      const index = state.hero.ctaButtons.findIndex(btn => btn.id === action.payload.id);
      if (index !== -1) {
        state.hero.ctaButtons[index] = action.payload;
      }
    },
    removeCtaButton: (state, action: PayloadAction<string>) => {
      state.hero.ctaButtons = state.hero.ctaButtons.filter(btn => btn.id !== action.payload);
    },

    // --- Testimonial Reducers ---
    addTestimonial: (state, action: PayloadAction<Testimonial>) => {
      state.testimonials.push(action.payload);
    },
    updateTestimonial: (state, action: PayloadAction<Testimonial>) => {
      const index = state.testimonials.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.testimonials[index] = action.payload;
      }
    },
    removeTestimonial: (state, action: PayloadAction<string>) => {
      state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
    },

    // --- ADDED: Event Reducers ---
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
  },
});

// --- EXPORTS ---

export const {
  // Hero
  updateHeroHeadline,
  updateHeroSubheading,
  updateHeroMedia,
  addCtaButton,
  updateCtaButton,
  removeCtaButton,
  // Testimonials
  addTestimonial,
  updateTestimonial,
  removeTestimonial,
  // Events (NEW)
  addEvent,
  updateEvent,
  removeEvent,
} = homeSlice.actions;

export default homeSlice.reducer;