import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Shield, Crown, ArrowRight, X, CreditCard, QrCode } from 'lucide-react';

const Subscription = () => {
    // 1. STATE MANAGEMENT
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('card'); // 'card' or 'upi'

    const plans = [
        {
            name: "Basic Vault",
            price: "Free",
            storage: "50 MB",
            features: ["AES-256 Encryption", "Standard Support", "Limited Storage"],
            button: "Current Plan",
            current: true
        },
        {
            name: "Pro Vault",
            price: "₹499",
            storage: "2 GB",
            features: ["AES-256 Encryption", "Standard Support", "More Storage"],
            button: "Upgrade to Pro",
            current: false,
            recommended: true
        }
    ];

    // 2. HANDLERS
    const handleUpgradeClick = () => {
        setIsCheckoutOpen(true);
    };

    const handleCloseCheckout = () => {
        setIsCheckoutOpen(false);
    };

    const handleFinalPayment = () => {
        alert(`Proceeding with ${selectedPayment.toUpperCase()} payment for ₹499.`);
        setIsCheckoutOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6 relative">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Upgrade Your <span className="text-blue-500">Security Quota</span>
                </h1>
                <p className="text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
                    Need more space for your encrypted assets? Choose a plan that fits your needs.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            whileHover={plan.current ? {} : { y: -10 }}
                            className={`relative p-8 rounded-3xl border ${plan.recommended ? 'border-blue-500 bg-blue-500/5' : 'border-white/10 bg-white/5'
                                } backdrop-blur-xl transition-all`}
                        >
                            {plan.recommended && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                    <Crown size={14} /> Most Popular
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
                                    }`}>
                                {plan.button} {!plan.current && <ArrowRight size={18} />}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 4. CHECKOUT MODAL UI */}
            <AnimatePresence>
                {isCheckoutOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-6"
                        onClick={handleCloseCheckout}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#1e293b] border border-white/10 p-8 rounded-3xl max-w-lg w-full relative shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={handleCloseCheckout} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
                                <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500"><Shield size={24} /></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Secure Checkout</h2>
                                    <p className="text-gray-400 text-sm">Complete your upgrade</p>
                                </div>
                            </div>

                            {/* PAYMENT METHOD SELECTION */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button
                                    onClick={() => setSelectedPayment('card')}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedPayment === 'card' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 text-gray-500'}`}
                                >
                                    <CreditCard size={18} /> Card
                                </button>
                                <button
                                    onClick={() => setSelectedPayment('upi')}
                                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${selectedPayment === 'upi' ? 'border-blue-500 bg-blue-500/10 text-white' : 'border-white/5 text-gray-500'}`}
                                >
                                    <QrCode size={18} /> UPI
                                </button>
                            </div>

                            {/* DYNAMIC FORM AREA */}
                            <div className="space-y-4 mb-8">
                                {selectedPayment === 'card' ? (
                                    <motion.div key="card-form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400 uppercase font-bold">Cardholder Name</label>
                                            <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400 uppercase font-bold">Card Number</label>
                                            <div className="relative">
                                                <input type="text" placeholder="xxxx xxxx xxxx xxxx" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 pl-11" />
                                                <CreditCard className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-400 uppercase font-bold">Expiry</label>
                                                <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-gray-400 uppercase font-bold">CVV</label>
                                                <input type="password" placeholder="***" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div key="upi-form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 text-center">
                                        <div className="py-6 bg-white/5 rounded-2xl border border-dashed border-white/20 flex flex-col items-center">
                                            <QrCode size={80} className="text-white opacity-20 mb-2" />
                                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Enter UPI ID to Generate QR</p>
                                        </div>
                                        <div className="space-y-1 text-left">
                                            <label className="text-xs text-gray-400 uppercase font-bold">UPI ID</label>
                                            <input type="text" placeholder="username@okaxis" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500" />
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            <button
                                onClick={handleFinalPayment}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <Shield size={18} /> Confirm & Pay ₹499
                            </button>

                            <p className="text-center text-[10px] text-gray-600 mt-6 uppercase tracking-[0.2em]">
                                🔒 Secure Payment
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Subscription;