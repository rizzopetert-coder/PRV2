"use client";

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Maximize2, Zap, Anchor } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  const themes = [
    { id: 'light', label: 'Harbor', icon: <Sun size={18} /> },
    { id: 'bone', label: 'Bone', icon: <Maximize2 size={18} /> },
    { id: 'sea', label: 'Sea', icon: <Anchor size={18} /> }, //
    { id: 'slate', label: 'Slate', icon: <Moon size={18} /> },
    { id: 'night', label: 'Night', icon: <Zap size={18} /> }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('pr-theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const cycleTheme = () => {
    const currentIndex = themes.findIndex(t => t.id === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex].id;

    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('pr-theme', nextTheme);
  };

  const currentThemeData = themes.find(t => t.id === theme) || themes[0];

  return (
    <button 
      onClick={cycleTheme}
      className="fixed bottom-10 right-10 z-[100] p-4 bg-brand-bg/5 border border-brand-border backdrop-blur-xl rounded-full shadow-2xl hover:border-brand-accent transition-all group active:scale-95 flex items-center gap-3"
    >
      <div className="relative w-5 h-5 flex items-center justify-center text-brand-text group-hover:text-brand-accent transition-colors">
        {currentThemeData.icon}
      </div>
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-brand-muted group-hover:text-brand-text transition-colors pr-2 font-bold">
        {currentThemeData.label}
      </span>
    </button>
  );
}