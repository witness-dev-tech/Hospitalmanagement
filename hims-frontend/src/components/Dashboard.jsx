import React, { useState, useEffect } from 'react';
import api from '../api/apiAxios';
import { Users, UserCog, CalendarDays, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [p, d, a] = await Promise.all([api.get('/patients'), api.get('/doctors'), api.get('/appointments')]);
        setCounts({ patients: p.data.length, doctors: d.data.length, appointments: a.data.length });
      } catch (err) { console.error("Failed loading summary counts"); }
    }
    loadStats();
  }, []);

  const stats = [
    { label: 'Registered Patients', count: counts.patients, color: 'border-l-4 border-[#1976D2]', icon: <Users className="text-[#1976D2]" size={28} /> },
    { label: 'Active Personnel', count: counts.doctors, color: 'border-l-4 border-[#009688]', icon: <UserCog className="text-[#009688]" size={28} /> },
    { label: 'Total Operations scheduled', count: counts.appointments, color: 'border-l-4 border-[#FF9800]', icon: <CalendarDays className="text-[#FF9800]" size={28} /> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Administrative Dashboard</h1>
      <p className="text-gray-500 mb-6">Real-time status updates across running clinical registries.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((card, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-xl shadow-sm flex items-center justify-between ${card.color}`}>
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{card.count}</h3>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">{card.icon}</div>
          </div>
        ))}
      </div>
    </div>
  );
}