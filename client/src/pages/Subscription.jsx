import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added ShieldCheck and X to the imports
import { Check, Zap, Shield, Crown, ArrowRight, X, CreditCard, Lock, ShieldCheck } from 'lucide-react';

const Subscription = () => {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const plans = [
        {
            name: "Basic Vault",
            price: "Free",
            storage: "500 MB",
            features: ["AES-256 Encryption", "Standard Support", "Zero-Knowledge Storage"],
            button: "Current Plan",
            current: true
        },
        {
            name: "Pro Vault",
            price: "₹499",
            storage: "5 GB",
            features: ["AES-256 Encryption", "Priority Support", "High-Capacity Storage"],
            button: "Upgrade to Pro",
            current: false,
            recommended: true
        }
    ];

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpgradeClick = () => setIsCheckoutOpen(true);
    
    const handleCloseCheckout = () => {
        setIsCheckoutOpen(false);
        setFormData({ name: '', cardNumber: '', expiry: '', cvv: '' });
    };

    const handleFinalPayment = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.cardNumber || !formData.expiry || !formData.cvv) {
            alert("Please fill in all details.");
            return;
        }
        alert(`Processing Secure Payment for Pro Vault (5 GB)...`);
        setIsCheckoutOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6 relative overflow-x-hidden">
            <div className="max-w-5xl mx-auto text-center relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Expand Your <span className="text-blue-500">Secure Space</span>
                </h1>
                <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
                    Upgrade to a professional-grade quota for your encrypted assets.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            whileHover={plan.current ? {} : { y: -10 }}
                            className={`relative p-8 rounded-3xl border ${plan.recommended ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 bg-white/5'} backdrop-blur-xl transition-all`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/50">
                                    <Crown size={14} /> Recommended
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="text-4xl font-black text-white mb-6">
                                {plan.price}<span className="text-lg text-gray-500 font-normal">/month</span>
                            </div>

                            <div className="flex items-center gap-2 text-blue-400 font-bold mb-8 justify-center bg-blue-400/10 py-2 rounded-xl">
                                <Zap size={18} /> {plan.storage} Storage
                            </div>

                            <ul className="text-left space-y-4 mb-10">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <Check size={18} className="text-green-500" /> {feat}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={plan.current ? null : handleUpgradeClick}
                                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.current
                                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                                    }`}
                            >
                                {plan.button} {!plan.current && <ArrowRight size={18} />}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* MODAL SYSTEM */}
            <AnimatePresence>
                {isCheckoutOpen && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                        {/* 1. Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseCheckout}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />

                        {/* 2. Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-[#1e293b] border border-white/20 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl z-[1000] overflow-y-auto max-h-[95vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-600/20 rounded-xl text-blue-400">
                                        <Shield size={24} />
                                    </div>
                                    <div className="text-left">
                                        <h2 className="text-lg font-bold text-white uppercase tracking-tight leading-tight">Secure Payment</h2>
                                        <p className="text-gray-400 text-[11px] font-medium">Pro Vault • 5 GB Storage</p>
                                    </div>
                                </div>
                                <button onClick={handleCloseCheckout} className="text-gray-500 hover:text-white transition-colors p-1">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Payment Form */}
                            <form onSubmit={handleFinalPayment} className="space-y-4 text-left">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest px-1">Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. John Doe"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest px-1">Card Number</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            name="cardNumber"
                                            required
                                            value={formData.cardNumber}
                                            onChange={handleInputChange}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600 font-mono tracking-wider"
                                        />
                                        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest px-1">Expiry</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            required
                                            value={formData.expiry}
                                            onChange={handleInputChange}
                                            placeholder="MM / YY"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600 text-center"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest px-1">CVV</label>
                                        <input
                                            type="password"
                                            name="cvv"
                                            required
                                            maxLength="3"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            placeholder="***"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all placeholder:text-gray-600 text-center"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    <Lock size={16} /> Confirm & Pay ₹499
                                </button>
                            </form>

                            {/* Footer info */}
                            <div className="mt-6 flex flex-col items-center gap-3">
                                <div className="flex items-center justify-center gap-4 opacity-30 grayscale contrast-125">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                                </div>
                                <p className="text-[9px] text-gray-600 uppercase font-bold tracking-[0.2em] flex items-center gap-1.5">
                                    <ShieldCheck size={10} /> Secure Payment
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Subscription;