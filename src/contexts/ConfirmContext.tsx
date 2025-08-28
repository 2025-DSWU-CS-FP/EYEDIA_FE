import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

interface ConfirmContextType {
  showConfirm: (message: string) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmProvider');
  }
  return context;
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [resolveFn, setResolveFn] = useState<(value: boolean) => void>(
    () => () => {},
  );

  const showConfirm = (msg: string): Promise<boolean> => {
    setMessage(msg);
    setIsOpen(true);
    return new Promise(resolve => {
      setResolveFn(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolveFn(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveFn(false);
  };

  const contextValue = useMemo(() => ({ showConfirm }), []);

  return (
    <ConfirmContext.Provider value={contextValue}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="inline-flex flex-col items-center gap-[3rem] rounded-[1.6rem] bg-white px-[2rem] py-[3rem]">
            <div className="text-gray-black text-center font-semibold t3">
              {message}
            </div>
            <div className="inline-flex w-[27.5rem] gap-[0.8rem]">
              <button
                type="button"
                onClick={handleCancel}
                className="h-[4.8rem] flex-1 rounded-[0.8rem] border border-gray-30 bg-white font-medium text-gray-80 bd2"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="h-[4.8rem] flex-1 rounded-[0.8rem] bg-brand-blue font-medium text-white bd2"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
