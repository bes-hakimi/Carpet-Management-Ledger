import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Orbit } from 'lucide-react';

export type LoadingVariant = 'spin' | 'pulse' | 'bounce' | 'wave' | 'orbit' | 'neon';

interface LoadingProps {
  variant?: LoadingVariant;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spin',
  size = 'md',
  text,
  className = ''
}) => {
  const sizes = {
    sm: { 
      container: 'w-6 h-6', 
      text: 'text-xs',
    },
    md: { 
      container: 'w-12 h-12', 
      text: 'text-sm',
    },
    lg: { 
      container: 'w-16 h-16', 
      text: 'text-lg',
    }
  };

  // اسپینر کلاسیک
  const SpinLoader = () => (
    <motion.div
      className={`${sizes[size].container} border-4 border-teal-200 border-t-teal-500 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );

  // پالس نرم
  const PulseLoader = () => (
    <motion.div
      className={`${sizes[size].container} bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full`}
      animate={{
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );

  // بانس جذاب - با ارتفاع ثابت
  const BounceLoader = () => (
    <div className={`${sizes[size].container} flex items-center justify-center gap-1`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-teal-500 rounded-full"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // موج روان - با ارتفاع ثابت
  const WaveLoader = () => (
    <div className={`${sizes[size].container} flex items-center justify-center gap-1`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-teal-500 to-cyan-500 rounded-full"
          style={{ 
            height: size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px' 
          }}
          animate={{
            height: [
              size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px',
              size === 'sm' ? '6px' : size === 'md' ? '8px' : '10px',
              size === 'sm' ? '12px' : size === 'md' ? '16px' : '20px'
            ]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // مدار چرخان
  const OrbitLoader = () => (
    <div className={`relative ${sizes[size].container}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Orbit className="w-full h-full text-teal-400" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <div className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'} bg-cyan-500 rounded-full`} />
      </motion.div>
    </div>
  );

  // افکت نئون
  const NeonLoader = () => (
    <div className={`relative ${sizes[size].container}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-cyan-300" />
    </div>
  );

  const loaders = {
    spin: SpinLoader,
    pulse: PulseLoader,
    bounce: BounceLoader,
    wave: WaveLoader,
    orbit: OrbitLoader,
    neon: NeonLoader
  };

  const LoaderComponent = loaders[variant];

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <LoaderComponent />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-gray-600 font-medium ${sizes[size].text} mt-1`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// کامپوننت‌های آماده برای استفاده سریع
export const ContentLoader: React.FC<{ text?: string; variant?: LoadingVariant }> = ({ 
  text = "در حال دریافت اطلاعات...", 
  variant = 'orbit' 
}) => (
  <div className="flex justify-center items-center py-8">
    <Loading variant={variant} size="md" text={text} />
  </div>
);

export const ButtonLoader: React.FC<{ variant?: LoadingVariant }> = ({ variant = 'spin' }) => (
  <Loading variant={variant} size="sm" />
);

export const CardLoader: React.FC<{ variant?: LoadingVariant }> = ({ variant = 'wave' }) => (
  <div className="flex justify-center py-3">
    <Loading variant={variant} size="md" text="در حال بارگذاری داده ها..." />
  </div>
);

export default Loading;