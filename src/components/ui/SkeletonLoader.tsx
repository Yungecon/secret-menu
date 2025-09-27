import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'button';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width = '100%',
  height,
  className = '',
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-premium-silver/10 via-premium-silver/20 to-premium-silver/10 bg-[length:200%_100%] animate-shimmer';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-lg';
      case 'button':
        return 'rounded-xl';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const getDefaultHeight = () => {
    if (height) return height;
    switch (variant) {
      case 'circular':
        return width;
      case 'button':
        return '48px';
      case 'text':
      default:
        return '1rem';
    }
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              width: index === lines - 1 ? '75%' : width,
              height: getDefaultHeight()
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={{
        width,
        height: getDefaultHeight()
      }}
    />
  );
};

// Preset skeleton components for common use cases
export const QuizSkeleton: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Progress indicator skeleton */}
      <div className="flex justify-center space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonLoader key={i} variant="circular" width="16px" height="16px" />
        ))}
      </div>
      
      {/* Question skeleton */}
      <SkeletonLoader variant="text" lines={2} className="max-w-lg mx-auto" />
      
      {/* Answer options skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <SkeletonLoader key={i} variant="button" height="72px" />
        ))}
      </div>
    </div>
  </div>
);

export const ResultsSkeleton: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Title skeleton */}
      <div className="space-y-4">
        <SkeletonLoader variant="text" width="60%" className="mx-auto" />
        <SkeletonLoader variant="text" width="80%" height="3rem" className="mx-auto" />
      </div>
      
      {/* Cocktail card skeleton */}
      <div className="magical-card p-8 space-y-6">
        <SkeletonLoader variant="text" lines={3} />
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonLoader key={i} variant="rectangular" height="40px" />
          ))}
        </div>
      </div>
      
      {/* Adjacent recommendations skeleton */}
      <div className="space-y-4">
        <SkeletonLoader variant="text" width="40%" className="mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLoader key={i} variant="rectangular" height="80px" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;