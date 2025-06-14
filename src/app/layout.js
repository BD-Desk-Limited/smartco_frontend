import { CompanyDataProvider } from '@/contexts/companyDataContext';
import './globals.css';
import { AuthProvider } from '@/contexts/authContext';
import { BulkMaterialUploadProvider } from '@/contexts/bulkMaterialUploadContext';
import { BulkbranchUploadProvider } from '@/contexts/bulkBranchUploadContext';
import BulkUserUpload from '@/components/account/admin/users-management/components/create-bulk-user/BulkUserUpload';
import { BulkUserUploadProvider } from '@/contexts/bulkUserUploadContext';

const APP_NAME = 'SmartCo.';
const APP_DEFAULT_TITLE =
  'SmartCo || Transforming Business Operations with Smart Solutions';
const APP_TITLE_TEMPLATE = `%s | ${APP_NAME}`;
const APP_DESCRIPTION =
  "Streamline your sales, inventory, and management processes with BD Desk's innovative tools.";

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <BulkUserUploadProvider>
            <BulkMaterialUploadProvider>
              <BulkbranchUploadProvider>
                <CompanyDataProvider>
                  {children}
                </CompanyDataProvider>
              </BulkbranchUploadProvider>
            </BulkMaterialUploadProvider>
          </BulkUserUploadProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
