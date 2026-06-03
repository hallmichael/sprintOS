import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

// Context for row height synchronization
interface RowHeightSyncContextType {
  rowHeights: React.MutableRefObject<{ [key: string]: number }>;
  updateRowHeight: (rowKey: string, height: number) => void;
  getMaxRowHeight: (rowKey: string) => number;
  syncedHeights: { [key: string]: number };
  updateTrigger: number;
}

const RowHeightSyncContext = createContext<RowHeightSyncContextType | undefined>(undefined);

export const useRowHeightSync = () => {
  const context = useContext(RowHeightSyncContext);
  return context; // Return undefined if not within provider
};

export const RowHeightSyncProvider: React.FC<{
  children: React.ReactNode;
  resetKey?: string; // Optional key to reset heights when data changes
}> = ({ children, resetKey }) => {
  const rowHeights = useRef<{ [key: string]: number }>({});
  const [syncedHeights, setSyncedHeights] = useState<{ [key: string]: number }>({});
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const lastResetKey = useRef(resetKey);
  const isUpdatingRef = useRef(false);

  // Reset heights when resetKey changes (e.g., when data changes)
  useEffect(() => {
    if (resetKey !== lastResetKey.current) {
      rowHeights.current = {};
      setSyncedHeights({});
      setUpdateTrigger(prev => prev + 1);
      lastResetKey.current = resetKey;
    }
  }, [resetKey]);

  const updateRowHeight = useCallback((rowKey: string, height: number) => {
    const currentHeight = rowHeights.current[rowKey];

    if (currentHeight !== height && height > 0) {
      // Always take the maximum height for this row
      const newHeight = Math.max(currentHeight || 0, height);
      rowHeights.current[rowKey] = newHeight;

      // Immediate update for more reliable synchronization
      if (!isUpdatingRef.current) {
        isUpdatingRef.current = true;

        // Use multiple RAF calls to ensure all sections have time to measure
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setSyncedHeights({ ...rowHeights.current });
            setUpdateTrigger(prev => prev + 1);
            isUpdatingRef.current = false;
          });
        });
      }
    }
  }, []);

  const getMaxRowHeight = useCallback((rowKey: string) => {
    return rowHeights.current[rowKey] || 0;
  }, []);

  // Force synchronization on mount and when updateTrigger changes
  useEffect(() => {
    const syncTimeout = setTimeout(() => {
      const currentState = { ...rowHeights.current };
      setSyncedHeights(currentState);
    }, 100);

    return () => clearTimeout(syncTimeout);
  }, [updateTrigger]);

  // Additional sync after a longer delay to catch slow-rendering HTML content
  useEffect(() => {
    const delayedSync = setTimeout(() => {
      const currentState = { ...rowHeights.current };
      setSyncedHeights(currentState);
    }, 500); // 500ms delay for complex HTML content to render

    return () => clearTimeout(delayedSync);
  }, [resetKey]);

  const value = {
    rowHeights,
    updateRowHeight,
    getMaxRowHeight,
    syncedHeights,
    updateTrigger,
  };

  return <RowHeightSyncContext.Provider value={value}>{children}</RowHeightSyncContext.Provider>;
};
