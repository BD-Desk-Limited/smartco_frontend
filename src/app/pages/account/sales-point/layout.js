'use client';
import OfflineNotifier from '@/components/OfflineNotifier';
import { SalesPointProvider } from '@/contexts/salesPointContext';

export default function SalesPointLayout({ children }) {
  return (
    <SalesPointProvider>
      <OfflineNotifier />
      {children}
    </SalesPointProvider>
  );
}
