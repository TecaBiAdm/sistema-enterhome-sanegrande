import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { CompanyProvider, useCompany } from './CompanyContext'; // Importando o contexto de empresa

const URL = 'https://sysgrande-nodejs.onrender.com/api/'
const URL_LOCAL = 'http://localhost:5000/api/'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { setSelectedCompany, clearCompany } = useCompany(); // Acesso ao contexto de empresa

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (token && userId && userRole) {
      fetchUserDetails(userId, token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await fetch(`${URL_LOCAL}user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();

      if (data.role != null) {
        localStorage.setItem('userRole', data.role);
      }

      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    const { access_token, user } = userData;

    localStorage.setItem('token', access_token);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userRole', user.role);

    Cookies.set('token', access_token, { expires: 7 });

    fetchUserDetails(user.id, access_token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    Cookies.remove('token');
    Cookies.remove('userRole');
    clearCompany(); // Limpa a empresa ao fazer logout
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
