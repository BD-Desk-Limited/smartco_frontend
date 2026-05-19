'use client';
import OfflineNotifier from '@/components/OfflineNotifier';
import { SalesPointProvider } from '@/contexts/salesPointContext';
import { NewCustomerRegistrationProvider } from '@/contexts/newCustomerRegistrationContect';
import { NotificationProvider } from '@/contexts/notificationContext';

export default function SalesPointLayout({ children }) {
  return (
    <NotificationProvider>
      <SalesPointProvider>
        <OfflineNotifier />
        <NewCustomerRegistrationProvider>
          {children}
        </NewCustomerRegistrationProvider>
      </SalesPointProvider>
    </NotificationProvider>
  );
}
