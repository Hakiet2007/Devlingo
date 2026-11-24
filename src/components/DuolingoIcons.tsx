import React from 'react';

// Exact Duolingo 2D vector icons matching Duolingo Web
export const DuoHomeIcon: React.FC<{ className?: string; active?: boolean }> = ({ 
  className = "w-7 h-7", 
  active = false 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Chimney */}
    <rect x="30" y="10" width="6" height="12" rx="2" fill={active ? "#1cb0f6" : "#ff4b4b"} />
    {/* Roof */}
    <path 
      d="M24 6L5 22C4 23 4.5 24 6 24H9V40C9 41.5 10.5 43 12 43H36C37.5 43 39 41.5 39 40V24H42C43.5 24 44 23 43 22L24 6Z" 
      fill={active ? "#1cb0f6" : "#ff4b4b"} 
    />
    {/* Wall / Base */}
    <path 
      d="M11 24H37V40C37 41.1 36.1 42 35 42H13C11.9 42 11 41.1 11 40V24Z" 
      fill={active ? "#1899d6" : "#e03535"} 
    />
    {/* Door */}
    <path 
      d="M19 42V31C19 28.5 21 27 24 27C27 27 29 28.5 29 31V42H19Z" 
      fill="#ffc800" 
    />
    <circle cx="27" cy="35" r="1.5" fill="#e5b400" />
  </svg>
);

export const DuoCharactersIcon: React.FC<{ className?: string; active?: boolean }> = ({ 
  className = "w-7 h-7", 
  active = false 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Rounded tile */}
    <rect 
      x="6" 
      y="6" 
      width="36" 
      height="36" 
      rx="12" 
      fill={active ? "#1cb0f6" : "#20343f"} 
      stroke={active ? "#84d8ff" : "#37464f"} 
      strokeWidth="3" 
    />
    {/* Hiragana 'A' / Code syntax styled character glyph */}
    <path 
      d="M16 19H32M24 13V35M21 26C24 23 30 25 30 30C30 34 26 36 21 34C17 32 17 27 20 23" 
      stroke="#ffffff" 
      strokeWidth="3.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export const DuoPracticeIcon: React.FC<{ className?: string; active?: boolean }> = ({ 
  className = "w-7 h-7", 
  active = false 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Barbell Bar */}
    <rect x="14" y="21" width="20" height="6" rx="3" fill="#849299" />
    {/* Left weights */}
    <rect x="9" y="14" width="6" height="20" rx="3" fill={active ? "#1cb0f6" : "#00cd9c"} />
    <rect x="4" y="17" width="5" height="14" rx="2.5" fill={active ? "#1899d6" : "#00a880"} />
    {/* Right weights */}
    <rect x="33" y="14" width="6" height="20" rx="3" fill={active ? "#1cb0f6" : "#00cd9c"} />
    <rect x="39" y="17" width="5" height="14" rx="2.5" fill={active ? "#1899d6" : "#00a880"} />
    {/* Grip highlight */}
    <line x1="21" y1="21" x2="21" y2="27" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="24" y1="21" x2="24" y2="27" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="27" y1="21" x2="27" y2="27" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const DuoLeaderboardIcon: React.FC<{ className?: string; active?: boolean }> = ({ 
  className = "w-7 h-7" 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Golden League Shield */}
    <path 
      d="M24 4L7 9V22C7 33.5 14.5 41 24 44C33.5 41 41 33.5 41 22V9L24 4Z" 
      fill="#ffc800" 
      stroke="#e5b400" 
      strokeWidth="2.5" 
    />
    <path 
      d="M24 7L10 11V22C10 31.5 16.5 38 24 40.5C31.5 38 38 31.5 38 22V11L24 7Z" 
      fill="#ffd900" 
    />
    {/* Star inside shield */}
    <path 
      d="M24 14L26.5 21H34L28 25.5L30.5 32.5L24 28L17.5 32.5L20 25.5L14 21H21.5L24 14Z" 
      fill="#ffffff" 
    />
  </svg>
);

export const DuoQuestsIcon: React.FC<{ className?: string; active?: boolean }> = ({ 
  className = "w-7 h-7" 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Chest Body */}
    <rect x="6" y="20" width="36" height="22" rx="4" fill="#d97706" />
    <rect x="8" y="22" width="32" height="18" rx="3" fill="#f59e0b" />
    {/* Chest Lid */}
    <path 
      d="M6 18C6 11 12 7 24 7C36 7 42 11 42 18H6Z" 
      fill="#b45309" 
    />
    <path 
      d="M8 18C8 12.5 13.5 9 24 9C34.5 9 40 12.5 40 18H8Z" 
      fill="#d97706" 
    />
    {/* Metal Straps */}
    <rect x="12" y="7" width="5" height="35" rx="1.5" fill="#fef08a" />
    <rect x="31" y="7" width="5" height="35" rx="1.5" fill="#fef08a" />
    {/* Lock Clasp */}
    <rect x="21" y="16" width="6" height="9" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
    <circle cx="24" cy="20" r="1.5" fill="#78350f" />
  </svg>
);

export const DuoShopIcon: React.FC<{ className?: string; active?: boolean }> = ({ 
  className = "w-7 h-7" 
}) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Awning Stripes */}
    <path d="M5 14L8 7H14L11 14H5Z" fill="#ef4444" />
    <path d="M11 14L14 7H20L17 14H11Z" fill="#ffffff" />
    <path d="M17 14L20 7H28L25 14H17Z" fill="#ef4444" />
    <path d="M25 14L28 7H34L31 14H25Z" fill="#ffffff" />
    <path d="M31 14L34 7H40L43 14H31Z" fill="#ef4444" />
    {/* Awning Scallops */}
    <path d="M5 14C5 17 8 18 8 18C8 18 11 17 11 14C11 17 14 18 14 18C14 18 17 17 17 14C17 17 21 18 21 18C21 18 25 17 25 14C25 17 28 18 28 18C28 18 31 17 31 14C31 17 34 18 34 18C34 18 37 17 37 14C37 17 40 18 40 18C40 18 43 17 43 14H5Z" fill="#dc2626" />
    {/* Shop Building Body */}
    <rect x="8" y="18" width="32" height="24" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
    {/* Door */}
    <rect x="18" y="24" width="12" height="18" rx="2" fill="#0284c7" />
    <rect x="20" y="26" width="8" height="7" rx="1.5" fill="#bae6fd" />
    <circle cx="21" cy="35" r="1" fill="#fef08a" />
  </svg>
);
