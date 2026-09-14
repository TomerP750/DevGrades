import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Layout from './layout/Layout'
import { ThemeProvider } from './shared/contexts/ThemeContext'
import { AuthProvider } from './features/authentication/contexts/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { accessTokenStore } from './features/authentication/contexts/accessTokenStore'
import axios from 'axios'
import { ToastContainerConfig } from './shared/utils/ToastContainer'

const queryClient = new QueryClient();

axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
    const accessToken = accessTokenStore.get();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Layout />
          <ToastContainerConfig />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </QueryClientProvider>,
)
