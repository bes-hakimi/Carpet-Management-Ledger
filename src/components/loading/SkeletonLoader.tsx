import React from 'react';
import { motion } from 'framer-motion';

// کامپوننت لودینگ اصلی
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text, 
  fullScreen = false 
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const spinner = (
    <motion.div
      className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      {spinner}
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// کامپوننت لودینگ صفحه
export const PageLoader: React.FC<{ text?: string }> = ({ text = "در حال بارگذاری..." }) => (
  <Loading size="lg" text={text} fullScreen />
);

// کامپوننت اسکلت برای شبیه‌سازی محتوا
export const SkeletonLoader: React.FC<{
  type?: 'text' | 'circle' | 'rectangle' | 'card';
  count?: number;
  className?: string;
}> = ({ type = 'text', count = 1, className = '' }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const SkeletonElement = () => {
    const baseStyles = "bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded";
    
    switch (type) {
      case 'circle':
        return <div className={`w-12 h-12 rounded-full ${baseStyles} ${className}`} />;
      case 'rectangle':
        return <div className={`w-full h-24 ${baseStyles} ${className}`} />;
      case 'card':
        return (
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
            <div className={`w-3/4 h-4 ${baseStyles} mb-3`} />
            <div className={`w-full h-3 ${baseStyles} mb-2`} />
            <div className={`w-5/6 h-3 ${baseStyles}`} />
          </div>
        );
      default: // text
        return <div className={`w-full h-4 ${baseStyles} ${className}`} />;
    }
  };

  return (
    <div className="space-y-2">
      {skeletons.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <SkeletonElement />
        </motion.div>
      ))}
    </div>
  );
};

// کامپوننت ترکیبی لودینگ و اسکلت
export const SmartLoader: React.FC<{
  isLoading: boolean;
  variant?: 'page' | 'content' | 'card' | 'table';
  skeletonType?: 'text' | 'card';
  skeletonCount?: number;
  children: React.ReactNode;
}> = ({ 
  isLoading, 
  variant = 'content', 
  skeletonType = 'text',
  skeletonCount = 3,
  children 
}) => {
  if (isLoading) {
    switch (variant) {
      case 'page':
        return <PageLoader />;
      case 'card':
        return (
          <div className="space-y-4">
            <SkeletonLoader type="card" count={skeletonCount} />
          </div>
        );
      case 'table':
        return (
          <div className="space-y-3">
            <SkeletonLoader type="text" count={skeletonCount} />
            <SkeletonLoader type="text" count={skeletonCount} />
            <SkeletonLoader type="text" count={skeletonCount} />
          </div>
        );
      default: // content
        return (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <Loading size="lg" />
            <SkeletonLoader type={skeletonType} count={skeletonCount} className="max-w-md" />
          </div>
        );
    }
  }

  return <>{children}</>;
};

export default Loading;