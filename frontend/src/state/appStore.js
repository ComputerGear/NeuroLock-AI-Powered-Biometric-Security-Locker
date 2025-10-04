import { create } from 'zustand';

const useAppStore = create((set) => ({
  // --- STATE ---
  user: null, // To store user profile information
  token: localStorage.getItem('authToken') || null,
  isAuthenticated: !!localStorage.getItem('authToken'),

  // --- ACTIONS ---
  
  // Action to handle user login
  login: (userData, token) => {
    localStorage.setItem('authToken', token);
    set({ user: userData, token, isAuthenticated: true });
  },

  // Action to handle user logout
  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // Action to set user data (e.g., after fetching profile)
  setUser: (userData) => {
    set({ user: userData });
  },
}));

export default useAppStore;