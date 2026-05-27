import React, { useEffect, useState } from 'react';
import api from '../api/apiAxios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, CheckCircle2, UserPlus } from 'lucide-react';

export default function Patient() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({ FirstName: '', LastName: '', Gender: 'Male', Telephone: '', Address: '', RegistrationDate: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchPatients = async () => {
    try { 
      const res = await api.get('/patients'); 
      setPatients(res.data); 
    } catch { 
      toast.error("Error fetching patients"); 
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.FirstName || !form.LastName || !form.Telephone) return toast.error("Please fill required fields");

    try {
      if (editingId) {
        await api.put(`/patients/${editingId}`, form);
        toast.success("Patient entry updated");
      } else {
        await api.post('/patients', form);
        toast.success("Patient profile created successfully");
      }
      setForm({ FirstName: '', LastName: '', Gender: 'Male', Telephone: '', Address: '', RegistrationDate: '' });
      setEditingId(null);
      fetchPatients();
    } catch (err) { 
      toast.error("Validation error, check fields formatting"); 
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.PatientID);
    setForm({ ...p, RegistrationDate: p.RegistrationDate ? p.RegistrationDate.split('T')[0] : '' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ FirstName: '', LastName: '', Gender: 'Male', Telephone: '', Address: '', RegistrationDate: '' });
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete patient profile and cascade appointments?")) {
      try { 
        await api.delete(`/patients/${id}`); 
        toast.success("Record dropped"); 
        fetchPatients(); 
      } catch { 
        toast.error("Error executing drop request"); 
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#1A2530]">
      {/* Dynamic Header Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Patient Management</h1>
          <p className="text-sm text-gray-500">Register admissions, update charts, and view clinical registry profiles.</p>
        </div>
      </div>

      {/* Input Form Module */}
      <div className={`bg-white rounded-xl shadow-xs border transition-all duration-200 ${editingId ? 'border-[#009688]/30 bg-radial from-[#009688]/01 to-transparent' : 'border-gray-200/80'}`}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            {editingId ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#009688] animate-pulse" />
                <span className="text-[#009688]">Edit Patient Profile</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#1976D2]" />
                <span>Register New Patient</span>
              </>
            )}
          </h2>
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancelEdit}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200/80 px-2.5 py-1 rounded-md transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">First Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. John" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10 transition-all bg-gray-50/30" 
                value={form.FirstName} 
                onChange={e => setForm({...form, FirstName: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Last Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. Doe" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10 transition-all bg-gray-50/30" 
                value={form.LastName} 
                onChange={e => setForm({...form, LastName: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Biological Sex</label>
              <select 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10 transition-all bg-gray-50/30" 
                value={form.Gender} 
                onChange={e => setForm({...form, Gender: e.target.value})}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Telephone (Mobile) <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. +1 (555) 000-0000" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10 transition-all bg-gray-50/30" 
                value={form.Telephone} 
                onChange={e => setForm({...form, Telephone: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Registration Date</label>
              <input 
                type="date" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10 transition-all bg-gray-50/30 text-gray-700" 
                value={form.RegistrationDate} 
                onChange={e => setForm({...form, RegistrationDate: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-3">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Residential Address</label>
              <textarea 
                rows={2}
                placeholder="Street address, City, State, ZIP code" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10 transition-all bg-gray-50/30 resize-y" 
                value={form.Address} 
                onChange={e => setForm({...form, Address: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm text-white flex justify-center items-center gap-2 shadow-xs transition-all cursor-pointer ${
                editingId 
                  ? 'bg-[#009688] hover:bg-[#00796B] shadow-[#009688]/10' 
                  : 'bg-[#1976D2] hover:bg-[#1565C0] shadow-[#1976D2]/10'
              }`}
            >
              {editingId ? (
                <>
                  <CheckCircle2 size={16} /> Update Profile
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Registry Data Table Module */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-base text-gray-800">Clinical Patient Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/60">
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-24">MRN ID</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Full Patient Name</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Gender</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Number</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400 font-medium">
                    No records found in the current patient directory registry database.
                  </td>
                </tr>
              ) : (
                patients.map(p => (
                  <tr key={p.PatientID} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-400 group-hover:text-[#1976D2] transition-colors">
                      #{p.PatientID}
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm text-[#1A2530]">
                      {p.FirstName} {p.LastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.Gender === 'Male' ? 'bg-blue-50 text-blue-700' :
                        p.Gender === 'Female' ? 'bg-pink-50 text-pink-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {p.Gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                      {p.Telephone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium text-right">
                      <div className="flex gap-1 justify-end">
                        <button 
                          onClick={() => handleEdit(p)} 
                          className="p-1.5 text-gray-400 hover:text-[#009688] hover:bg-[#009688]/5 rounded-lg transition-all"
                          title="Edit Profile"
                        >
                          <Edit2 size={16}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(p.PatientID)} 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Profile"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}