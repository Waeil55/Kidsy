import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getState, setState } from '../lib/db';

const defaultGiftGoal = {
  category: 'toy',
  title: 'Cosmic Robot 🧸',
  icon: '🧸',
  targetQuestions: 70,
  progress: 0,
  isUnlocked: false,
  answeredQuestionIds: [],
  hasPicked: false
};

const demoChild = {
  id: 'merola',
  name: 'Merola',
  grade: '3',
  avatar: '🦖',
  avatarId: 'rex',
  xp: 450,
  streak: 5,
  completed: ['3-week5-0', '3-week5-1'],
  minutes: 35,
  dailyGoal: 20,
  giftGoal: defaultGiftGoal
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [kids, setKids] = useState([]);
  const [activeId, setActiveId] = useState('merola');
  const [online, setOnline] = useState(navigator.onLine);
  const [role, setRole] = useState('parent');

  useEffect(() => {
    getState('children', [demoChild]).then((v) => {
      const list = Array.isArray(v) && v.length ? v : [demoChild];
      // Ensure each child has a giftGoal
      const populated = list.map((k) => ({
        ...k,
        giftGoal: k.giftGoal || { ...defaultGiftGoal }
      }));
      setKids(populated);
      setActiveId(populated[0].id);
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
    return kids.find((k) => k.id === activeId) || kids[0] || demoChild;
  }, [kids, activeId]);

  const complete = (lessonId, xp, minutes) => {
    setKids((prev) =>
      prev.map((k) => {
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

  const setGiftGoal = (newGoal) => {
    setKids((prev) =>
      prev.map((k) => {
        if (k.id !== child.id) return k;
        return {
          ...k,
          giftGoal: {
            ...k.giftGoal,
            ...newGoal,
            isUnlocked: false,
            hasPicked: true
          }
        };
      })
    );
  };

  const advanceGiftProgress = (questionId, isCorrect = true) => {
    setKids((prev) =>
      prev.map((k) => {
        if (k.id !== child.id) return k;
        const currentGoal = k.giftGoal || defaultGiftGoal;
        const answered = currentGoal.answeredQuestionIds || [];
        // Correct: +1 point and mark answered
        // Wrong: -1 point penalty to avoid guessing without studying! Do not mark answered so it re-appears.
        const nextAnswered = isCorrect && questionId ? [...new Set([...answered, questionId])] : answered;
        const nextProg = isCorrect
          ? currentGoal.progress + 1
          : Math.max(0, currentGoal.progress - 1);
        const targetQ = currentGoal.targetQuestions || 70;
        const unlocked = nextProg >= targetQ;

        return {
          ...k,
          xp: Math.max(0, k.xp + (isCorrect ? 15 : -5)),
          giftGoal: {
            ...currentGoal,
            targetQuestions: targetQ,
            progress: nextProg,
            isUnlocked: unlocked,
            answeredQuestionIds: nextAnswered
          }
        };
      })
    );
  };

  const claimGift = () => {
    setKids((prev) =>
      prev.map((k) => {
        if (k.id !== child.id) return k;
        const currentGoal = k.giftGoal || defaultGiftGoal;
        return {
          ...k,
          xp: k.xp + 100, // Grand gift unlock bonus!
          giftGoal: {
            ...currentGoal,
            progress: 0,
            isUnlocked: false,
            answeredQuestionIds: []
          }
        };
      })
    );
  };

  const addChild = (newChild) => {
    const withGoal = {
      ...newChild,
      giftGoal: newChild.giftGoal || { ...defaultGiftGoal }
    };
    setKids((prev) => [...prev, withGoal]);
    setActiveId(withGoal.id);
  };

  const updateChild = (id, partial) => {
    setKids((prev) => prev.map((k) => (k.id === id ? { ...k, ...partial } : k)));
  };

  const value = useMemo(
    () => ({
      child,
      children: kids,
      setChild: (id) => setActiveId(id),
      addChild,
      updateChild,
      complete,
      setGiftGoal,
      advanceGiftProgress,
      claimGift,
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
