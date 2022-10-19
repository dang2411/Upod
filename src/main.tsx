import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/JWTContext';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
// redux
import { store, persistor } from './redux/store';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
              <SettingsProvider>
                <CollapseDrawerProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </CollapseDrawerProvider>
              </SettingsProvider>
          </PersistGate>
        </ReduxProvider>
      </HelmetProvider>
    </AuthProvider>
  </React.StrictMode>
);

console.log('index.tsx');