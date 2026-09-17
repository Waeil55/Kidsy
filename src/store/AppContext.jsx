import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getState, setState } from '../lib/db';

const demoChild = {
  id: 'merola',
  name: 'Merola',
  grade: '3',
  avatar: '🦊',
  xp: 450,
  streak: 5,
  completed: ['3-week5-0', '3-week5-1'],
  minutes: 35,
  dailyGoal: 20
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [kids, setKids] = useState([]);
  const [activeId, setActiveId] = useState('merola');
  const [online, setOnline] = useState(navigator.onLine);
  const [role, setRole] = useState('parent');

  useEffect(() => {
    getState('children', [demoChild]).then(v => {
      const list = Array.isArray(v) && v.length ? v : [demoChild];
      setKids(list);
      setActiveId(list[0].id);
    });
    getState('role', 'parent').then(setRole);

    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    if (kids.length > 0) {
      setState('children', kids);
    }
  }, [kids]);

  useEffect(() => {
    setState('role', role);
  }, [role]);

  const child = useMemo(() => {
    return kids.find(k => k.id === activeId) || kids[0] || demoChild;
  }, [kids, activeId]);

  const complete = (lessonId, xp, minutes) => {
    setKids(prev =>
      prev.map(k => {
        if (k.id !== child.id) return k;
        const alreadyDone = k.completed.includes(lessonId);
        return {
          ...k,
          xp: k.xp + xp,
          minutes: k.minutes + minutes,
          streak: Math.max(k.streak, 1),
          completed: alreadyDone ? k.completed : [...k.completed, lessonId]
        };
      })
    );
  };

  const addChild = (newChild) => {
    setKids(prev => [...prev, newChild]);
    setActiveId(newChild.id);
  };

  const updateChild = (id, partial) => {
    setKids(prev => prev.map(k => (k.id === id ? { ...k, ...partial } : k)));
  };

  const value = useMemo(
    () => ({
      child,
      children: kids,
      setChild: (id) => setActiveId(id),
      addChild,
      updateChild,
      complete,
      online,
      role,
      setRole
    }),
    [child, kids, online, role]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
