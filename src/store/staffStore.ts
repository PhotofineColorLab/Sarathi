import { create } from 'zustand';
import { Staff } from '../types';
import { mockStaff } from '../data';
import { useNotificationStore } from './notificationStore';

interface StaffState {
  staff: Staff[];
  loading: boolean;
  error: string | null;
  selectedStaff: Staff | null;
  
  // Actions
  fetchStaff: () => void;
  fetchStaffById: (id: string) => void;
  addStaff: (staff: Omit<Staff, 'id' | 'createdAt'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  getStaffByEmail: (email: string) => Staff | undefined;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  staff: mockStaff,
  loading: false,
  error: null,
  selectedStaff: null,
  
  fetchStaff: () => {
    try {
      set({ loading: true, error: null });
      // Using mock data directly
      set({ staff: mockStaff, loading: false });
    } catch (error) {
      console.error('Error fetching staff:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch staff', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to fetch staff',
        type: 'error'
      });
    }
  },
  
  fetchStaffById: (id: string) => {
    try {
      set({ loading: true, error: null });
      const staffMember = mockStaff.find(s => s.id === id);
      if (staffMember) {
        set({ selectedStaff: staffMember, loading: false });
      } else {
        set({ 
          error: 'Staff member not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Staff member not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching staff member:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch staff member', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to fetch staff member',
        type: 'error'
      });
    }
  },
  
  addStaff: (staffData: Omit<Staff, 'id' | 'createdAt'>) => {
    try {
      set({ loading: true, error: null });
      const newStaff: Staff = {
        ...staffData,
        id: `STAFF${Date.now().toString().slice(-6)}`,
        createdAt: new Date()
      };
      
      set(state => ({ 
        staff: [newStaff, ...state.staff],
        loading: false 
      }));
      
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Staff Added',
        message: `${newStaff.name} has been added to the team`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error adding staff member:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add staff member', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to add staff member',
        type: 'error'
      });
    }
  },
  
  updateStaff: (id: string, staffData: Partial<Staff>) => {
    try {
      set({ loading: true, error: null });
      const currentStaff = get().staff.find(s => s.id === id);
      
      if (currentStaff) {
        const updatedStaff = {
          ...currentStaff,
          ...staffData
        };
        
        set(state => ({ 
          staff: state.staff.map(s => s.id === id ? updatedStaff : s),
          selectedStaff: state.selectedStaff?.id === id ? updatedStaff : state.selectedStaff,
          loading: false 
        }));
        
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Staff Updated',
          message: `${updatedStaff.name}'s information has been updated`,
          type: 'success'
        });
      } else {
        set({ 
          error: 'Staff member not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Staff member not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error updating staff member:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update staff member', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to update staff member',
        type: 'error'
      });
    }
  },
  
  deleteStaff: (id: string) => {
    try {
      set({ loading: true, error: null });
      const staffToDelete = get().staff.find(s => s.id === id);
      
      if (staffToDelete) {
        set(state => ({ 
          staff: state.staff.filter(s => s.id !== id),
          selectedStaff: state.selectedStaff?.id === id ? null : state.selectedStaff,
          loading: false 
        }));
        
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Staff Removed',
          message: `${staffToDelete.name} has been removed from the team`,
          type: 'warning'
        });
      } else {
        set({ 
          error: 'Staff member not found', 
          loading: false 
        });
        const notificationStore = useNotificationStore.getState();
        notificationStore.addNotification({
          title: 'Error',
          message: 'Staff member not found',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete staff member', 
        loading: false 
      });
      const notificationStore = useNotificationStore.getState();
      notificationStore.addNotification({
        title: 'Error',
        message: 'Failed to delete staff member',
        type: 'error'
      });
    }
  },
  
  setSelectedStaff: (staff: Staff | null) => {
    set({ selectedStaff: staff });
  },
  
  getStaffByEmail: (email: string) => {
    return get().staff.find(staff => staff.email === email);
  }
}));