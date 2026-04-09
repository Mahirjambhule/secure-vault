import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { 
  Shield, LayoutDashboard, History, Info, ShieldCheck, 
  Home, Crown, LogOut, ChevronDown, Database, Menu, X 
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = !!localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/');
    window.location.reload();
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          handleLogout();
        }
      } catch (error) {
        handleLogout();
      }
    }
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    ...(isAuthenticated ? [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'History', path: '/history', icon: History },
      { name: 'Upgrade', path: '/upgrade', icon: Crown },
    ] : []),
    { name: 'Technology', path: '/tech', icon: ShieldCheck },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md">
      <div className="w-full px-8 py-4 flex items-center">

        {/* 1. Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
            <Shield className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            SecureVault
          </span>
        </Link>

        {/* 2. Spacer & Navigation */}
        <div className="flex-1 flex justify-end items-center gap-6">
          
          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-2 mr-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className="relative px-3 py-2">
                {isActive(item.path) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative flex items-center gap-2 text-sm font-medium transition-colors ${isActive(item.path)
                  ? (item.name === 'Upgrade' ? 'text-yellow-400' : 'text-blue-400')
                  : (item.name === 'Upgrade' ? 'text-yellow-500/70 hover:text-yellow-400' : 'text-gray-400 hover:text-white')
                }`}>
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Profile / Auth Section */}
          <div className="flex items-center gap-4 pl-6 border-l border-white/10 relative">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 p-1.5 pr-3 rounded-full transition-all group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {userEmail[0].toUpperCase()}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-[-1]" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-64 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2 ring-1 ring-black/50"
                      >
                        <div className="p-4 border-b border-white/5 mb-2">
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Authenticated As</p>
                          <p className="text-white text-sm font-medium truncate">{userEmail}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 p-3 text-gray-400 text-xs rounded-xl">
                            <Database className="w-4 h-4 text-blue-400" />
                            <span>Storage Plan: <b className="text-blue-400">Basic (500MB)</b></span>
                          </div>
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 text-red-400 text-sm hover:bg-red-400/10 rounded-xl transition-colors group">
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            <span className="font-medium">Logout Session</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth" className="hidden sm:block text-sm font-medium px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-600/20">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Slide Down) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-white/10 bg-[#0f172a] overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    isActive(item.path) ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;