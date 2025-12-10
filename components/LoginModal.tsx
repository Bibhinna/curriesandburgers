import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { User } from '../types';
import { authService } from '../services/authService';

interface LoginModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

// 🔴 CONFIGURATION: Your Google Client ID
const GOOGLE_CLIENT_ID = "528830050485-i74ia6vpd1an3ib24p310ubudsjk2tn0.apps.googleusercontent.com";

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Get current origin for debugging 400 errors
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  
  const isGoogleConfigured = GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes("YOUR_CLIENT_ID_HERE");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Initialize REAL Google Auth
  useEffect(() => {
    if (!isGoogleConfigured) return;

    const initializeGoogle = () => {
      // Check if Google script is loaded and div is present
      if (window.google && window.google.accounts && document.getElementById("googleButtonDiv")) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID.trim(),
            callback: handleGoogleCallback,
            auto_select: false,
            cancel_on_tap_outside: false,
            context: isLogin ? 'signin' : 'signup'
          });
          
          window.google.accounts.id.renderButton(
            document.getElementById("googleButtonDiv"),
            { 
              theme: "outline", 
              size: "large",
              width: "100%", 
              text: isLogin ? "signin_with" : "signup_with",
              shape: "pill",
              logo_alignment: "left"
            }
          );
        } catch (e) {
          console.error("Google Auth Init Error:", e);
        }
      } else {
        // Retry shortly if script not ready
        setTimeout(initializeGoogle, 300);
      }
    };

    initializeGoogle();
  }, [isLogin, isGoogleConfigured]);

  const handleGoogleCallback = async (response: any) => {
    setIsLoading(true);
    setError('');
    try {
        const result = await authService.googleLogin(response.credential);
        if (result.success && result.user) {
            onLogin(result.user);
            onClose();
        } else {
            setError(result.message || 'Google verification failed.');
        }
    } catch (err) {
        console.error(err);
        setError('An error occurred during Google Sign-In.');
    } finally {
        setIsLoading(false);
    }
  };

  const handleTwitterLogin = async () => {
    setError('Twitter/X Login requires backend configuration.');
  };

  const validate = () => {
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
        setError('Please enter a valid email address.');
        return false;
    }
    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return false;
    }
    if (!isLogin && !formData.name.trim()) {
        setError('Please enter your full name.');
        return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validate()) return;

    setIsLoading(true);

    try {
        if (isLogin) {
            const result = await authService.login(formData.email, formData.password);
            
            if (result.success && result.user) {
                onLogin(result.user);
                onClose();
            } else {
                setError(result.message || 'Login failed');
            }
        } else {
            const result = await authService.signup(formData.name, formData.email, formData.password);
            
            if (result.success && result.user) {
                setSuccessMsg('Account created successfully! Logging you in...');
                setTimeout(() => {
                    if (result.user) {
                        authService.setSession(result.user);
                        onLogin(result.user);
                        onClose();
                    }
                }, 1000);
            } else {
                setError(result.message || 'Signup failed');
            }
        }
    } catch (err) {
        setError('An unexpected error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh] overflow-y-auto">
        
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10"
        >
            <X size={20} className="text-gray-600 dark:text-gray-300"/>
        </button>

        <div className="p-8 pb-6">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                    {isLogin ? 'Enter your details to sign in' : 'Join us for exclusive offers and rewards'}
                </p>
            </div>

            {/* Social Logins */}
            <div className="space-y-3 mb-6">
                 {/* Google Button Container */}
                 {isGoogleConfigured ? (
                    <div className="w-full min-h-[44px] flex flex-col justify-center items-center gap-2">
                        <div id="googleButtonDiv" className="w-full min-h-[40px]"></div>
                        
                        {/* Setup Hint for 400 Error */}
                        <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-2 text-[10px] text-blue-700 dark:text-blue-300 flex items-start gap-2">
                            <Info size={14} className="mt-0.5 shrink-0" />
                            <div>
                                <strong>Setup Tip:</strong> If you see "Error 400: origin_mismatch", allow this URL in Google Cloud Console:<br/>
                                <code className="block mt-1 bg-white dark:bg-black/20 p-1 rounded select-all break-all cursor-text font-mono">
                                    {currentOrigin}
                                </code>
                            </div>
                        </div>
                    </div>
                 ) : (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-xs text-center">
                        <strong>Configuration Required:</strong><br/>
                        Update <code>GOOGLE_CLIENT_ID</code> in <code>LoginModal.tsx</code>.
                    </div>
                 )}

                 {/* X / Twitter */}
                 <button 
                    onClick={handleTwitterLogin}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium text-sm group"
                >
                    <svg className="w-5 h-5 text-black dark:text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>{isLogin ? 'Sign in with X' : 'Sign up with X'}</span>
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-fade-in">
                    <AlertCircle size={16} /> {error}
                </div>
            )}
            
            {successMsg && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm flex items-center gap-2 animate-fade-in">
                    <CheckCircle size={16} /> {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="relative group animate-slide-up">
                        <UserIcon className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                        />
                    </div>
                )}

                <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                    <input 
                        type="email" 
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                </div>

                <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={20} />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {isLogin && (
                    <div className="flex justify-end">
                        <button type="button" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                            Forgot Password?
                        </button>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            {isLogin ? 'Sign In' : 'Create Account'}
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-6 text-center border-t border-gray-100 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }} 
                    className="text-brand-600 font-bold hover:underline"
                >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;