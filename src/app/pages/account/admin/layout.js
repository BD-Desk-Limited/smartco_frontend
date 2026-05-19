'use client';

import { BulkMaterialUploadProvider } from '@/contexts/bulkMaterialUploadContext';
import { BulkbranchUploadProvider } from '@/contexts/bulkBranchUploadContext';
import { BulkUserUploadProvider } from '@/contexts/bulkUserUploadContext';
import { CreateProductsProvider } from '@/contexts/createProductsContext';

export default function AdminLayout({ children }) {
  return (
    <BulkUserUploadProvider>
      <BulkMaterialUploadProvider>
        <BulkbranchUploadProvider>
          <CreateProductsProvider>{children}</CreateProductsProvider>
        </BulkbranchUploadProvider>
      </BulkMaterialUploadProvider>
    </BulkUserUploadProvider>
  );
}
