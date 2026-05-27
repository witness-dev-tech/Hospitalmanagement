import React, { useEffect, useState } from 'react';
import api from '../api/apiAxios';
import toast from 'react-hot-toast';
import { FileSpreadsheet, Eye, ShieldAlert, Activity, User, Users, CheckCircle, Clock, Search, X } from 'lucide-react';

export default function Report() {
  const [reportData, setReportData] = useState(null);
  const [currentType, setCurrentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const runReport = async (endpoint, typeLabel, isInitialMount = false) => {
    setLoading(true);
    setSearchQuery(''); // Reset search when switching reports
    try {
      const res = await api.get(`/reports/${endpoint}`);
      setReportData(res.data);
      setCurrentType(typeLabel);
      if (!isInitialMount) {
        toast.success(`${typeLabel} generated`);
      }
    } catch (err) {
      toast.error("Error polling system reporting pipeline engine");
    } finally {
      setLoading(false);
    }
  };

  // Auto-load the Appointment History on initial component mount
  useEffect(() => {
    runReport('appointments', 'Appointment History', true);
  }, []);

  // Helper component to render specific data based on selected report
  const RenderReportContent = () => {
    if (!reportData) return null;

    // 1. Treatment Metrics Summary (Has nested layout structures)
    if (currentType === 'Treatment Metrics Summary') {
      const metrics = reportData.summaryMetrics || {};
      const breakdown = reportData.treatmentFrequencyBreakdown || [];

      // Filter breakdown data based on search string criteria
      const filteredBreakdown = breakdown.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
          (item.Diagnosis && item.Diagnosis.toLowerCase().includes(query)) ||
          (item.Treatment && item.Treatment.toLowerCase().includes(query))
        );
      });

      return (
        <div className="space-y-6">
          {/* Summary Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border rounded-xl bg-teal-50/40 border-teal-100/80 flex items-center gap-3.5">
              <div className="p-2.5 bg-teal-500/10 rounded-lg text-teal-600">
                <Activity size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Tracked</p>
                <p className="text-xl font-extrabold text-gray-800 mt-0.5">{metrics.TotalTreatmentsTracked || 0}</p>
              </div>
            </div>
            
            <div className="p-4 border rounded-xl bg-blue-50/40 border-blue-100/80 flex items-center gap-3.5">
              <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-600">
                <CheckCircle size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Completed</p>
                <p className="text-xl font-extrabold text-gray-800 mt-0.5">{metrics.CompletedTreatments || 0}</p>
              </div>
            </div>

            <div className="p-4 border rounded-xl bg-red-50/40 border-red-100/80 flex items-center gap-3.5">
              <div className="p-2.5 bg-red-500/10 rounded-lg text-red-600">
                <ShieldAlert size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Cancelled</p>
                <p className="text-xl font-extrabold text-gray-800 mt-0.5">{metrics.CancelledAppointments || 0}</p>
              </div>
            </div>
          </div>

          {/* Breakdown Data Table */}
          <div className="overflow-hidden border border-gray-200/80 rounded-xl bg-white shadow-xs">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/60">
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Diagnosis</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Treatment Protocol</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center w-40">Frequency Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400 font-medium">
                      {breakdown.length === 0 ? 'No treatment items identified.' : 'No filtered metrics match your search term.'}
                    </td>
                  </tr>
                ) : (
                  filteredBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-800">{item.Diagnosis}</td>
                      <td className="px-6 py-4 text-gray-600">{item.Treatment || '—'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-[#009688]">
                          {item.Frequency}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // 2. Fallback to generic array mapping for structural CRUD logs
    const tableData = reportData.data || [];
    if (!Array.isArray(tableData) || tableData.length === 0) {
      return (
        <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
          <p className="text-sm text-gray-400 font-medium">No system metrics recorded for this engine parameter.</p>
        </div>
      );
    }

    const headers = Object.keys(tableData[0] || {});

    // Generic structural key value matching loop logic across all primitive columns
    const filteredTableData = tableData.filter(row => {
      const query = searchQuery.toLowerCase();
      return headers.some(key => {
        const val = row[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(query);
      });
    });

    return (
      <div className="overflow-hidden border border-gray-200/80 rounded-xl bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/60">
                {headers.map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h.replace(/([A-Z])/g, ' $1').trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTableData.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-400 font-medium">
                    No matching records found for your search parameters.
                  </td>
                </tr>
              ) : (
                filteredTableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                    {headers.map((col) => {
                      let val = row[col];
                      if (col.toLowerCase().includes('date') && val) {
                        val = new Date(val).toLocaleDateString();
                      }
                      return (
                        <td key={col} className="px-6 py-3.5 text-gray-700 text-sm font-medium whitespace-nowrap group-hover:text-gray-900 transition-colors">
                          {val !== null && val !== undefined ? String(val) : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-[#1A2530]">
      {/* Dynamic Main Header Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clinical Core Analytics</h1>
          <p className="text-sm text-gray-500">Query background structural logs, diagnostics performance metadata, and census indexes.</p>
        </div>
      </div>

      {/* Selection Control Panel Wrapper */}
      <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <FileSpreadsheet className="text-[#009688]" size={20}/>
          <h2 className="text-base font-bold text-gray-800">Real-time Pipeline Engine Parameters</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'appointments', label: 'Appointment History', name: 'Appointment Log', icon: <Eye size={16}/> },
              { id: 'doctors', label: 'Doctors Metrics', name: 'Doctors Registry', icon: <Users size={16}/> },
              { id: 'patients', label: 'Patients Demographics', name: 'Patient Index', icon: <User size={16}/> },
              { id: 'treatments-summary', label: 'Treatment Metrics Summary', name: 'Diagnostics Mix', icon: <Activity size={16}/> }
            ].map((btn) => {
              const isActive = currentType === btn.label;
              return (
                <button 
                  key={btn.id}
                  disabled={loading}
                  onClick={() => runReport(btn.id, btn.label)} 
                  className={`p-3.5 border rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#1976D2]/40 ${
                    isActive 
                      ? 'bg-[#1976D2] border-[#1976D2] text-white shadow-xs shadow-[#1976D2]/10' 
                      : 'border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-gray-400'}>{btn.icon}</span>
                  {btn.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Dynamic Report Viewport Panel */}
      {reportData ? (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs p-6 space-y-5 transition-all duration-200">
          <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">{reportData.reportName || currentType}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                <Clock size={12} />
                <span>Generated: {reportData.generatedAt ? new Date(reportData.generatedAt).toLocaleString() : new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* Embedded Live Database Fuzzy Search Input Field Container */}
            <div className="flex items-center gap-3 w-full md:w-auto flex-1 md:max-w-xs">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Filter data records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 border border-gray-200 rounded-lg text-xs font-medium focus:outline-hidden focus:border-[#1976D2] focus:ring-2 focus:ring-[#1976D2]/10 bg-gray-50/30 transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 rounded-md transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <span className="hidden lg:inline-block text-[10px] font-mono font-bold bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 rounded-md text-amber-700 tracking-wider whitespace-nowrap">
                SECURE DISCLOSURE
              </span>
            </div>
          </div>
          
          {/* Output Window Content */}
          <div className="pt-1">
            <RenderReportContent />
          </div>
        </div>
      ) : (
        /* Loading skeleton fallback while the initial report loads */
        <div className="bg-white rounded-xl border border-gray-200/80 p-12 text-center shadow-xs">
          <div className="w-6 h-6 border-2 border-[#1976D2] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Connecting to data engine...</p>
        </div>
      )}
    </div>
  );
}