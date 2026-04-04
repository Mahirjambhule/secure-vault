import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ShieldCheck, LogIn, UserPlus, KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- DEPLOYMENT CONFIG ---
const API_URL = "https://secure-vault-u2pt.onrender.com";

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
      // Updated to use API_URL
      const response = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
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
        // Updated to use API_URL
        await axios.post(`${API_URL}/api/request-reset`, { email });
        setResetEmailSent(true);
        toast.success("Reset code sent to your email!");
      } else {
        // Updated to use API_URL
        await axios.post(`${API_URL}/api/reset-password`, { email, otp, new_password: newPassword });
        toast.success("Password reset successfully! Please login.");
        setAuthStep('login');
        setResetEmailSent(false);
        setOtp('');
      }
    } catch (error) {
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
      // Updated to use API_URL
      const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
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

  // ... rest of your return statement remains the same ...
  return (
    <div className="min-h-screen pt-24 px-6 pb-12 flex items-center justify-center relative overflow-hidden bg-[#0f172a]">
       {/* UI code exactly as you provided */}
       {/* [Truncated for brevity, but keep your full return block here] */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
       <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl relative z-10"
       >
         {/* Your existing JSX content goes here */}
         <div className="text-center mb-8">
           <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
             {authStep === 'otp' || authStep === 'forgot' ? <KeyRound className="w-6 h-6 text-blue-400" /> : <ShieldCheck className="w-6 h-6 text-blue-400" />}
           </div>
           <h2 className="text-2xl font-bold text-white">
             {authStep === 'otp' ? 'Two-Factor Auth' : authStep === 'login' ? 'Access Your Vault' : authStep === 'forgot' ? 'Reset Master Password' : 'Create an Account'}
           </h2>
         </div>
         <AnimatePresence mode="wait">
            {/* Form rendering logic as in your original code, using the updated handlers above */}
            {/* (Ensure your JSX maps to handleInitialSubmit, handleForgotPassword, handleOtpSubmit) */}
         </AnimatePresence>
       </motion.div>
    </div>
  );
};

export default Auth;