import React from 'react';
import { BookOpen, ChartNoAxesColumn, House, Settings, ShieldCheck, Users, WifiOff } from 'lucide-react';
import { useApp } from '../store/AppContext';

export function Layout({ page, setPage, children }) {
  const { child, children: kids, setChild, online, role, setRole } = useApp();

  const nav = [
    ['home', 'Home', House],
    ['learn', 'Learn', BookOpen],
    ['progress', 'Progress', ChartNoAxesColumn],
    ['parent', 'Family', Users],
    ['settings', 'Settings', Settings]
  ];

  return (
    <div className="shell">
      <header className="topbar">
        <button className="brand" onClick={() => setPage('home')}>
          <span className="brandMark">★</span>
          <span>MerolaApp</span>
          <small>ENTERPRISE</small>
        </button>

        <div className="topActions">
          {!online && (
            <span className="offline">
              <WifiOff size={14} /> Offline
            </span>
          )}
          <select value={child.id} onChange={(e) => setChild(e.target.value)}>
            {kids.map((k) => (
              <option key={k.id} value={k.id}>
                {k.avatar} {k.name} (Gr {k.grade})
              </option>
            ))}
          </select>
          <div className="avatar" title={`${child.name} - Grade ${child.grade}`}>
            {child.avatar}
          </div>
        </div>
      </header>

      <main className="main">{children}</main>

      <nav className="bottomnav">
        {nav.map(([id, label, IconComponent]) => (
          <button
            key={id}
            className={page === id ? 'active' : ''}
            onClick={() => setPage(id)}
          >
            <IconComponent size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {role !== 'parent' && (
        <div className="rolebar">
          <ShieldCheck size={14} /> {role.toUpperCase()} MODE
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      )}
    </div>
  );
}
