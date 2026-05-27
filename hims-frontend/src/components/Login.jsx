import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/apiAxios';
import toast from 'react-hot-toast';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return toast.error("Please fill in all fields");
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success("Welcome back!");
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border border-gray-100">
        
        {/* Brand Header Section with SVG Integration */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-full max-w-[280px] h-auto mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%">
              <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="100%" stop-color="#f8fafc" />
                </linearGradient>
                <linearGradient id="tealGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#00695c" />
                  <stop offset="50%" stop-color="#009688" />
                  <stop offset="100%" stop-color="#4db6ac" />
                </linearGradient>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#2196f3" />
                  <stop offset="100%" stop-color="#1565c0" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <rect width="100%" height="100%" fill="url(#bgGrad)" rx="16" />

              <g opacity="0.1" stroke="#009688" stroke-width="1.5" fill="none">
                <circle cx="400" cy="225" r="320" stroke-dasharray="5 10" />
                <circle cx="400" cy="225" r="200" />
                <path d="M 80,225 L 720,225 M 400,0 L 400,450" />
              </g>

              <g transform="translate(145, 225)">
                <circle cx="0" cy="0" r="75" fill="#009688" opacity="0.1" filter="url(#glow)" />
                <g stroke="url(#tealGrad)" stroke-width="2" fill="none">
                  <path d="M -85,-45 L -105,-45 L -120,-30" />
                  <path d="M 85,45 L 105,45 L 120,30" />
                  <path d="M -45,85 L -45,105 L -30,120" />
                  <path d="M 45,-85 L 45,-105 L 30,-120" />
                </g>
                <circle cx="-120" cy="-30" r="4" fill="#4db6ac" />
                <circle cx="120" cy="30" r="4" fill="#4db6ac" />
                <circle cx="-30" cy="120" r="4" fill="#4db6ac" />
                <circle cx="30" cy="-120" r="4" fill="#4db6ac" />

                <path d="M -65,-25 C -65,-60 -35,-75 0,-80 L 0,-45 C -20,-42 -35,-32 -35,-10 C -35,20 -15,38 0,45 L 0,80 C -40,70 -65,35 -65,-25 Z" fill="url(#blueGrad)" />
                <path d="M 65,-25 C 65,-60 35,-75 0,-80 L 0,-45 C 20,-42 35,-32 35,-10 C 35,20 15,38 0,45 L 0,80 C 40,70 65,35 65,-25 Z" fill="url(#tealGrad)" />
                <path d="M -45,0 L -20,0 L -12,-28 L -2,35 L 8,-18 L 15,12 L 22,-5 L 45,-5" fill="none" stroke="#0f172a" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" />
              </g>

              <text x="315" y="222" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="56" letter-spacing="0.5">
                <tspan fill="#0f172a">Smart</tspan>
                <tspan fill="url(#tealGrad)">Care</tspan>
              </text>
              <text x="320" y="260" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="20" fill="#64748b" letter-spacing="7.5">
                HOSPITAL LTD
              </text>
              <path d="M 320,280 L 615,280" stroke="url(#blueGrad)" stroke-width="3" stroke-linecap="round" opacity="0.8" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-1">HIMS Portal Access</p>
        </div>
        
        {/* Input Interactive Fields Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User size={18} />
              </span>
              <input 
                type="text" 
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2] border-gray-200 transition-all" 
                placeholder="Enter username" 
                onChange={e => setFormData({...formData, username: e.target.value})} 
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input 
                type="password" 
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2] border-gray-200 transition-all" 
                placeholder="••••••••" 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-2.5 bg-[#1976D2] text-white font-medium rounded-lg hover:bg-[#1976D2]/90 active:scale-[0.99] transition disabled:opacity-50 disabled:pointer-events-none mt-2 shadow-sm"
          >
            {loading ? 'Authenticating Asset Execution...' : 'Sign In to Portal'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New staff member? <Link to="/register" className="text-[#009688] hover:underline font-medium ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
}