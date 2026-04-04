import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Crown, ArrowRight } from 'lucide-react';

const Subscription = () => {
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

    return (
        <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6">
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
                            whileHover={{ y: -10 }}
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

                            <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.current
                                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                                }`}>
                                {plan.button} {!plan.current && <ArrowRight size={18} />}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Subscription;