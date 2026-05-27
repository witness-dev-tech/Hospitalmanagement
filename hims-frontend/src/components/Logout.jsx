import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiAxios';
import toast from 'react-hot-toast';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    async function executeLogout() {
      try {
        await api.post('/auth/logout');
        localStorage.clear();
        toast.success("Session closed safely.");
      } catch {
        localStorage.clear();
      } finally {
        navigate('/login');
      }
    }
    executeLogout();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <p className="text-gray-500 font-medium animate-pulse">Invalidating security access keys tokens...</p>
    </div>
  );
}