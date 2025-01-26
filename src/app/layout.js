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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <CompanyDataProvider>{children}</CompanyDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
