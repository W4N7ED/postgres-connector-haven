
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  ipWhitelist: string;
  setIpWhitelist: (value: string) => void;
  isIpRestrictionEnabled: boolean;
  setIsIpRestrictionEnabled: (value: boolean) => void;
  handleSave: (e: React.FormEvent) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [ipWhitelist, setIpWhitelist] = useState('127.0.0.1,::1,localhost');
  const [isIpRestrictionEnabled, setIsIpRestrictionEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be implemented in the main Settings component
  };

  return (
    <SettingsContext.Provider value={{
      ipWhitelist,
      setIpWhitelist,
      isIpRestrictionEnabled,
      setIsIpRestrictionEnabled,
      handleSave
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
