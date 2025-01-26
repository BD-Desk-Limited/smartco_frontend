import { CompanyDataProvider } from '@/contexts/companyDataContext';
import './globals.css';
import { AuthProvider } from '@/contexts/authContext';

export const metadata = {
  title: 'SmartCo || Transforming Business Operations with Smart Solutions',
  description:
    "Streamline your sales, inventory, and management processes with BD Desk's innovative tools.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CompanyDataProvider>{children}</CompanyDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
