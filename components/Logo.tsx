import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', theme = 'dark' }) => {
  const heights = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-20',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.png"
        alt="NC Technology Solutions LLC"
        className={`${heights[size]} w-auto object-contain`}
        style={theme === 'dark' ? { filter: 'invert(1) hue-rotate(180deg) brightness(1.2)' } : undefined}
      />
    </div>
  );
};

export default Logo;
