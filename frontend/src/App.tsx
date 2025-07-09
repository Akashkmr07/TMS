// src/App.tsx
import type { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './AppRoutes';

const App: FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
            </div>
          </ThemeProvider>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
