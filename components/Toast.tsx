import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 md:bottom-10 md:right-10 md:translate-x-0 z-[70] animate-fade-in">
      <div className="bg-gray-900/95 backdrop-blur dark:bg-white/95 text-white dark:text-gray-900 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-gray-700 dark:border-gray-200">
        <CheckCircle className="text-green-500" size={20} />
        <span className="font-medium pr-2">{message}</span>
        <button onClick={onClose} className="hover:opacity-70 border-l border-gray-700 dark:border-gray-200 pl-3">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;