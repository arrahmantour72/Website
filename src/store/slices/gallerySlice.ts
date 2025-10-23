import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GalleryItem {
  id: string;
  file: string;
  caption: string;
  type: 'image' | 'video';
}

interface GalleryState {
  items: GalleryItem[];
}

const initialState: GalleryState = {
  items: [
    {
      id: '1',
      file: '',
      caption: 'Imam Reza Shrine in Mashhad',
      type: 'image',
    },
    {
      id: '2',
      file: '',
      caption: 'Imam Ali Shrine in Najaf',
      type: 'image',
    },
    {
      id: '3',
      file: '',
      caption: 'Imam Hussain Shrine in Karbala',
      type: 'image',
    },
  ],
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    addGalleryItem: (state, action: PayloadAction<GalleryItem>) => {
      state.items.push(action.payload);
    },
    updateGalleryItem: (state, action: PayloadAction<GalleryItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeGalleryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const {
  addGalleryItem,
  updateGalleryItem,
  removeGalleryItem,
} = gallerySlice.actions;

export default gallerySlice.reducer;
