import { create } from 'zustand';
import { Staff } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface StaffStore {
  staff: Staff[];
  addStaff: (staffData: Omit<Staff, 'id' | 'createdAt'>) => void;
  updateStaff: (id: string, staffData: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  getStaffByEmail: (email: string) => Staff | undefined;
}

export const useStaffStore = create<StaffStore>((set, get) => ({
  staff: [],
  
  addStaff: (staffData) => {
    const newStaff: Staff = {
      ...staffData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    set((state) => ({
      staff: [...state.staff, newStaff],
    }));
  },

  updateStaff: (id, staffData) => {
    set((state) => ({
      staff: state.staff.map((staff) =>
        staff.id === id ? { ...staff, ...staffData } : staff
      ),
    }));
  },

  deleteStaff: (id) => {
    set((state) => ({
      staff: state.staff.filter((staff) => staff.id !== id),
    }));
  },

  getStaffByEmail: (email) => {
    const state = get();
    return state.staff.find((staff) => staff.email === email);
  },
}));