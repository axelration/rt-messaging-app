import {create} from "zustand";

interface AlertState {
  title: string;
  message: string;
  type: 'default' | 'destructive' | null;
  show: boolean;
  setAlert: (title: string, message: string, type: 'default' | 'destructive') => void;
  clearAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  title: '',
  message: '',
  type: null,
  show: false,
  setAlert: (title, message, type = 'default') => set({ title, message, type, show: true }),
  clearAlert: () => set({ title: '', message: '', type: null, show: false }),
}));