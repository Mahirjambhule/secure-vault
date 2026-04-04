import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, EyeOff, CheckCircle, Fingerprint, Key, Zap, ShieldCheck } from 'lucide-react';

const About = () => {
  const principles = [
    {
      icon: EyeOff,
      title: "No Server-Side Snooping",
      desc: "Traditional cloud providers can read your files. We encrypt everything on your device before it ever touches the internet."
    },
    {
      icon: Lock,
      title: "Client-Side AES-256",
      desc: "Your files are locked using Advanced Encryption Standard (AES) with a 256-bit key, the same standard used by governments and banks."
    },
    {
      icon: ShieldAlert,
      title: "Zero Trust Architecture",
      desc: "We operate on the principle of 'never trust, always verify'. Our servers only store encrypted blobs and metadata, never the raw data."
    }
  ];

  const securityFeatures = [
    { name: "JWT Session Management", detail: "Short-lived tokens (30m) with HMAC-SHA256 signatures.", icon: Key },
    { name: "2FA Email Verification", detail: "Real-time OTP verification for logins and password resets.", icon: Fingerprint },
    { name: "Strict Password Policy", detail: "Regex-validated requirements for complexity and length.", icon: ShieldCheck },
    { name: "Rate Limiting", detail: "Protects API endpoints from brute-force and DDoS attacks.", icon: Zap }
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 relative overflow-hidden bg-[#0f172a]">
      {/* Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white tracking-tight">
            The Philosophy of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Zero Trust</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 leading-relaxed">
            In an era of constant data breaches, trusting a third party with your sensitive files is a risk. SecureVault was built to remove the need for trust entirely.
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
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <item.icon className="w-10 h-10 text-blue-400 mb-4" />
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
          className="bg-[#1e293b] border border-gray-700 rounded-3xl p-8 md:p-12 shadow-2xl mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            How the Engine Works
          </h2>
          <ul className="grid grid-cols-1 gap-4 text-gray-300">
            {[
              "File is read into memory on the React frontend.",
              "Cryptographic key and nonce are generated locally.",
              "File is encrypted into a scrambled binary blob.",
              "Encrypted blob is uploaded via secure HTTPS to Cloudinary.",
              "Unique decryption keys are saved securely in MongoDB.",
              "Decryption happens only on your device during download."
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
          <h2 className="text-3xl font-bold text-white mb-2">Technical Security Stack</h2>
          <p className="text-gray-400">Layered defense mechanisms implemented in the SecureVault Core</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {securityFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 p-5 bg-gradient-to-br from-blue-600/5 to-purple-600/5 border border-white/5 rounded-2xl"
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

      </div>
    </div>
  );
};

export default About;