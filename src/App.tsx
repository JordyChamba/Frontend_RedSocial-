import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useNotificationStore } from './store/notificationStore';
import { connectWebSocket, disconnectWebSocket } from './services/websocket';
import { notificationService } from './services/notificationService';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ExplorePage from './pages/ExplorePage';
import NotificationsPage from './pages/NotificationsPage';

// Layout
import MainLayout from './components/layout/MainLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification, setUnreadCount, setIsConnected } = useNotificationStore();

  useEffect(() => {
    const initWebSocket = async () => {
      if (!isAuthenticated || !user?.id) {
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found, waiting...');
        return;
      }

      try {
        await connectWebSocket(user.id, (notification) => {
          addNotification(notification);
          toast(notification.message, {
            icon: '🔔',
          });
        });
        setIsConnected(true);

        const unreadCount = await notificationService.getUnreadCount();
        setUnreadCount(unreadCount);
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    initWebSocket();

    return () => {
      disconnectWebSocket();
      setIsConnected(false);
    };
  }, [isAuthenticated, user?.id, addNotification, setUnreadCount, setIsConnected]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Private routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile/:username" element={<ProfilePage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
