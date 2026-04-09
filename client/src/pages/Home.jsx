import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Lock, Cloud, ArrowRight, Fingerprint, 
  Database, Zap, ShieldAlert, MonitorCheck, Share2, 
  Server, Cpu, Globe, Key 
} from 'lucide-react';

const Home = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen pt-30 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />

        <div className="text-center z-10 max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8">
  Zero Trust Architecture
</div>

{/* Main Heading */}
<h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
  Secure Cloud <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
    Infrastructure
  </span>
</h1>

{/* Description Paragraph */}
<p className="mt-8 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
  The only cloud storage where <span className="text-white italic">you</span> hold the keys. 
  We provide the vault, but your data stays invisible to everyone—including us.
</p>

            <div className="mt-10 flex gap-4 justify-center">
              <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                  {isAuthenticated ? 'Enter My Vault' : 'Initialize Secure Vault'} <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <HomeCard icon={Cpu} title="Client-Side Crypto" desc="AES-256 bit encryption occurs in your browser. Raw files never touch the network." color="text-blue-400" />
            <HomeCard icon={Key} title="Stateless Auth" desc="JWT-based sessions with Flask-Bcrypt hashing ensure your credentials stay immutable." color="text-purple-400" />
            <HomeCard icon={Globe} title="Cloud Distribution" desc="Powered by Cloudinary BLOB storage and MongoDB Atlas for global metadata indexing." color="text-pink-400" />
          </motion.div>
        </div>
      </section>

      {/* --- JOURNEY SECTION --- */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#0f172a]/50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">The Zero-Knowledge Workflow</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 -z-10" />

            <JourneyStep
              icon={MonitorCheck}
              title="1. Local Encryption"
              desc="Files are converted into encrypted BLOBs on your device using your unique salt."
            />
            <JourneyStep
              icon={Share2}
              title="2. Secure Tunnel"
              desc="Encrypted ciphertext is relayed to our Python/Flask backend via HTTPS/TLS 1.3."
            />
            <JourneyStep
              icon={Server}
              title="3. BLOB Storage"
              desc="Ciphertext is stored on Cloudinary, while metadata is secured in MongoDB Atlas."
            />
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-16 italic">Engineered for Privacy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MiniCard icon={Fingerprint} title="SMTP-MFA Relay" desc="Dual-factor authentication powered by Brevo API for secure session entry." />
          <MiniCard icon={ShieldAlert} title="Zero-Trust Policy" desc="Our servers are blind to your data. No recovery keys, no backdoors, no leaks." />
          <MiniCard icon={Database} title="Smart Metadata" desc="NoSQL indexing allows lightning-fast retrieval of your encrypted file pointers." />
          <MiniCard icon={Zap} title="Instant Shred" desc="Deleting a file triggers a secure purge of the BLOB and its metadata markers." />
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-32 px-6 text-center bg-gradient-to-t from-blue-600/10 to-transparent">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-5xl font-bold mb-6 italic tracking-tight">Data sovereignty is a right.</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg">
            Experience the fusion of MERN flexibility and Python/Flask security. Start your Zero-Knowledge journey today.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
            <button className="px-10 py-5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
              Initialize My Vault
            </button>
          </Link>
        </motion.div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 SecureVault.</p>
        <p className="mt-2 text-xs opacity-50 uppercase tracking-widest">Zero Trust Architecture</p>
      </footer>
    </div>
  );
};

// ... (HomeCard, JourneyStep, MiniCard remain same)

const HomeCard = ({ icon: Icon, title, desc, color }) => (
  <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all group">
    <Icon className={`w-12 h-12 ${color} mb-6 group-hover:scale-110 transition-transform`} />
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

const JourneyStep = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center bg-[#0f172a] px-4">
    <div className="w-20 h-20 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/5">
      <Icon className="w-10 h-10 text-blue-400" />
    </div>
    <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
    <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">{desc}</p>
  </div>
);

const MiniCard = ({ icon: Icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-[#1e293b]/30 border border-white/5 hover:bg-blue-600/5 hover:border-blue-500/20 transition-all text-center flex flex-col items-center">
    <Icon className="w-8 h-8 text-blue-400 mb-4" />
    <h4 className="font-bold text-white mb-2">{title}</h4>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default Home;