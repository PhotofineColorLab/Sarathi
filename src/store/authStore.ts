import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const mockUsers: User[] = [
  {
    id: 'admin1',
    email: 'admin@electro.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: 'staff1',
    email: 'staff@electro.com',
    password: 'staff123',
    role: 'staff',
    name: 'Staff User'
  }
];

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      set({ user });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null })
}));