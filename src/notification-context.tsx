import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

interface NotificationContextType {
  showNotification: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const showNotification = useCallback(
    (message2: string, severity2: 'success' | 'info' | 'warning' | 'error' = 'info') => {
      setMessage(message2);
      setSeverity(severity2);
      setOpen(true);
    },
    [],
  );

  const handleClose = () => {
    setOpen(false);
  };

  // 使用 useMemo 缓存 value 对象
  const value = useMemo(() => ({ showNotification }), [showNotification]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}
