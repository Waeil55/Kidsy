import React, { useEffect, useState } from 'react';
export const useHash = () => {
  const [h, setH] = useState(() => (typeof location !== 'undefined' && location.hash.slice(1)) || '/');
  useEffect(() => {
    const f = () => { setH(location.hash.slice(1) || '/'); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return h;
};
export const go = (p) => { location.hash = p; };
export const parse = (h) => h.split('?')[0].split('/').filter(Boolean);
export const Link = ({ to, children, ...rest }) => React.createElement('a', { href: '#' + to, ...rest }, children);
