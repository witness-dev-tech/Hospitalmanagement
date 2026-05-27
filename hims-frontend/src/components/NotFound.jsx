import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-4 text-center">
      <ShieldAlert size={64} className="text-[#FF9800] mb-4" />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-2">404 - Endpoint Untracked</h1>
      <p className="text-gray-500 max-w-sm mb-6">The routing node you requested does not exist or has been moved to a different security hierarchy clearance level.</p>
      <Link to="/" className="px-6 py-2 bg-[#1976D2] text-white font-medium rounded-lg shadow hover:bg-[#1976D2]/90 transition">Return to Dashboard Core</Link>
    </div>
  );
}