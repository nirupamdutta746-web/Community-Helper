import React, { useState } from 'react';
import type { Volunteer } from '../App';
// interface Volunteer {
//   id: string;
//   name: string;
//   role: string;
//   status: string;
//   position: { x: number; y: number };
//   currentTask: string | null;
// }

interface VolunteerListProps {
  volunteers: Volunteer[];
  onAddVolunteer: (vol: Volunteer) => void;
}

const VolunteerList: React.FC<VolunteerListProps> = ({ volunteers, onAddVolunteer }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create the full object expected by App.tsx
    const newVolunteer: Volunteer = {
      id: Date.now().toString(),
      name: formData.name,
      role: formData.role || 'General Volunteer',
      status: 'active',
      // Random coordinates so they appear in different spots on the map
      position: { 
        x: Math.floor(Math.random() * 70) + 15, 
        y: Math.floor(Math.random() * 70) + 15 
      },
      currentTask: null
    };

    onAddVolunteer(newVolunteer);
    alert('Volunteer registered and added to the verified list!');
    setFormData({ name: '', role: '' }); // Clear form
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      {/* Registration Section */}
      <section className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-emerald-600">Register Volunteer</h2>
        <form onSubmit={handleVolunteerSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Role/Skills</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border"
              placeholder="e.g. Logistics, Medical"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors font-medium h-[42px]"
          >
            Join as Volunteer
          </button>
        </form>
      </section>

      {/* Verified Table Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Verified Volunteers</h2>
          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
            {volunteers.length} Active Members
          </span>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assignment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">{volunteer.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{volunteer.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {volunteer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {volunteer.currentTask || <span className="text-slate-400 italic">Waiting for Task</span>}
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

export default VolunteerList;