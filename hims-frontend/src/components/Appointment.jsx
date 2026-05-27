import React, { useEffect, useState } from 'react';
import api from '../api/apiAxios';
import toast from 'react-hot-toast';
import { CalendarRange, Edit2, Trash2, X } from 'lucide-react';

export default function Appointment() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  // Track state for updates
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = { 
    PatientID: '', 
    DoctorCode: '', 
    AppointmentDate: '', 
    Diagnosis: '', 
    Treatment: '', 
    Status: 'Scheduled' 
  };
  const [form, setForm] = useState(initialFormState);

  // 1. Read / Sync State Pipelines
  const loadData = async () => {
    try {
      const [a, p, d] = await Promise.all([
        api.get('/appointments'), 
        api.get('/patients'), 
        api.get('/doctors')
      ]);
      setAppointments(a.data); 
      setPatients(p.data); 
      setDoctors(d.data);
    } catch { 
      toast.error("Error mapping internal resources"); 
    }
  };

  useEffect(() => { loadData(); }, []);

  // Helper to format ISO strings cleanly into local input datetime values
  const formatDatetimeLocal = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    // Adjust timezone offsets to match input expectations cleanly
    const pad = (num) => String(num).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // 2. Form Submission Router: Create OR Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Run Put / Edit Query Execution
        await api.put(`/appointments/${editingId}`, form);
        toast.success("Consultation parameters updated");
      } else {
        // Run Standard Post / Create Execution
        await api.post('/appointments', form);
        toast.success("Consultation window locked in successfully");
      }
      resetForm();
      loadData();
    } catch (err) { 
      toast.error(err.response?.data?.error || "Failed data validation checks."); 
    }
  };

  // 3. Delete Operational Routine
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel and remove this appointment record?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Appointment purged from ledger");
      if (editingId === id) resetForm(); // Tear down active states safely
      loadData();
    } catch {
      toast.error("Error executing destructive statement pipeline");
    }
  };

  // 4. Initialize Input State for Upgrades
  const startEdit = (appointment) => {
    setIsEditing(true);
    setEditingId(appointment.AppointmentID);
    setForm({
      PatientID: appointment.PatientID,
      DoctorCode: appointment.DoctorCode,
      AppointmentDate: formatDatetimeLocal(appointment.AppointmentDate),
      Diagnosis: appointment.Diagnosis || '',
      Treatment: appointment.Treatment || '',
      Status: appointment.Status
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setForm(initialFormState);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
      {/* Dynamic Context Management Controller Form Window */}
      <div className="bg-white p-6 rounded-xl shadow-sm h-fit border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarRange className={isEditing ? "text-amber-500" : "text-[#1976D2]"}/> 
            {isEditing ? "Modify Consultation" : "Book Consultation"}
          </h2>
          {isEditing && (
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <X size={18} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Target Patient *</label>
            <select className="w-full border p-2 rounded focus:ring-1 focus:ring-[#1976D2] outline-none" value={form.PatientID} onChange={e => setForm({...form, PatientID: e.target.value})} required>
              <option value="">-- Choose Patient --</option>
              {patients.map(p => <option key={p.PatientID} value={p.PatientID}>{p.FirstName} {p.LastName}</option>)}
            </select>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Assigned Physician *</label>
            <select className="w-full border p-2 rounded focus:ring-1 focus:ring-[#1976D2] outline-none" value={form.DoctorCode} onChange={e => setForm({...form, DoctorCode: e.target.value})} required>
              <option value="">-- Choose Doctor --</option>
              {doctors.map(d => <option key={d.DoctorCode} value={d.DoctorCode}>{d.DoctorName} ({d.Specialization})</option>)}
            </select>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Date & Time Slot *</label>
            <input type="datetime-local" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#1976D2] outline-none" value={form.AppointmentDate} onChange={e => setForm({...form, AppointmentDate: e.target.value})} required />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Diagnosis Notes</label>
            <input type="text" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#1976D2] outline-none" placeholder="Primary evaluation criteria" value={form.Diagnosis} onChange={e => setForm({...form, Diagnosis: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Treatment Protocol</label>
            <input type="text" className="w-full border p-2 rounded focus:ring-1 focus:ring-[#1976D2] outline-none" placeholder="Prescriptions or directives" value={form.Treatment} onChange={e => setForm({...form, Treatment: e.target.value})} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Status</label>
            <select className="w-full border p-2 rounded focus:ring-1 focus:ring-[#1976D2] outline-none" value={form.Status} onChange={e => setForm({...form, Status: e.target.value})}>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="pt-2 flex gap-2">
            <button type="submit" className={`w-full text-white py-2 rounded font-medium shadow transition-all ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#1976D2] hover:bg-[#1976D2]/90'}`}>
              {isEditing ? "Commit Operations Changes" : "Generate Appointment"}
            </button>
          </div>
        </form>
      </div>

      {/* Main Operational Log Ledger Listing Block */}
      <div className="bg-white rounded-xl shadow-sm p-6 xl:col-span-2 border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Operational Log</h2>
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center font-medium">No schedule metrics saved within the backend engine context ledger.</p>
          ) : (
            appointments.map(a => (
              <div key={a.AppointmentID} className={`border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-sm bg-white ${editingId === a.AppointmentID ? 'border-amber-400 ring-1 ring-amber-400 bg-amber-50/10' : 'hover:border-gray-300'}`}>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-800">Pat: {a.FirstName} {a.LastName}</h4>
                  <p className="text-xs font-semibold text-[#009688]">Doc: {a.DoctorName}</p>
                  {(a.Diagnosis || a.Treatment) && (
                    <p className="text-xs text-gray-500 italic bg-gray-50 p-1.5 rounded border border-gray-100 max-w-md">
                      {a.Diagnosis && <span><strong>Diag:</strong> {a.Diagnosis}</span>}
                      {a.Treatment && <span> | <strong>Rx:</strong> {a.Treatment}</span>}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 font-mono pt-1">{new Date(a.AppointmentDate).toLocaleString()}</p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-none pt-2 sm:pt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${a.Status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : a.Status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                    {a.Status}
                  </span>
                  
                  {/* Ledger Modifiers Interactive Button Block */}
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(a)} title="Edit Entry" className="p-2 text-gray-500 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(a.AppointmentID)} title="Purge Record" className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}