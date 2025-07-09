import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from '../context/ThemeContext';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLaptop, setIsLaptop] = useState(768 <= window.innerWidth && window.innerWidth < 1280);
  const { theme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      const laptop = 768 <= width && width < 1280;
      
      setIsMobile(mobile);
      setIsLaptop(laptop);

      // Auto-open sidebar on larger screens and default to closed on laptop
      if (width >= 1280 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      } else if (laptop && isSidebarOpen && width < 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.getElementById('hamburger-menu');
        if (sidebar && hamburger && 
            !sidebar.contains(event.target as Node) && 
            !hamburger.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen ${theme}`}>
      <Navbar 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        isLaptop={isLaptop}
      />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`flex-1 transition-all duration-200 overflow-auto
          ${theme === 'dark' ? 'bg-theme-dark-bg text-theme-dark-text' : 'bg-gradient-purple text-theme-light-text'}
          ${isSidebarOpen && !isMobile ? 'ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
