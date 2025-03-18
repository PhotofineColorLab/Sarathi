import { create } from 'zustand';
import { User } from '../types';
import { mockUsers } from '../data';
import { useStaffStore } from './staffStore';
import { toast } from 'react-toastify';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  
  login: (email, password) => {
    try {
      set({ loading: true, error: null });
      
      // First check mock admin users
      const adminUser = mockUsers.find(
        (user) => user.email === email && user.password === password
      );
      
      if (adminUser) {
        // Admin user found in mock data
        set({ 
          user: adminUser,
          loading: false 
        });
        toast.success(`Welcome back, ${adminUser.name}!`);
        return true;
      }
      
      // If not an admin, check for staff
      const { getStaffByEmail } = useStaffStore.getState();
      const staffUser = getStaffByEmail(email);
      
      if (staffUser && staffUser.password === password) {
        set({ 
          user: {
            id: staffUser.id,
            name: staffUser.name,
            email: staffUser.email,
            password: staffUser.password,
            role: 'staff' // Set role explicitly to 'staff'
          },
          loading: false 
        });
        toast.success(`Welcome back, ${staffUser.name}!`);
        return true;
      }
      
      // No matching user found
      set({ 
        error: 'Invalid email or password',
        loading: false 
      });
      toast.error('Invalid email or password');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Login failed',
        loading: false 
      });
      toast.error('Login failed');
      return false;
    }
  },
  
  logout: () => {
    set({ user: null });
    toast.info('You have been logged out');
  }
}));