"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Database, Inbox, FolderOpen } from 'lucide-react';

export type EmptyStateVariant = 'default' | 'search' | 'data' | 'file' | 'message';

interface EmptyStateProps {
  title?: string;
  description?: string;
  variant?: EmptyStateVariant;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "دیتایی یافت نشد",
  description = "اطلاعاتی برای نمایش وجود ندارد.",
  variant = 'default',
  action,
  className = ''
}) => {
  const variants = {
    default: {
      icon: <Database className="w-16 h-16" />,
      gradient: "from-primary-500 to-primary-500",
      bgGradient: "from-primary-50 to-primary-50"
    },
    search: {
      icon: <FileSearch className="w-16 h-16" />,
      gradient: "from-primary-500 to-primary-500",
      bgGradient: "from-pink-100 to-primary-100"
    },
    data: {
      icon: <Database className="w-16 h-16" />,
      gradient: "from-primary-500 to-primary-500",
      bgGradient: "from-pink-100 to-primary-100"
    },
    file: {
      icon: <FolderOpen className="w-16 h-16" />,
      gradient: "from-primary-500 to-primary-500",
      bgGradient: "from-pink-100 to-primary-100"
    },
    message: {
      icon: <Inbox className="w-16 h-16" />,
      gradient: "from-primary-500 to-primary-500",
      bgGradient: "from-pink-100 to-primary-100"
    }
  };

  const { icon, gradient, bgGradient } = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {/* آیکون متحرک */}
      <motion.div
        className={`p-6 rounded-2xl bg-gradient-to-br ${bgGradient} mb-6`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div
          className={`text-white p-4 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}
          animate={{ 
            scale: [1, 1.02, 1],
            rotate: [0, 2, 0, -2, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {icon}
        </motion.div>
      </motion.div>

      {/* متن */}
      <div className="space-y-3 max-w-md">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-xl font-bold text-gray-900"
        >
          {title}
        </motion.h3>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-sm md:text-base leading-relaxed"
        >
          {description}
        </motion.p>
      </div>

      {/* دکمه اقدام */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          {action}
        </motion.div>
      )}

      {/* افکت دکوراتیو */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40 bg-primary-200 rounded-full opacity-20 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-200 rounded-full opacity-20 blur-xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </motion.div>
  );
};

// کامپوننت‌های آماده برای استفاده سریع
export const EmptyData: React.FC<{ 
  title?: string; 
  description?: string;
  action?: React.ReactNode;
}> = (props) => <EmptyState variant="data" {...props} />;

export const EmptySearch: React.FC<{ 
  title?: string; 
  description?: string;
  action?: React.ReactNode;
}> = (props) => (
  <EmptyState 
    variant="search" 
    title="نتیجه‌ای یافت نشد"
    description="لطفاً عبارت جستجوی خود را تغییر دهید."
    {...props} 
  />
);

export const EmptyFiles: React.FC<{ 
  title?: string; 
  description?: string;
  action?: React.ReactNode;
}> = (props) => (
  <EmptyState 
    variant="file" 
    title="فایلی وجود ندارد"
    description="هنوز هیچ فایلی آپلود نکرده‌اید."
    {...props} 
  />
);

export const EmptyMessages: React.FC<{ 
  title?: string; 
  description?: string;
  action?: React.ReactNode;
}> = (props) => (
  <EmptyState 
    variant="message" 
    title="پیامی وجود ندارد"
    description="هیچ پیامی برای نمایش وجود ندارد."
    {...props} 
  />
);

export default EmptyState;
