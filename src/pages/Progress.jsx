import React from 'react';
import { Award, Flame, Target, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/Card';
import { useApp } from '../store/AppContext';
import { getLessons, subjects } from '../data/curriculum';

export function Progress() {
  const { child } = useApp();
  const allLessons = getLessons(child.grade);
  const completedSet = new Set(child.completed);
  const pct = Math.round((completedSet.size / Math.max(1, allLessons.length)) * 100);

  return (
    <div className="page">
      <div className="pageHead">
        <div>
          <p className="eyebrow">Learning Analytics</p>
          <h1>{child.name}'s Progress</h1>
          <p>Grade {child.grade} · Your learning journey at a glance.</p>
        </div>
      </div>

      <section className="progressHero">
        <div className="progressRing" style={{ '--pct': `${pct}%` }}>
          <span>{pct}%</span>
        </div>
        <div>
          <p className="eyebrow">Curriculum Mastery</p>
          <h2>Keep up the great work!</h2>
          <p>
            {completedSet.size} of {allLessons.length} activities completed.
          </p>
        </div>
      </section>

      <div className="stats">
        <Card>
          <TrendingUp />
          <b>{child.xp}</b>
          <span>total XP</span>
        </Card>
        <Card>
          <Flame />
          <b>{child.streak}</b>
          <span>day streak</span>
        </Card>
        <Card>
          <Clock />
          <b>{child.minutes}</b>
          <span>minutes learned</span>
        </Card>
      </div>

      <Card>
        <div className="cardTitle">
          <Award />
          <h2>Subject Progress</h2>
        </div>
        <div className="bars">
          {subjects.map((s) => {
            const ls = allLessons.filter((l) => l.subject === s.id);
            const n = ls.filter((l) => completedSet.has(l.id)).length;
            const p = Math.round((n / Math.max(1, ls.length)) * 100);
            return (
              <div className="barRow" key={s.id}>
                <span>
                  {s.icon} {s.name}
                </span>
                <div>
                  <i style={{ width: `${p}%` }} />
                </div>
                <b>{p}%</b>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="badgeGrid">
        <Card>
          <Target />
          <h3>Daily Goal</h3>
          <b>
            {Math.min(child.minutes, child.dailyGoal)} / {child.dailyGoal} min
          </b>
          <small>Complete a little every day to keep your streak.</small>
        </Card>
        <Card>
          <CheckCircle2 />
          <h3>First Steps</h3>
          <b>{completedSet.size > 0 ? 'Unlocked 🏆' : 'Locked 🔒'}</b>
          <small>Finish your first learning activity to unlock.</small>
        </Card>
      </div>
    </div>
  );
}
