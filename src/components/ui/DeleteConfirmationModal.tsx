import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { Button, DestructiveButton, OutlineButton } from './Button'; // مسیر کامپوننت Button شما

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
  isLoading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "آیا از حذف مطمئن هستید؟",
  message = "این عمل غیرقابل بازگشت است",
  confirmText = "حذف",
  cancelText = "لغو",
  itemName,
  isLoading = false,
  type = 'danger'
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          icon: <AlertTriangle className="w-6 h-6" />,
          buttonVariant: 'warning' as const
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          icon: <AlertTriangle className="w-6 h-6" />,
          buttonVariant: 'primary' as const
        };
      default: // danger
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          icon: <AlertTriangle className="w-6 h-6" />,
          buttonVariant: 'destructive' as const
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${typeStyles.iconBg} ${typeStyles.iconColor}`}>
                    {typeStyles.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X className="w-4 h-4" />}
                  iconPosition="only"
                  onClick={onClose}
                  disabled={isLoading}
                  className="hover:bg-gray-100 text-gray-500"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed">
                  {message}
                  {itemName && (
                    <span className="block mt-2 font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                      {itemName}
                    </span>
                  )}
                </p>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 flex items-center justify-center gap-2 text-primary-600 bg-primary-50 px-4 py-3 rounded-lg"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-medium">در حال حذف...</span>
                  </motion.div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row-reverse gap-3 px-6 pb-6 bg-gray-50">
                <DestructiveButton
                  onClick={onConfirm}
                  loading={isLoading}
                  disabled={isLoading}
                  fullWidth
                  className="sm:flex-1"
                  icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                >
                  {confirmText}
                </DestructiveButton>
                
                <OutlineButton
                  onClick={onClose}
                  disabled={isLoading}
                  fullWidth
                  className="sm:flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gary-700"
                >
                  {cancelText}
                </OutlineButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;