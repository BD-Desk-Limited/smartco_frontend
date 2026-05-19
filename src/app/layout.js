import { CompanyDataProvider } from '@/contexts/companyDataContext';
import './globals.css';
import { AuthProvider } from '@/contexts/authContext';
import { InternetStatusProvider } from '@/contexts/internetStatusContext';
import { SetupProvider } from '@/contexts/setupContext';
import TransactionSyncInitializer from '@/components/TransactionSyncInitializer';
import { ThemeProvider } from '@/contexts/themeContext';
import { AccountThemeProvider } from '@/contexts/accountThemeContext';

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
      <head>
        <meta name="theme-color" content="#003399" />
      </head>

      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <AccountThemeProvider>
              <InternetStatusProvider>
                <SetupProvider>
                  <CompanyDataProvider>{children}</CompanyDataProvider>
                </SetupProvider>
              </InternetStatusProvider>
            </AccountThemeProvider>
          </AuthProvider>
        </ThemeProvider>
        <TransactionSyncInitializer />

        {/* Service Worker Registration for Offline Support */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js');
            });
          }`,
          }}
        />
      </body>
    </html>
  );
}
