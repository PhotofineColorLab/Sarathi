import { create } from 'zustand';
import { Staff } from '../types';

interface StaffStore {
  staff: Staff[];
  addStaff: (staff: Omit<Staff, 'id' | 'createdAt'>) => void;
  updateStaff: (id: string, staff: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
}

export const useStaffStore = create<StaffStore>((set) => ({
  staff: [],
  addStaff: (staffMember) => set((state) => ({
    staff: [...state.staff, {
      ...staffMember,
      id: `STAFF${String(state.staff.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    }]
  })),
  updateStaff: (id, updatedStaff) => set((state) => ({
    staff: state.staff.map(staff => 
      staff.id === id ? { ...staff, ...updatedStaff } : staff
    )
  })),
  deleteStaff: (id) => set((state) => ({
    staff: state.staff.filter(staff => staff.id !== id)
  }))
}));