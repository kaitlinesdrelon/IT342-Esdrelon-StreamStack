import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // FIX 1: Gamit og useRef para sa observers aron dili mag-trigger og re-render ang subscription
  const observersRef = useRef([]);
  
  // FIX 2: I-memoize ang notifyObservers aron stable ang iyang reference
  const notifyObservers = useCallback((action, data) => {
    observersRef.current.forEach(observer => {
      if (observer && observer.onAuthChange) {
        observer.onAuthChange(action, data);
      }
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
        // Ginagmay nga delay aron masiguro nga ang state naka-set na sa dili pa i-notify
        setTimeout(() => notifyObservers('LOGIN', userData), 0);
      } catch (e) {
        console.error("Auth initialization error:", e);
      }
    }
    
    setIsLoading(false);
  }, [notifyObservers]);
  
  // FIX 3: I-memoize ang subscribe gamit ang useCallback
  const subscribe = useCallback((observer) => {
    observersRef.current.push(observer);
    
    return () => {
      observersRef.current = observersRef.current.filter(obs => obs !== observer);
    };
  }, []);
  
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
    notifyObservers('LOGIN', userData);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    notifyObservers('LOGOUT', null);
  };
  
  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUserData));
    
    setUser(newUserData);
    notifyObservers('UPDATE', newUserData);
  };
  
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    subscribe, 
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;