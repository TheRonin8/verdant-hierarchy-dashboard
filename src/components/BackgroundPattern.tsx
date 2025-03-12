
import React from 'react';

const BackgroundPattern = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-5">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="plant-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M20 0 L20 40 M0 20 L40 20" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="20" r="3" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#plant-pattern)" />
      </svg>
    </div>
  );
};

export default BackgroundPattern;
