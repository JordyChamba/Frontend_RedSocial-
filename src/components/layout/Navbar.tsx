import { Link } from 'react-router-dom';
import { FiHome, FiCompass, FiBell, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">SocialHub</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FiHome size={20} />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              to="/explore"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FiCompass size={20} />
              <span className="font-medium">Explore</span>
            </Link>

            <Link
              to="/notifications"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors relative"
            >
              <FiBell size={20} />
              <span className="font-medium">Notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>

            <Link
              to={`/profile/${user?.username}`}
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FiUser size={20} />
              <span className="font-medium">Profile</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName || user?.username}</p>
              <p className="text-xs text-gray-500">@{user?.username}</p>
            </div>

            <div className="flex items-center gap-2">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.username}
                  className="h-10 w-10 rounded-full object-cover border-2 border-primary-200"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-200">
                  <span className="text-primary-600 font-bold text-lg">
                    {user?.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Link to="/" className="p-3 text-gray-600 hover:text-primary-600">
            <FiHome size={24} />
          </Link>
          <Link to="/explore" className="p-3 text-gray-600 hover:text-primary-600">
            <FiCompass size={24} />
          </Link>
          <Link to="/notifications" className="p-3 text-gray-600 hover:text-primary-600 relative">
            <FiBell size={24} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
          <Link to={`/profile/${user?.username}`} className="p-3 text-gray-600 hover:text-primary-600">
            <FiUser size={24} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
