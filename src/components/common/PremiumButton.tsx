import React from 'react';
import { createButtonHandlers } from '../../utils/animations';

interface PremiumButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  colorTheme?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'quiz-option';
}

const PremiumButton: React.FC<PremiumButtonProps> = ({
  onClick,
  children,
  className = '',
  disabled = false,
  colorTheme = 'from-magical-shimmer to-magical-glow',
  size = 'md',
  variant = 'primary'
}) => {
  const buttonHandlers = createButtonHandlers();
  
  const sizeClasses = {
    sm: 'px-6 py-3 text-base',
    md: 'px-10 py-4 text-lg',
    lg: 'px-16 py-6 text-xl'
  };

  const variantClasses = {
    primary: 'premium-button font-medium',
    secondary: 'magical-card border border-premium-gold/20 text-premium-gold hover:bg-premium-gold/10',
    'quiz-option': `w-full p-6 rounded-xl bg-gradient-to-r ${colorTheme} text-white font-medium text-xl 
                   hover:scale-105 hover:shadow-2xl active:animate-button-press active:shadow-inner
                   transform-gpu will-change-transform animate-slide-up`
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        transition-all duration-300
        disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50
        ${className}
      `}
      {...(variant === 'quiz-option' ? buttonHandlers : {})}
    >
      {variant === 'quiz-option' ? (
        <>
          <span className="relative z-10 drop-shadow-sm">{children}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-1000 ease-out opacity-0 hover:opacity-100"></div>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default PremiumButton;