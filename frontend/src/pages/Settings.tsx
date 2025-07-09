import type { FC } from 'react';
import { Settings as SettingsIcon, User, Palette, Bell, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 w-full`}>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-2">
          <SettingsIcon className={`w-8 h-8 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} />
          <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
        </div>
        <p className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
          Manage your preferences and account settings
        </p>
      </div>

      <div className="grid gap-6">
        <div className={`p-6 rounded-xl border ${
          isDark 
            ? 'bg-slate-900/50 border-slate-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <User className={`w-5 h-5 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Profile Settings
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>Display Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className={`w-full h-10 px-3 rounded-lg border focus:outline-none focus:border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`w-full h-10 px-3 rounded-lg border focus:outline-none focus:border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>Bio</label>
              <textarea
                placeholder="Write a short bio..."
                rows={3}
                className={`w-full p-3 rounded-lg border focus:outline-none focus:border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </div>
        </div>

   
        <div className={`p-6 rounded-xl border ${
          isDark 
            ? 'bg-slate-900/50 border-slate-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <Palette className={`w-5 h-5 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Theme Settings
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>Theme Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button className={`p-4 rounded-lg border transition-colors ${
                  !isDark 
                    ? 'bg-white border-blue-500' 
                    : 'bg-slate-800 border-slate-700 hover:border-blue-500'
                }`}>
                  <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Light</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Use light theme</p>
                </button>
                <button className={`p-4 rounded-lg border transition-colors ${
                  isDark 
                    ? 'bg-slate-800 border-blue-500' 
                    : 'bg-white border-gray-300 hover:border-blue-500'
                }`}>
                  <p className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Dark</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Use dark theme</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        
    

        {/* Security Settings Card */}
        <div className={`p-6 rounded-xl border ${
          isDark 
            ? 'bg-slate-900/50 border-slate-800' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center space-x-3 mb-6">
            <Shield className={`w-5 h-5 ${isDark ? 'text-gray-200' : 'text-gray-900'}`} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Security Settings
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className={`w-full h-10 px-3 rounded-lg border focus:outline-none focus:border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className={`w-full h-10 px-3 rounded-lg border focus:outline-none focus:border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className={`w-full h-10 px-3 rounded-lg border focus:outline-none focus:border-blue-500 ${
                  isDark 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           transition-colors mt-2">
              Update Password
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
