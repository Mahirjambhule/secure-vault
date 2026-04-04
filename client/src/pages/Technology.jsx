import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Fingerprint, Lock, Zap, EyeOff, RefreshCw } from 'lucide-react';

const Technology = () => {
  const securityFeatures = [
    {
      name: "AES-256 GCM Encryption",
      icon: Lock,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      desc: "Advanced Encryption Standard with a 256-bit key. We use GCM (Galois/Counter Mode) which provides both high-speed encryption and 'Authenticated Encryption' to prevent data tampering."
    },
    {
      name: "Zero-Trust Architecture",
      icon: EyeOff,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      desc: "Our 'Trust No One' policy ensures that sensitive data is never stored in a readable format. The server only handles encrypted blobs; the keys stay isolated in the metadata vault."
    },
    {
      name: "Two-Factor Authentication (2FA)",
      icon: Fingerprint,
      color: "text-green-400",
      bg: "bg-green-400/10",
      desc: "Identity is verified twice. Even with a master password, access is denied without a unique, time-sensitive OTP (One-Time Password) delivered via secure SMTP."
    },
    {
      name: "Decoupled Data Storage",
      icon: Zap,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      desc: "We split the data. The encrypted file lives on a global CDN, while the decryption keys live in a separate, firewalled database. A breach of one does not compromise the other."
    },
    {
      name: "PBKDF2 Password Hashing",
      icon: ShieldCheck,
      color: "text-red-400",
      bg: "bg-red-400/10",
      desc: "Passwords are never stored. We use Password-Based Key Derivation Function 2 with a unique salt for every user, making it resistant to rainbow table and brute-force attacks."
    },
    {
      name: "JWT (JSON Web Tokens)",
      icon: RefreshCw,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      desc: "Session security is managed through digitally signed tokens. This ensures that every API request is authenticated and that user sessions cannot be easily hijacked."
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Specifications</span>
            </h1>
            <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
              SecureVault utilizes industry-standard cryptographic protocols to ensure your data remains private, even from us.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {securityFeatures.map((tech, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl bg-[#1e293b]/50 border border-gray-700 hover:border-blue-500/50 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl ${tech.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <tech.icon className={`w-8 h-8 ${tech.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{tech.name}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                {tech.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Technology;