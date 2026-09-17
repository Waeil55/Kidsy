import React from 'react';

export function Card({ children, className = '' }) {
  return <section className={`card ${className}`}>{children}</section>;
}
