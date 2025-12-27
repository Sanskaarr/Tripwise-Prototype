import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-border/40 pb-6 pt-6 text-[11px] uppercase tracking-[0.24em] text-muted-foreground bg-background">
      <div className="mx-auto max-w-5xl px-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <span className="font-medium whitespace-nowrap">
          TripWise · AI-powered travel companion
        </span>
        <span className="font-medium whitespace-nowrap">
          Begin your journey when you&apos;re ready.
        </span>
      </div>
    </footer>
  );
};

export default Footer;