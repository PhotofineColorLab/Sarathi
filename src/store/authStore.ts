import { create } from 'zustand';
import { User } from '../types';
import { useStaffStore } from './staffStore';

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
    id: 'admin2',
    email: 'shubhamheda@sarathi.com',
    password: 'admin123',
    role: 'admin',
    name: 'Shubham Heda'
  }
];

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (email, password) => {
    // First check mock admin users
    const adminUser = mockUsers.find(u => u.email === email && u.password === password);
    if (adminUser) {
      set({ user: adminUser });
      return true;
    }

    // Then check staff users
    const { staff } = useStaffStore.getState();
    const staffUser = staff.find(s => s.email === email && s.password === password);
    if (staffUser) {
      set({
        user: {
          id: staffUser.id,
          email: staffUser.email,
          password: staffUser.password,
          role: 'staff',
          name: staffUser.name
        }
      });
      return true;
    }

    return false;
  },
  logout: () => set({ user: null })
}));