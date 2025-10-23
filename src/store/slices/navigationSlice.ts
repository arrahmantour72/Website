import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NavItem {
  id: string;
  label: string;
  url: string;
}

interface NavigationState {
  items: NavItem[];
}

const initialState: NavigationState = {
  items: [
    { id: '1', label: 'Home', url: '/' },
    { id: '2', label: 'About', url: '/about' },
    { id: '3', label: 'Packages', url: '/packages' },
    { id: '4', label: 'Gallery', url: '/gallery' },
    { id: '5', label: 'Contact', url: '/contact' },
  ],
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    addNavItem: (state, action: PayloadAction<NavItem>) => {
      state.items.push(action.payload);
    },
    updateNavItem: (state, action: PayloadAction<NavItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeNavItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addNavItem, updateNavItem, removeNavItem } = navigationSlice.actions;
export default navigationSlice.reducer;
