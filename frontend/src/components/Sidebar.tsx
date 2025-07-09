import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart2, 
  Archive, 
  Settings,
  Menu
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile }) => {
  const location = useLocation();
  const { theme } = useTheme();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'All Tasks' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/archive', icon: Archive, label: 'Archive' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ].map(item => ({
    ...item,
    isActive: location.pathname === item.path
  }));

  const sidebarClasses = `
    fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out z-30
    ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white/10 backdrop-blur-lg text-theme-light-text'}
    ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
    ${theme === 'dark' ? 'border-r border-slate-800' : 'border-r border-white/10'}
  `;

  return (
    <aside id="sidebar" className={sidebarClasses}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <CheckSquare className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-500' : 'text-white'}`} />
            <span className="font-bold text-xl">TMS</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors
                      ${item.isActive 
                        ? theme === 'dark'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/20 text-white'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-slate-800'
                          : 'text-gray-200 hover:text-white hover:bg-white/20'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
