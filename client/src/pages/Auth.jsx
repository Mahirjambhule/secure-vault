import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ShieldCheck, LogIn, UserPlus, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Auth = () => {
  const [authStep, setAuthStep] = useState('login'); // 'login', 'register', 'otp', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");

    setIsLoading(true);
    const endpoint = authStep === 'login' ? '/login' : '/register';
    
    try {
      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, { email, password });
      
      if (authStep === 'login' && response.data.requires_otp) {
        toast.success("Password verified! Check your email for the OTP.");
        setAuthStep('otp');
      } else if (authStep === 'register') {
        toast.success("Registration successful! Please log in.");
        setAuthStep('login');
        setPassword(''); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!resetEmailSent) {
        await axios.post('http://127.0.0.1:5000/api/request-reset', { email });
        setResetEmailSent(true);
        toast.success("Reset code sent to your email!");
      } else {
        await axios.post('http://127.0.0.1:5000/api/reset-password', { email, otp, new_password: newPassword });
        toast.success("Password reset successfully! Please login.");
        setAuthStep('login');
        setResetEmailSent(false);
        setOtp('');
      }
    } catch (error) {
      // FIX: Get the specific message from the Backend
      const serverMessage = error.response?.data?.message || error.response?.data?.error || "Operation failed";
      toast.error(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error("Please enter a valid 6-digit OTP.");

    setIsLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:5000/verify-otp', { email, otp });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.email);
      toast.success("Zero Trust Verification Complete!");
      setTimeout(() => { window.location.href = '/dashboard'; }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.error || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
            {authStep === 'otp' || authStep === 'forgot' ? <KeyRound className="w-6 h-6 text-blue-400" /> : <ShieldCheck className="w-6 h-6 text-blue-400" />}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {authStep === 'otp' ? 'Two-Factor Auth' : authStep === 'login' ? 'Access Your Vault' : authStep === 'forgot' ? 'Reset Master Password' : 'Create an Account'}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            {authStep === 'forgot' ? 'Provide your email to receive a recovery code.' : 'Secure end-to-end encrypted file storage.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* LOGIN & REGISTER FORM */}
          {(authStep === 'login' || authStep === 'register') && (
            <motion.form key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleInitialSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500" placeholder="you@example.com" required />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-400">Master Password</label>
                  {authStep === 'login' && (
                    <button type="button" onClick={() => setAuthStep('forgot')} className="text-xs text-blue-400 hover:underline">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500" placeholder="••••••••" required />
                </div>
                {authStep === 'register' && <p className="text-[10px] text-gray-500 mt-1">Must include uppercase, number, and symbol.</p>}
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {isLoading ? <RefreshCw className="animate-spin w-5 h-5" /> : authStep === 'login' ? <><LogIn className="w-5 h-5"/> Verify Credentials</> : <><UserPlus className="w-5 h-5"/> Register Account</>}
              </button>
            </motion.form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authStep === 'forgot' && (
            <motion.form key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500" placeholder="you@example.com" disabled={resetEmailSent} required />
              </div>

              {resetEmailSent && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Reset OTP</label>
                    <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 text-center tracking-widest text-xl focus:outline-none focus:border-blue-500" placeholder="000000" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">New Master Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 px-4 focus:outline-none focus:border-blue-500" placeholder="New strong password" required />
                  </div>
                </>
              )}

              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg">
                {isLoading ? 'Processing...' : resetEmailSent ? 'Update Password' : 'Send Recovery Code'}
              </button>
              
              <button type="button" onClick={() => { setAuthStep('login'); setResetEmailSent(false); }} className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            </motion.form>
          )}

          {/* OTP FORM */}
          {authStep === 'otp' && (
            <motion.form key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Verification Code</label>
                <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-4 text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-blue-500" placeholder="000000" />
              </div>
              <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50">
                {isLoading ? 'Verifying...' : 'Unlock Vault'}
              </button>
              <button type="button" onClick={() => setAuthStep('login')} className="w-full text-sm text-gray-400 hover:text-white mt-4">Cancel</button>
            </motion.form>
          )}
        </AnimatePresence>

        {(authStep === 'login' || authStep === 'register') && (
          <div className="mt-6 text-center">
            <button onClick={() => { setAuthStep(authStep === 'login' ? 'register' : 'login'); setPassword(''); }} className="text-sm text-gray-400 hover:text-white transition-colors">
              {authStep === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;