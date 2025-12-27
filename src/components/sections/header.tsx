import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center">
      {/* Container - Glassmorphic Pill */}
      <div 
        className="pointer-events-auto mt-4 flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2.5 md:px-5 md:py-3 lg:px-6 glass-nav transition-all duration-300 bg-white/70 backdrop-blur-md"
        style={{
          boxShadow: 'rgba(255, 255, 255, 0.55) 0px 0px 0px 1px, rgba(156, 179, 201, 0.4) 0px 18px 60px 0px',
          height: '71.5px'
        }}
      >
        {/* Left: Logo Section */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-full px-1 py-0.5 transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            <div className="relative h-7 w-7 transition-transform duration-300 hover:scale-110 active:scale-95">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/ff3e85b0-b535-4371-94be-f6c006ccc074-escape-echoes-lovable-app/assets/icons/tripwise-logo-Kcapxg4_-1.png"
                alt="TripWise logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-left leading-tight">
              <span className="block text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500/80">
                AI travel companion
              </span>
              <div className="text-sm font-semibold text-[#0F172A] md:text-base font-sans">
                TripWise
              </div>
            </div>
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden items-center gap-6 md:flex">
          {[
            { label: 'Home', href: '#' },
            { label: 'Start Journey', href: '#' },
            { label: 'Plan Trip', href: '#' },
            { label: 'Local Guide', href: '#' }
          ].map((item) => (
            <button 
              key={item.label}
              className="relative text-[13px] font-medium text-slate-500 transition-colors hover:text-[#0F172A]"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Start Trip Button */}
          <button 
            className="hidden h-9 items-center justify-center rounded-full bg-white/70 px-4 text-[13px] font-medium text-[#0F172A] shadow-sm transition-transform hover:scale-105 active:scale-95 md:inline-flex"
            style={{
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            Start your trip
          </button>

          {/* Unique Menu Toggle */}
          <button 
            className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200/60 bg-white/70 px-3 py-0 backdrop-blur-md transition hover:bg-white md:px-4"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0F172A]/80">
              Menu
            </span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F172A] text-[8px] text-[#F1F5F9] transition-transform">
              ☼
            </span>
          </button>
        </div>
      </div>
      
      {/* Background Overlay Effect (Inactive by default) */}
      <div className="pointer-events-none fixed inset-0 z-30 opacity-0 transition-opacity duration-400 bg-black/5" />
    </header>
  );
};

export default Header;