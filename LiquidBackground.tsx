import React from 'react';

export const LiquidBackground: React.FC = () => {
  return (
    <>
      <div className="liquid-background">
        <div className="liquid-blob blob-1" />
        <div className="liquid-blob blob-2" />
        <div className="liquid-blob blob-3" />
        <div className="liquid-blob blob-4" />
      </div>
      <svg id="liquid-filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix 
              in="blur" 
              mode="matrix" 
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" 
              result="gooey" 
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>
    </>
  );
};
