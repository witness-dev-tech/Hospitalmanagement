import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Users, UserCog, CalendarClock, FileBarChart, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Patients', path: '/patients', icon: <Users size={18} /> },
    { name: 'Doctors', path: '/doctors', icon: <UserCog size={18} /> },
    { name: 'Appointments', path: '/appointments', icon: <CalendarClock size={18} /> },
    { name: 'Reports Summary', path: '/reports', icon: <FileBarChart size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col antialiased font-sans">
      
      {/* Global Sticky Top Header Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200/80 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Identity / Logo Assembly */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#1976D2]/10 rounded-xl p-1.5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="mTeal" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4db6ac" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="mBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2196f3" />
                    <stop offset="100%" stopColor="#1565c0" />
                  </linearGradient>
                </defs>
                <g transform="translate(100, 100) scale(0.95)">
                  <path d="M -65,-25 C -65,-60 -35,-75 0,-80 L 0,-45 C -20,-42 -35,-32 -35,-10 C -35,20 -15,38 0,45 L 0,80 C -40,70 -65,35 -65,-25 Z" fill="url(#mBlue)" />
                  <path d="M 65,-25 C 65,-60 35,-75 0,-80 L 0,-45 C 20,-42 35,-32 35,-10 C 35,20 15,38 0,45 L 0,80 C 40,70 65,35 65,-25 Z" fill="url(#mTeal)" />
                  <path d="M -45,0 L -20,0 L -12,-28 L -2,35 L 8,-18 L 15,12 L 22,-5 L 45,-5" fill="none" stroke="#1A2530" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-base text-[#1A2530] leading-none">SmartCare</span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest mt-0.5 uppercase">Hospital Ltd</span>
            </div>
          </div>

          {/* Desktop Navigation Link Row */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-semibold text-sm transition-all duration-150 group outline-hidden focus-visible:ring-2 focus-visible:ring-[#1976D2]/30 ${
                    isActive
                      ? 'bg-[#1976D2]/10 text-[#1976D2]'
                      : 'text-[#2C3E50]/80 hover:bg-gray-50 hover:text-[#1A2530]'
                  }`}
                >
                  <span className={`transition-colors duration-150 ${
                    isActive ? 'text-[#1976D2]' : 'text-gray-400 group-hover:text-[#009688]'
                  }`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Logout Button */}
          <div className="hidden md:flex items-center border-l border-gray-200 pl-4">
            <Link
              to="/logout"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl font-semibold text-sm transition-all text-red-600 hover:bg-red-50 group outline-hidden focus-visible:ring-2 focus-visible:ring-red-500/20"
            >
              <LogOut size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
              <span>Log Out</span>
            </Link>
          </div>

          {/* Mobile Menu Action Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors outline-hidden focus:ring-2 focus:ring-[#1976D2]/30 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Popover Overlay Navigation Dropdown panel */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-gray-200 shadow-xl z-40 animate-in fade-in slide-in-from-top-4 duration-150">
          <nav className="px-4 pt-3 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? 'bg-[#1976D2] text-white shadow-xs'
                      : 'text-[#2C3E50]/80 hover:bg-gray-50'
                  }`}
                >
                  <span className={isActive ? 'text-white' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-3 mt-2 border-t border-gray-100">
              <Link
                to="/logout"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} className="text-red-400" />
                <span>Log Out</span>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Dimmed mobile background mask for popover context */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-30 md:hidden transition-opacity" 
        />
      )}

      {/* Main App Workspace Content Slot Container */}
      <main className="flex-1 p-4 md:p-8 w-full">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
}