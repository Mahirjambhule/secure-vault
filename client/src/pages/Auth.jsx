import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ShieldCheck, KeyRound, RefreshCw, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = window.location.hostname === "localhost"
  ? "http://127.0.0.1:5000"
  : "https://secure-vault-u2pt.onrender.com";

const Auth = () => {
  // Steps: 'login', 'register', 'otp', 'forgot', 'reset'
  const [authStep, setAuthStep] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // 1. Handle Login/Register
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

  // 2. Handle OTP (Standard Login)
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

  // 3. Handle Forgot Password Request (Send OTP)
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/forgot-password`, { email });
      toast.success("Reset OTP sent to your email!");
      setAuthStep('reset'); // Move to the actual reset form
    } catch (error) {
      toast.error(error.response?.data?.error || "User not found");
    } finally { setIsLoading(false); }
  };

  // 4. Handle Final Password Reset (MATCHES YOUR BACKEND)
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (otp.length !== 6) return toast.error("Enter valid 6-digit OTP");
    
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/reset-password`, { 
        email, 
        otp: otp, 
        new_password: newPassword 
      });
      toast.success("Password updated! Please login.");
      setAuthStep('login');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Reset failed");
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl relative z-10">

        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
            {authStep === 'otp' || authStep === 'reset' ? <KeyRound className="w-6 h-6 text-blue-400" /> : <ShieldCheck className="w-6 h-6 text-blue-400" />}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {authStep === 'otp' ? 'Verification' : authStep === 'forgot' ? 'Forgot Password' : authStep === 'reset' ? 'New Password' : authStep === 'login' ? 'Access Vault' : 'Create Account'}
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {/* LOGIN & REGISTER VIEW */}
          {(authStep === 'login' || authStep === 'register') && (
            <motion.form key="auth" onSubmit={handleInitialSubmit} className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:outline-none" placeholder="Email" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:outline-none" placeholder="Password" required />
              </div>
              {authStep === 'login' && (
                <div className="text-right">
                  <button type="button" onClick={() => setAuthStep('forgot')} className="text-xs text-blue-400 hover:text-blue-300">Forgot Password?</button>
                </div>
              )}
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
                {isLoading ? <RefreshCw className="animate-spin" /> : authStep === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
              <p onClick={() => setAuthStep(authStep === 'login' ? 'register' : 'login')} className="text-center text-sm text-gray-400 cursor-pointer hover:text-white">
                {authStep === 'login' ? "New here? Create account" : "Have an account? Login"}
              </p>
            </motion.form>
          )}

          {/* FORGOT PASSWORD REQUEST VIEW */}
          {authStep === 'forgot' && (
            <motion.form key="forgot" onSubmit={handleForgotRequest} className="space-y-5">
              <p className="text-sm text-gray-400 text-center">We'll send a 6-digit code to your email.</p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:outline-none" placeholder="Enter Email" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2">
                {isLoading ? <RefreshCw className="animate-spin" /> : <><Send className="w-4 h-4" /> Send Reset OTP</>}
              </button>
              <button type="button" onClick={() => setAuthStep('login')} className="w-full text-sm text-gray-500 flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Login</button>
            </motion.form>
          )}

          {/* RESET PASSWORD FINAL VIEW (Matches your Backend) */}
          {authStep === 'reset' && (
            <motion.form key="reset" onSubmit={handleResetSubmit} className="space-y-4">
              <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 text-center text-xl tracking-widest focus:outline-none" placeholder="OTP CODE" required />
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:outline-none" placeholder="New Password" required />
              </div>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 pl-10 focus:outline-none" placeholder="Confirm Password" required />
              </div>
              <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl text-white font-bold">
                {isLoading ? <RefreshCw className="animate-spin h-5 w-5 mx-auto" /> : 'Update Password'}
              </button>
              <button type="button" onClick={() => setAuthStep('login')} className="w-full text-sm text-gray-500">Cancel</button>
            </motion.form>
          )}

          {/* LOGIN OTP VERIFICATION VIEW */}
          {authStep === 'otp' && (
            <motion.form key="otp" onSubmit={handleOtpSubmit} className="space-y-5">
              <p className="text-sm text-gray-400 text-center">Secure OTP sent to {email}</p>
              <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-xl py-3 text-center text-2xl tracking-widest focus:outline-none" placeholder="000000" />
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 py-3 rounded-xl text-white font-bold">
                {isLoading ? 'Verifying...' : 'Unlock Vault'}
              </button>
              <button type="button" onClick={() => setAuthStep('login')} className="w-full text-sm text-gray-500">Cancel</button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Auth;