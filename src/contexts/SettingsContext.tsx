
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ValidationErrors {
  ipWhitelist?: string;
  connectionTimeout?: string;
  queryTimeout?: string;
  maxConnections?: string;
  encryptionKey?: string;
  healthCheckInterval?: string;
}

interface SettingsContextType {
  ipWhitelist: string;
  setIpWhitelist: (value: string) => void;
  isIpRestrictionEnabled: boolean;
  setIsIpRestrictionEnabled: (value: boolean) => void;
  errors: ValidationErrors;
  validateForm: () => boolean;
  handleSave: (e: React.FormEvent) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [ipWhitelist, setIpWhitelist] = useState('127.0.0.1,::1,localhost');
  const [isIpRestrictionEnabled, setIsIpRestrictionEnabled] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { toast } = useToast();

  const validateIpWhitelist = (value: string): string | undefined => {
    if (!value.trim() && isIpRestrictionEnabled) {
      return 'La liste d\'adresses IP ne peut pas être vide';
    }
    
    // Simple IP validation regex (IPv4, IPv6, and hostnames)
    const ipEntries = value.split(',').map(ip => ip.trim());
    const invalidIps = ipEntries.filter(ip => {
      if (!ip) return true;
      // Allow localhost as a valid hostname
      if (ip === 'localhost') return false;
      
      // Simple IPv4 validation
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      // Simple IPv6 validation
      const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$/;
      
      return !(ipv4Regex.test(ip) || ipv6Regex.test(ip));
    });
    
    if (invalidIps.length > 0 && isIpRestrictionEnabled) {
      return `Adresses IP invalides: ${invalidIps.join(', ')}`;
    }
    
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate IP whitelist
    const ipWhitelistError = validateIpWhitelist(ipWhitelist);
    if (ipWhitelistError) {
      newErrors.ipWhitelist = ipWhitelistError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Paramètres enregistrés",
        description: "Vos paramètres ont été mis à jour",
      });
    }
  };

  return (
    <SettingsContext.Provider value={{
      ipWhitelist,
      setIpWhitelist,
      isIpRestrictionEnabled,
      setIsIpRestrictionEnabled,
      errors,
      validateForm,
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
