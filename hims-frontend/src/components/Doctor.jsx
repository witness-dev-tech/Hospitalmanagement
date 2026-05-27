import React, { useEffect, useState } from 'react';
import api from '../api/apiAxios';
import toast from 'react-hot-toast';
import { Save, Trash2, Edit2, UserPlus, CheckCircle2 } from 'lucide-react';

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ DoctorCode: '', DoctorName: '', Specialization: '', Telephone: '', Email: '', HireDate: '' });
  const [isEdit, setIsEdit] = useState(false);

  const loadDoctors = async () => {
    try { 
      const res = await api.get('/doctors'); 
      setDoctors(res.data); 
    } catch { 
      toast.error("Failed downloading data"); 
    }
  };

  useEffect(() => { loadDoctors(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.DoctorCode || !form.DoctorName) return toast.error("Please fill required fields");

    try {
      if (isEdit) {
        await api.put(`/doctors/${form.DoctorCode}`, form);
        toast.success("Personnel sheet updated");
      } else {
        await api.post('/doctors', form);
        toast.success("Doctor catalog entry added");
      }
      handleCancelEdit();
      loadDoctors();
    } catch { 
      toast.error("Error saving record data"); 
    }
  };

  const handleEditSelect = (d) => {
    setForm({
      ...d,
      HireDate: d.HireDate ? d.HireDate.split('T')[0] : ''
    });
    setIsEdit(true);
  };

  const handleCancelEdit = () => {
    setForm({ DoctorCode: '', DoctorName: '', Specialization: '', Telephone: '', Email: '', HireDate: '' });
    setIsEdit(false);
  };

  const handleDelete = async (code) => {
    if (window.confirm("Drop entry from active directory?")) {
      try {
        await api.delete(`/doctors/${code}`);
        toast.success("Personnel record deleted");
        loadDoctors();
      } catch {
        toast.error("Error processing delete request");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#1A2530]">
      {/* Dynamic Header Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Practitioner Roster</h1>
          <p className="text-sm text-gray-500">Manage clinical staff registry, department specializations, and system codes.</p>
        </div>
      </div>

      {/* Input Form Module */}
      <div className={`bg-white rounded-xl shadow-xs border transition-all duration-200 ${isEdit ? 'border-[#009688]/30 bg-radial from-[#009688]/01 to-transparent' : 'border-gray-200/80'}`}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            {isEdit ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#009688] animate-pulse" />
                <span className="text-[#009688]">Update Practitioner Core</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#1976D2]" />
                <span>Add Practitioner Profile</span>
              </>
            )}
          </h2>
          {isEdit && (
            <button 
              type="button" 
              onClick={handleCancelEdit}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200/80 px-2.5 py-1 rounded-md transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-gray-300"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Doctor Code <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. DOC01" 
                disabled={isEdit} 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-gray-50/30 font-mono disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10" 
                value={form.DoctorCode} 
                onChange={e => setForm({...form, DoctorCode: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Full Professional Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Jane Smith" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-gray-50/30 transition-all focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10" 
                value={form.DoctorName} 
                onChange={e => setForm({...form, DoctorName: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Specialization Department</label>
              <input 
                type="text" 
                placeholder="e.g. Cardiology" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-gray-50/30 transition-all focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10" 
                value={form.Specialization} 
                onChange={e => setForm({...form, Specialization: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. j.smith@clinic.com" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-gray-50/30 transition-all focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10" 
                value={form.Email} 
                onChange={e => setForm({...form, Email: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Telephone</label>
              <input 
                type="text" 
                placeholder="e.g. (555) 019-2834" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-gray-50/30 transition-all focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10" 
                value={form.Telephone} 
                onChange={e => setForm({...form, Telephone: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Hire Date</label>
              <input 
                type="date" 
                className="border border-gray-200 rounded-lg px-3.5 py-2 text-sm bg-gray-50/30 text-gray-700 transition-all focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10" 
                value={form.HireDate} 
                onChange={e => setForm({...form, HireDate: e.target.value})} 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm text-white flex justify-center items-center gap-2 shadow-xs transition-all cursor-pointer focus:outline-hidden focus:ring-2 ${
                isEdit 
                  ? 'bg-[#009688] hover:bg-[#00796B] shadow-[#009688]/10 focus:ring-[#009688]/40' 
                  : 'bg-[#1976D2] hover:bg-[#1565C0] shadow-[#1976D2]/10 focus:ring-[#1976D2]/40'
              }`}
            >
              {isEdit ? (
                <>
                  <CheckCircle2 size={16} /> Commit to Registry
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Save New Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Roster Data Table Module */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-base text-gray-800">Staff Directory Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/60">
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-28">Staff Code</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Practitioner</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400 font-medium">
                    No records found in the staff database.
                  </td>
                </tr>
              ) : (
                doctors.map(d => (
                  <tr key={d.DoctorCode} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400 group-hover:text-[#1976D2] transition-colors">
                      {d.DoctorCode}
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm text-[#1A2530]">
                      {d.DoctorName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-[#009688]">
                        {d.Specialization || 'General Duty'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 space-y-0.5">
                      <div className="font-medium text-gray-700">{d.Telephone || '—'}</div>
                      {d.Email && <div className="text-xs text-gray-400">{d.Email}</div>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium text-right">
                      <div className="flex gap-1 justify-end">
                        <button 
                          onClick={() => handleEditSelect(d)} 
                          className="p-1.5 text-gray-400 hover:text-[#009688] hover:bg-[#009688]/5 rounded-lg transition-all cursor-pointer focus:outline-hidden focus:text-[#009688] focus:bg-[#009688]/5 focus:ring-2 focus:ring-[#009688]/30"
                          title="Edit Profile"
                        >
                          <Edit2 size={16}/>
                        </button>
                        <button 
                          onClick={() => handleDelete(d.DoctorCode)} 
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer focus:outline-hidden focus:text-red-600 focus:bg-red-50 focus:ring-2 focus:ring-red-500/30"
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