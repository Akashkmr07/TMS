import React, { useState } from 'react';
import { Bell, User, Settings, LogOut, Sun, Moon, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
  isLaptop: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isSidebarOpen, isMobile, isLaptop }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const username = user?.name || 'Guest';

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 
                    ${theme === 'dark' 
                      ? 'bg-slate-900/50 backdrop-blur-lg border-b border-slate-800' 
                      : 'bg-white/10 backdrop-blur-lg border-b border-white/10'}`}>
      {/* Menu Button for mobile and laptop */}
      {(isMobile || isLaptop) && (
        <button
          id="hamburger-menu"
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-slate-800'
              : 'text-gray-200 hover:text-white hover:bg-white/20'
          }`}
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

     
      <div className="flex-1 flex justify-center">
        <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
          Task Management
        </h1>
      </div>

    
      <div className="flex items-center space-x-2 sm:space-x-3">
    
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-gray-400 hover:text-white hover:bg-slate-800'
              : 'text-gray-200 hover:text-white hover:bg-white/20'
          }`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

       
        <button className={`p-2 rounded-lg transition-colors relative ${
          theme === 'dark'
            ? 'text-gray-400 hover:text-white hover:bg-slate-800'
            : 'text-gray-200 hover:text-white hover:bg-white/20'
        }`}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 relative">
          <div className="hidden md:block text-right">
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
              Welcome back,
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>
              {username}
            </p>
          </div>
          <button 
            onClick={toggleProfileMenu}
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full 
                       transition-colors ${
              theme === 'dark'
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}>
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {showProfileMenu && (
            <div ref={menuRef} 
                 className={`absolute right-0 top-12 sm:top-14 w-56 sm:w-64 md:w-72 rounded-xl
                            shadow-lg border transition-colors ${
                   theme === 'dark'
                     ? 'bg-slate-900 border-slate-800'
                     : 'bg-white/10 backdrop-blur-lg border-white/10'
                 }`}>
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                 ${theme === 'dark' ? 'bg-slate-800' : 'bg-white/10'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
                      {username}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-200'}`}>
                      {user?.email}
                    </p>
                  </div>
                </div>
                <hr className={theme === 'dark' ? 'border-slate-800' : 'border-white/10'} />
                <ul className="space-y-1 py-2">
                  <li>
                    <Link to="/settings" 
                          className={`flex items-center space-x-3 px-4 py-2 rounded-lg
                                    transition-colors ${
                            theme === 'dark'
                              ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                              : 'text-gray-200 hover:text-white hover:bg-white/20'
                          }`}>
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={async () => {
                        await logout();
                        navigate('/');
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg
                                transition-colors ${
                        theme === 'dark'
                          ? 'text-red-400 hover:text-red-300 hover:bg-slate-800'
                          : 'text-red-300 hover:text-red-200 hover:bg-white/20'
                      }`}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign out</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
