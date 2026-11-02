import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react';

type Toast = {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
};

type ToastContextValue = {
  toast: (message: string, type?: Toast['type']) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 3200);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 rounded-xl glass border border-ink-200/60 px-4 py-3 shadow-xl shadow-ink-900/10 animate-fade-in-up min-w-[280px] max-w-sm"
          >
            {t.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" />}
            {t.type === 'info' && <Info className="h-5 w-5 shrink-0 text-ink-500" />}
            {t.type === 'error' && <AlertTriangle className="h-5 w-5 shrink-0 text-error-600" />}
            <span className="text-sm text-ink-800 flex-1 font-medium">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="text-ink-400 hover:text-ink-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
