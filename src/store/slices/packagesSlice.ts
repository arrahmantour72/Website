import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  price: number;
  route: string;
  image: string;
  description: string;
  ctaLink: string;
}

interface PackagesState {
  packages: TourPackage[];
  filterCategories: string[];
}

const initialState: PackagesState = {
  packages: [
    {
      id: '1',
      title: 'Karbala & Najaf Pilgrimage',
      duration: '7 Days / 6 Nights',
      price: 1000,
      route: 'Najaf → Karbala → Baghdad',
      image: '',
      description: 'Experience the spiritual heart of Iraq with visits to the holy shrines.',
      ctaLink: '/packages/karbala-najaf',
    },
  ],
  filterCategories: ['Najaf', 'Karbala', 'Mashhad'],
};

const packagesSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    addPackage: (state, action: PayloadAction<TourPackage>) => {
      state.packages.push(action.payload);
    },
    updatePackage: (state, action: PayloadAction<TourPackage>) => {
      const index = state.packages.findIndex(pkg => pkg.id === action.payload.id);
      if (index !== -1) {
        state.packages[index] = action.payload;
      }
    },
    removePackage: (state, action: PayloadAction<string>) => {
      state.packages = state.packages.filter(pkg => pkg.id !== action.payload);
    },
    addFilterCategory: (state, action: PayloadAction<string>) => {
      if (!state.filterCategories.includes(action.payload)) {
        state.filterCategories.push(action.payload);
      }
    },
    removeFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategories = state.filterCategories.filter(cat => cat !== action.payload);
    },
  },
});

export const {
  addPackage,
  updatePackage,
  removePackage,
  addFilterCategory,
  removeFilterCategory,
} = packagesSlice.actions;

export default packagesSlice.reducer;
