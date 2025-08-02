import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

import { createPortal } from 'react-dom';

import Toast from '@/components/common/Toast';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  const contextValue = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {createPortal(
        <div className="fixed bottom-[10rem] left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 space-y-[1.2rem] px-[2.5rem]">
          {toasts.map(toast => (
            <Toast key={toast.id} type={toast.type} message={toast.message} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
