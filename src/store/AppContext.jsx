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

import { generateChildrenSignatures, verifyChildIntegrity, installAntiCheatGuards } from '../lib/security';

const demoChild = {
  id: 'merola',
  name: 'Merola',
  grade: '3',
  avatar: '🦊',
  avatarId: 'rex',
  xp: 140,
  streak: 4,
  minutes: 36,
  completed: ['gr3-eng-01'],
  dailyGoal: 20,
  giftGoal: defaultGiftGoal
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [kids, setKids] = useState(() => {
    try {
      const item = localStorage.getItem('merola_v2_children');
      const sigsItem = localStorage.getItem('merola_v2_children_sigs');
      if (item) {
        const parsed = JSON.parse(item);
        const sigs = sigsItem ? JSON.parse(sigsItem) : null;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((k) => {
            const childObj = {
              ...k,
              giftGoal: k.giftGoal || { ...defaultGiftGoal }
            };
            // Anti-hack check: if signature exists and is invalid, sanitize cheated progress
            if (sigs && sigs[k.id] && !verifyChildIntegrity(childObj, sigs[k.id])) {
              console.warn(`[Anti-Hack Guard] Tampering detected on ${k.id}! Reverting cheated state.`);
              childObj.giftGoal.progress = 0;
              childObj.giftGoal.isUnlocked = false;
            }
            return childObj;
          });
        }
      }
    } catch (e) {}
    return [demoChild];
  });

  const [activeId, setActiveId] = useState(() => {
    try {
      const item = localStorage.getItem('merola_v2_children');
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id) {
          return parsed[0].id;
        }
      }
    } catch (e) {}
    return 'merola';
  });

  const [online, setOnline] = useState(navigator.onLine);
  const [role, setRole] = useState('parent');

  useEffect(() => {
    // Install anti-cheat keyboard and inspect guards
    const uninstallGuards = installAntiCheatGuards();

    getState('children', null).then((v) => {
      if (Array.isArray(v) && v.length > 0) {
        const populated = v.map((k) => ({
          ...k,
          giftGoal: k.giftGoal || { ...defaultGiftGoal }
        }));
        setKids(populated);
        setActiveId(populated[0].id);
      }
    });
    getState('role', 'parent').then(setRole);

    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      uninstallGuards();
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
    setKids((prev) => {
      const updated = prev.map((k) => {
        if (k.id !== child.id) return k;
        const currentGoal = k.giftGoal || defaultGiftGoal;
        // CRITICAL: ALWAYS preserve existing points and solved questions!
        const preservedProgress =
          newGoal.progress !== undefined ? newGoal.progress : (currentGoal.progress || 0);
        const preservedAnswered =
          newGoal.answeredQuestionIds || currentGoal.answeredQuestionIds || [];
        const targetQ = newGoal.targetQuestions || currentGoal.targetQuestions || 70;
        const unlocked = preservedProgress >= targetQ;

        return {
          ...k,
          giftGoal: {
            ...currentGoal,
            ...newGoal,
            targetQuestions: targetQ,
            progress: preservedProgress,
            answeredQuestionIds: preservedAnswered,
            isUnlocked: unlocked,
            hasPicked: true
          }
        };
      });
      // Immediately persist to localStorage
      setState('children', updated);
      return updated;
    });
  };

  const advanceGiftProgress = (questionId, isCorrect = true) => {
    setKids((prev) => {
      const updated = prev.map((k) => {
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
      });
      // Immediately persist to localStorage
      setState('children', updated);
      return updated;
    });
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
