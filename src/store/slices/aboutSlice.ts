import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LearnMore {
  text: string;
  link: string;
}

interface AboutState {
  title: string;
  description: string;
  image: string;
  learnMore: LearnMore;
}

const initialState: AboutState = {
  title: 'Our Sacred Mission',
  description: 'For over two decades, we have been guiding pilgrims on transformative spiritual journeys to the holiest sites in Iran and Iraq. Our experienced team ensures comfort, safety, and deep spiritual connection at every step of your Ziyarat.',
  image: '',
  learnMore: {
    text: 'Learn More About Us',
    link: '/about',
  },
};

const aboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    updateAboutTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    updateAboutDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    updateAboutImage: (state, action: PayloadAction<string>) => {
      state.image = action.payload;
    },
    updateLearnMore: (state, action: PayloadAction<LearnMore>) => {
      state.learnMore = action.payload;
    },
  },
});

export const {
  updateAboutTitle,
  updateAboutDescription,
  updateAboutImage,
  updateLearnMore,
} = aboutSlice.actions;

export default aboutSlice.reducer;
