import React, { useState } from 'react';
import { Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';
import '../index.css';


interface FormData {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

   
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
  
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
  
    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        if (isLogin) {
          // First update the auth context
          await login(formData.email, formData.password);
          // Then navigate after context is updated
          navigate('/dashboard', { replace: true });
        } else {
          await authService.register({
            name: formData.name || 'User',
            email: formData.email,
            password: formData.password
          });
          
          setIsLogin(true);
          resetForm();
          setErrors({ general: 'Registration successful! Please login.' });
        }
      } catch (error: any) {
        const message = error.response?.data?.message || 'An error occurred. Please try again.';
        setErrors({ general: message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const toggleMode = (loginMode: boolean) => {
    if (loginMode !== isLogin) {
      setIsLogin(loginMode);
      setErrors({}); 
    }
  };

  const LoginForm = () => {
    return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="transform transition-all duration-200 hover:scale-[1.01]">
        <label className="block text-white text-sm font-semibold mb-2 tracking-wide">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className={`w-full px-5 py-4 bg-black/20 border rounded-2xl text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-200 
                   ${errors.email ? 'border-red-500' : 'border-white/5'}`}
        />
        {errors.email && (
          <p className="mt-2 text-red-400 text-sm flex items-center">
            <span className="mr-1">●</span> {errors.email}
          </p>
        )}
      </div>

    
      <div className="transform transition-all duration-200 hover:scale-[1.01]">
        <label className="block text-white text-sm font-semibold mb-2 tracking-wide">
          Password
        </label>
        <div className="relative group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className={`w-full px-5 py-4 bg-black/20 border rounded-2xl text-white placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-200 pr-12
                     group-hover:border-white/10 ${errors.password ? 'border-red-500' : 'border-white/5'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 
                     hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-red-400 text-sm flex items-center">
            <span className="mr-1">●</span> {errors.password}
          </p>
        )}
      </div>

     
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 rounded-2xl font-semibold
                 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 
                 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center space-x-2
                 backdrop-blur-sm text-base"
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        <span>{isLoading ? 'Processing...' : 'Login'}</span>
      </button>


      {errors.general && (
        <div className="text-center">
          <p className="text-red-400 text-sm">{errors.general}</p>
        </div>
      )}

      
      <div className="text-center mt-6">
        <a
          href="#"
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors hover:underline decoration-2 underline-offset-4"
        >
          Forgot your password?
        </a>
      </div>
    </form>
    );
  };

  const RegisterForm = () => {
    return (
    <form onSubmit={handleSubmit} className="space-y-6">
     
      <div className="transform transition-all duration-200 hover:scale-[1.01]">
        <label className="block text-white text-sm font-semibold mb-2 tracking-wide">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          placeholder="Enter your name"
          className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 
                   ${errors.name ? 'border-red-500' : 'border-slate-600/50'}`}
        />
        {errors.name && (
          <p className="mt-2 text-red-400 text-sm flex items-center">
            <span className="mr-1">●</span> {errors.name}
          </p>
        )}
      </div>

     
      <div className="transform transition-all duration-200 hover:scale-[1.01]">
        <label className="block text-white text-sm font-semibold mb-2 tracking-wide">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 
                   ${errors.email ? 'border-red-500' : 'border-slate-600/50'}`}
        />
        {errors.email && (
          <p className="mt-2 text-red-400 text-sm flex items-center">
            <span className="mr-1">●</span> {errors.email}
          </p>
        )}
      </div>

    
      <div className="transform transition-all duration-200 hover:scale-[1.01]">
        <label className="block text-white text-sm font-semibold mb-2 tracking-wide">
          Password
        </label>
        <div className="relative group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
            className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 pr-12
                     group-hover:border-slate-500 ${errors.password ? 'border-red-500' : 'border-slate-600/50'}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 
                     hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 text-red-400 text-sm flex items-center">
            <span className="mr-1">●</span> {errors.password}
          </p>
        )}
      </div>

     
      <div className="transform transition-all duration-200 hover:scale-[1.01]">
        <label className="block text-white text-sm font-semibold mb-2 tracking-wide">
          Confirm Password
        </label>
        <div className="relative group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className={`w-full px-4 py-3 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-400 
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200 pr-12
                     group-hover:border-slate-500 ${errors.confirmPassword ? 'border-red-500' : 'border-slate-600/50'}`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 
                     hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/50"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-2 text-red-400 text-sm flex items-center">
            <span className="mr-1">●</span> {errors.confirmPassword}
          </p>
        )}
      </div>

    
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 px-4 rounded-xl 
                 font-semibold hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 
                 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all 
                 duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 
                 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center
                 space-x-2 text-sm backdrop-blur-sm"
      >
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        <span>{isLoading ? 'Processing...' : 'Create Account'}</span>
      </button>

      
      {errors.general && (
        <div className="text-center">
          <p className="text-green-400 text-sm">{errors.general}</p>
        </div>
      )}
    </form>
    );
  };

  return (
    <div className="min-h-screen h-full w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 
                  flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white/[0.02] backdrop-blur-lg border border-white/[0.05] rounded-3xl p-5 sm:p-6 md:p-8 
                      shadow-2xl shadow-black/10 animate-fade-in">
        
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 
                          bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mb-6 
                          transform transition-transform duration-300 hover:scale-110 hover:rotate-3 
                          shadow-xl shadow-blue-500/20">
              <Check className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Task Management System
            </h1>
            <p className="text-gray-400 text-base">
              Organize your tasks with hierarchical dependencies
            </p>
          </div>

         
          <div className="flex bg-black/20 rounded-2xl p-1.5 mb-8 sm:mb-10 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => toggleMode(true)}
              className={`flex-1 py-3 px-5 rounded-xl text-base font-medium transition-all duration-300 
                       ${isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => toggleMode(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-300 
                       ${!isLogin
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/30'
                }`}
            >
              Register
            </button>
          </div>

          
          <div key={isLogin ? 'login-form' : 'register-form'} className="transition-all duration-300 transform">
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
