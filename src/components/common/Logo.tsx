import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Unique Lingua AI Emblem: Open Book + Speech Wave Arc + Neural Synapse Nodes */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#3B0735] via-[#4A154B] to-[#260B31] shadow-sm p-1.5`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-white"
          aria-hidden="true"
        >
          {/* Open Book Base Spine & Pages */}
          <path
            d="M5 24.5C9 23 14 23 18 25C22 23 27 23 31 24.5V13C27 11.5 22 11.5 18 13.5C14 11.5 9 11.5 5 13V24.5Z"
            stroke="#EDE9FE"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="rgba(237, 233, 254, 0.12)"
          />
          <path
            d="M18 13.5V25"
            stroke="#C4B5FD"
            strokeWidth="1.75"
            strokeLinecap="round"
          />

          {/* Speech & Neural Arc Wave radiating upwards */}
          <path
            d="M10 9C13 6.5 18 6 22 7.5"
            stroke="#38BDF8"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="0.5 3"
          />
          <path
            d="M12 6.5C15.5 4.5 21 4.5 25 6"
            stroke="#A78BFA"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Interlinked Neural Synapse Nodes */}
          <circle cx="10" cy="9" r="1.8" fill="#38BDF8" />
          <circle cx="22" cy="7.5" r="1.8" fill="#2DD4BF" />
          <circle cx="25" cy="6" r="1.8" fill="#F472B6" />
          <circle cx="18" cy="13.5" r="1.5" fill="#EDE9FE" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`${textSizes[size]} font-extrabold tracking-tight text-[#3B0735]`}>
            LINGUA
          </span>
          <span className={`${textSizes[size]} font-bold tracking-tight text-[#7C4DBA]`}>
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium tracking-normal text-[#5A456E]">
            Breaking Barriers · Building Futures
          </span>
        )}
      </div>
    </div>
  );
};
