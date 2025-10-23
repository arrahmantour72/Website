import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './slices/homeSlice';
import navigationReducer from './slices/navigationSlice';
import packagesReducer from './slices/packagesSlice';
import authReducer from './slices/authSlice';
import aboutReducer from './slices/aboutSlice';
import galleryReducer from './slices/gallerySlice';
import contactReducer from './slices/contactSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
    navigation: navigationReducer,
    packages: packagesReducer,
    auth: authReducer,
    about: aboutReducer,
    gallery: galleryReducer,
    contact: contactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
