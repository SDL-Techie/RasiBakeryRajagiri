import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`rasi-logo-wrapper ${className}`}>
      {/* <svg 
        width="40" 
        height="40" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" stroke="#5D2E0C" strokeWidth="4" fill="#FFF9F5"/>
        <path 
          d="M30 70V30H50C60 30 65 35 65 42.5C65 50 60 55 50 55H40V70H30ZM40 45H50C55 45 55 40 55 40C55 35 50 35 50 35H40V45Z" 
          fill="#5D2E0C"
        />
        <path 
          d="M55 55L70 75" 
          stroke="#5D2E0C" 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        <path 
          d="M75 30C75 30 85 35 85 45C85 55 75 60 75 60" 
          stroke="#D4AF37" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
      </svg> */}
      <img className="rasi-logo-img" style={{ width: '40px', height: '40px' }} src="/assets/logo.png" alt="Rasi Bakery Logo"/>
      <div className="rasi-logo-text">
        <span className="rasi-logo-main">RASI</span>
        <span className="rasi-logo-sub">BAKERY</span>
      </div>
    </div>
  );
};

export default Logo;
