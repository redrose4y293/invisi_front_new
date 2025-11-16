import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { setupI18n, isRTL } from './i18n';
import { router } from './routes';
import '../index.css';

const i18n = setupI18n();

export default function App() {
  useEffect(() => {
    const updateDir = () => {
      const lng = i18n.language || 'en';
      document.documentElement.dir = isRTL(lng) ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    };
    updateDir();
    i18n.on('languageChanged', updateDir);
    return () => { i18n.off('languageChanged', updateDir); };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>
  );
}
