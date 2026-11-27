'use client';

import { BulkMaterialUploadProvider } from '@/contexts/bulkMaterialUploadContext';
import { BulkbranchUploadProvider } from '@/contexts/bulkBranchUploadContext';
import { BulkUserUploadProvider } from '@/contexts/bulkUserUploadContext';
import { CreateProductsProvider } from '@/contexts/createProductsContext';
import AdminShell from '@/components/account/admin/shell/AdminShell';

// Every admin page renders inside AdminShell (sidebar on md+, bottom bar on phones).
// Pages that must stay full-screen are listed in AdminShell's EXCLUDED rules.
export default function AdminLayout({ children }) {
  return (
    <BulkUserUploadProvider>
      <BulkMaterialUploadProvider>
        <BulkbranchUploadProvider>
          <CreateProductsProvider>
            <AdminShell>{children}</AdminShell>
          </CreateProductsProvider>
        </BulkbranchUploadProvider>
      </BulkMaterialUploadProvider>
    </BulkUserUploadProvider>
  );
}
