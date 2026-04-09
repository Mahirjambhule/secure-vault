import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Fingerprint, Lock, Zap, EyeOff, 
  RefreshCw, Layers, Database, Globe, X, CheckCircle2, 
  Cpu, ArrowRight, Shield
} from 'lucide-react';

const Technology = () => {
  const [selectedTech, setSelectedTech] = useState(null);

  const securityFeatures = [
    {
      name: "Client-Side AES-256",
      icon: Lock,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      desc: "True Zero-Knowledge encryption. Files are transformed into AES-256 ciphertext in your browser.",
      longDesc: "SecureVault leverages the Advanced Encryption Standard (AES) with a 256-bit key length. Unlike traditional cloud providers, the encryption process occurs entirely within the client's browser environment using the Crypto-JS library.",
      specs: ["Algorithm: AES-256-GCM", "Library: Crypto-JS", "Key Derivation: PBKDF2"],
      mechanism: [
        "User selects a file for upload.",
        "A unique 256-bit encryption key is generated locally.",
        "File is converted to a WordArray and encrypted via AES-GCM.",
        "Only the resulting ciphertext leaves the browser."
      ]
    },
    {
      name: "Hybrid Flask Architecture",
      icon: Layers,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      desc: "Our high-performance Python/Flask backend manages the cryptographic handshakes.",
      longDesc: "By utilizing a hybrid MERN-Flask architecture, we separate the user interface logic (React) from the critical security operations (Python). Flask acts as a hardened security controller.",
      specs: ["Controller: Python 3.10", "Framework: Flask RESTful", "Deployment: Render PAAS"],
      mechanism: [
        "React frontend sends an authenticated request.",
        "Flask interceptor validates the JWT signature.",
        "Backend handles secure routing to Cloudinary/MongoDB.",
        "Server returns a status-code confirmed secure response."
      ]
    },
    {
      name: "Brevo SMTP Relay",
      icon: Fingerprint,
      color: "text-green-400",
      bg: "bg-green-400/10",
      desc: "Multi-Factor Authentication is delivered via the Brevo transactional API.",
      longDesc: "To mitigate credential stuffing, SecureVault implements an SMTP-based MFA relay. Utilizing Brevo's specialized infrastructure, the system generates a cryptographically random 6-digit OTP.",
      specs: ["API: Brevo SMTP v3", "OTP Length: 6 Digits", "Expiry: 10 Minutes"],
      mechanism: [
        "Login request triggers a 6-digit random integer generation.",
        "OTP is hashed and stored in MongoDB with a TTL index.",
        "Brevo API is called to relay the code to the user's email.",
        "User must input the matching code within the expiry window."
      ]
    },
    {
      name: "Cloudinary BLOB Storage",
      icon: Globe,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      desc: "Encrypted file fragments are stored as binary large objects on Cloudinary's global CDN.",
      longDesc: "The encrypted ciphertext is stored as a 'Raw' Binary Large Object (BLOB) on Cloudinary. This provides global edge-caching and 99.9% availability.",
      specs: ["Type: Raw BLOB", "CDN: Global Edge", "Storage Policy: Immutable"],
      mechanism: [
        "Flask backend receives encrypted payload from React.",
        "Payload is streamed to Cloudinary as a 'raw' resource type.",
        "Cloudinary generates a secure HTTPS pointer.",
        "Pointer is returned to the DB for metadata association."
      ]
    },
    {
      name: "Flask-Bcrypt Hashing",
      icon: ShieldCheck,
      color: "text-red-400",
      bg: "bg-red-400/10",
      desc: "Passwords undergo 12 rounds of salt-based hashing via Bcrypt before being stored.",
      longDesc: "We implement defensive hashing using Flask-Bcrypt. Each password is salted with a unique 128-bit value and hashed through 12 computational rounds.",
      specs: ["Work Factor: 12 Rounds", "Salt: Per-user unique", "Algo: Blowfish-based"],
      mechanism: [
        "Raw password enters the Flask registration route.",
        "A unique salt is generated for the specific user.",
        "The password+salt is processed 4,096 times (2^12 rounds).",
        "The resulting irreversible hash is stored in MongoDB."
      ]
    },
    {
      name: "Decoupled Metadata",
      icon: Database,
      color: "text-cyan-400",
      bg: "bg-cyan-400/10",
      desc: "File pointers and user metadata are isolated in a firewalled MongoDB cluster.",
      longDesc: "Security is enhanced by decoupling file content from file metadata. While Cloudinary holds the encrypted data, MongoDB Atlas holds the cryptographic nonces.",
      specs: ["DB: MongoDB Atlas", "Isolation: Logic/Storage Split", "Query: Non-relational BSON"],
      mechanism: [
        "System splits file info into 'Data' and 'Metadata'.",
        "Metadata (Size, Type, Key-ID) is stored in MongoDB.",
        "Actual encrypted bytes are sent to Cloudinary.",
        "The two layers are reunited only during an authorized download."
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 px-6 pb-12 relative overflow-hidden bg-[#0f172a]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-blue-400 font-mono text-sm tracking-widest uppercase">Security Protocols</span>
            <h1 className="text-5xl font-bold text-white mt-4 tracking-tight">
              Cryptographic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Stack</span>
            </h1>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((tech, index) => (
            <motion.div 
              key={index}
              layoutId={`card-${tech.name}`}
              onClick={() => setSelectedTech(tech)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/[0.07] transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl ${tech.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <tech.icon className={`w-8 h-8 ${tech.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{tech.name}</h3>
              <p className="text-gray-400 leading-relaxed text-sm mb-4">{tech.desc}</p>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
                Technical Deep-Dive <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedTech && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTech(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div 
              layoutId={`card-${selectedTech.name}`}
              className="relative w-full max-w-4xl bg-[#111827] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedTech(null)}
                className="absolute top-8 right-8 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side: Description */}
                <div className="p-8 md:p-12 bg-white/[0.02] border-r border-white/5">
                  <div className={`w-16 h-16 rounded-2xl ${selectedTech.bg} flex items-center justify-center mb-8`}>
                    <selectedTech.icon className={`w-10 h-10 ${selectedTech.color}`} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-6">{selectedTech.name}</h2>
                  <p className="text-gray-300 text-lg leading-relaxed mb-8 font-light">
                    {selectedTech.longDesc}
                  </p>

                  <div className="space-y-3">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Core Specifications</p>
                    {selectedTech.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Mechanism / Flow */}
                <div className="p-8 md:p-12 bg-[#0f172a]">
                  <div className="flex items-center gap-2 mb-8 text-blue-400">
                    <Cpu size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Logic Workflow</span>
                  </div>

                  <div className="relative space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-500/50 to-purple-500/50 hidden md:block" />

                    {selectedTech.mechanism.map((step, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="flex gap-4 relative"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                          {i + 1}
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed pt-0.5">
                          {step}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="text-blue-400 w-5 h-5" />
                      <span className="text-white font-bold text-sm">Security Impact</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      This layer ensures that even in the event of a full server compromise, the actual content remains mathematically inaccessible to unauthorized entities.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Technology;