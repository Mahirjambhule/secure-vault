import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Lock, EyeOff, CheckCircle, Fingerprint, 
  Key, Zap, ShieldCheck, Cpu, Server, Database 
} from 'lucide-react';

const About = () => {
  const principles = [
    {
      icon: EyeOff,
      title: "End-to-End Privacy",
      desc: "Traditional cloud providers can read your files. We use client-side AES-256 to ensure data is encrypted on your device before it ever touches the internet."
    },
    {
      icon: Lock,
      title: "Zero-Knowledge Storage",
      desc: "SecureVault operates as a 'blind host'. Our servers handle the binary blobs, but the decryption keys never leave the secure confines of your session."
    },
    {
      icon: ShieldAlert,
      title: "Zero Trust Architecture",
      desc: "By decoupling the React frontend from the Python/Flask backend, we maintain a strict 'never trust, always verify' policy for every data packet."
    }
  ];

  const securityFeatures = [
    { name: "Hybrid MERN-Flask Stack", detail: "Combines React flexibility with the robust security modules of Python.", icon: Cpu },
    { name: "Brevo SMTP MFA Relay", detail: "Military-grade 2FA codes delivered via secure transactional email channels.", icon: Fingerprint },
    { name: "Bcrypt Hashing Engine", detail: "Salting and hashing via Flask-Bcrypt ensures credential immutability.", icon: ShieldCheck },
    { name: "Cloudinary BLOB Vault", detail: "Files are stored as encrypted blobs, separate from the metadata layer.", icon: Server }
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 relative overflow-hidden bg-[#0f172a]">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-blue-400 font-mono text-xs tracking-widest uppercase">The Philosophy</span>
          <h1 className="mt-4 text-4xl font-bold text-white tracking-tight">
            Redefining <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Data Sovereignty</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 leading-relaxed">
            In an era of centralized monitoring, SecureVault was engineered to remove the need for third-party trust. We didn't just build a cloud; we built a vault where <span className="text-white italic">you</span> hold the only key.
          </p>
        </motion.div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {principles.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-blue-500/30 transition-all group"
            >
              <item.icon className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How it Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-[#1e293b]/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-400" />
            The SecureVault Engine
          </h2>
          <ul className="grid grid-cols-1 gap-4 text-gray-300">
            {[
              "React frontend processes file into binary memory buffers.",
              "Crypto-JS library executes AES-256 local encryption.",
              "Ciphertext is routed through the Python/Flask security controller.",
              "Encrypted blobs are securely stored on Cloudinary's global CDN.",
              "MongoDB Atlas manages immutable metadata and file pointers.",
              "Decryption occurs exclusively in the client-side browser context."
            ].map((step, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-lg">{step}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Technical Foundation</h2>
          <p className="text-gray-400">Layered defense mechanisms built for the modern web</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <feature.icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">{feature.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{feature.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-20 text-center text-gray-600 text-xs uppercase tracking-[0.2em]">
          Designed for Privacy • Built for Security
        </footer>

      </div>
    </div>
  );
};

export default About;