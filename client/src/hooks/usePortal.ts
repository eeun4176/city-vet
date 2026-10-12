import { useContext } from 'react';
import { PortalContext } from '../lib/PortalContext';

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) throw new Error('usePortal must be used within PortalProvider');
  return context;
}
