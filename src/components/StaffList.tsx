import React, { useState } from 'react';
import { Staff } from '../types';
import { Pencil, Trash2 } from 'lucide-react';
import StaffForm from './StaffForm';

interface StaffListProps {
  staff: Staff[];
  onUpdate?: (id: string, staff: Partial<Staff>) => void;
  onDelete?: (id: string) => void;
}

const StaffList: React.FC<StaffListProps> = ({ staff, onUpdate, onDelete }) => {
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  if (editingStaff) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Staff</h2>
        <StaffForm
          initialData={editingStaff}
          onSubmit={(data) => {
            onUpdate?.(editingStaff.id, data);
            setEditingStaff(null);
          }}
          onCancel={() => setEditingStaff(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Staff List</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Phone</th>
                <th className="text-left py-3 px-4">Created At</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((staffMember) => (
                <tr key={staffMember.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{staffMember.id}</td>
                  <td className="py-3 px-4">{staffMember.name}</td>
                  <td className="py-3 px-4">{staffMember.email}</td>
                  <td className="py-3 px-4">{staffMember.phone}</td>
                  <td className="py-3 px-4">{staffMember.createdAt}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingStaff(staffMember)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onDelete?.(staffMember.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffList;