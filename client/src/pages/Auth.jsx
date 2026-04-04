import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ShieldCheck, LogIn, UserPlus, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = window.location.hostname === "localhost"
  ? "http://127.0.0.1:5000"
  : "https://secure-vault-u2pt.onrender.com";

const Auth = () => {
  const [authStep, setAuthStep] = useState('login');
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
      const response = await axios.post(`${API_URL}${endpoint}`, { email, password });
      if (authStep === 'login' && response.data.requires_otp) {
        toast.success("Password verified! Check email for OTP.");
        setAuthStep('otp');
      } else if (authStep === 'register') {
        toast.success("Registration successful! Please log in.");
        setAuthStep('login');
        setPassword('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Connection failed");
    } finally { setIsLoading(false); }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error("Enter 6-digit OTP");
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', response.data.email);
      toast.success("Access Granted!");
      window.location.href = '/dashboard';
    } catch (error) {
      toast.error("Invalid OTP");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl relative z-10">

        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
            {authStep === 'otp' ? <KeyRound className="w-6 h-6 text-blue-400" /> : <ShieldCheck className="w-6 h-6 text-blue-400" />}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {authStep === 'otp' ? 'Verification' : authStep === 'login' ? 'Access Vault' : 'Create Account'}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {authStep !== 'otp' ? (
            <motion.form key="auth" onSubmit={handleInitialSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:outline-none" placeholder="Email" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:outline-none" placeholder="Password" required />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
                {isLoading ? <RefreshCw className="animate-spin" /> : authStep === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
              <p onClick={() => setAuthStep(authStep === 'login' ? 'register' : 'login')} className="text-center text-sm text-gray-400 cursor-pointer hover:text-white">
                {authStep === 'login' ? "New here? Create account" : "Have an account? Login"}
              </p>
            </motion.form>
          ) : (
            <motion.form key="otp" onSubmit={handleOtpSubmit} className="space-y-5">
              <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 text-center text-2xl tracking-widest focus:outline-none" placeholder="000000" />
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 py-3 rounded-xl text-white font-bold">
                {isLoading ? 'Verifying...' : 'Unlock Vault'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;