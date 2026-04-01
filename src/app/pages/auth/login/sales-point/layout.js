'use client';

import OfflineNotifier from '@/components/OfflineNotifier';

export default function SalesPointAuthLayout({ children }) {
  return (
    <>
      <OfflineNotifier />
      {children}
    </>
  );
}
