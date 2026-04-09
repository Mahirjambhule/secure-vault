import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, File, X, Loader2, ShieldCheck, HardDrive } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000"
    : "https://secure-vault-u2pt.onrender.com";

const Dashboard = () => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [quota, setQuota] = useState({ used: 0, max: 524288000, percentage: 0, file_count: 0 });
    const fileInputRef = useRef(null);

    const fetchQuota = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/quota`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            console.log("QUOTA CHECK:", response.data);
    
            setQuota({
                used: response.data.used_bytes || 0,
                max: response.data.max_bytes || 524288000,
                percentage: ((response.data.used_bytes || 0) / (response.data.max_bytes || 524288000)) * 100,
                file_count: response.data.file_count || 0
            });
        } catch (err) {
            console.error("Quota failed", err);
        }
    };

    useEffect(() => {
        fetchQuota();
    }, []);

    const formatMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

    const handleDragOver = (e) => e.preventDefault();
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    };
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
    };
    const clearFile = () => setFile(null);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("File Secured!");
            setFile(null);

            await fetchQuota();

        } catch (error) {
            toast.error(error.response?.data?.error || "Upload Failed");
        } finally {
            setIsUploading(false);
        }
    };

    const getProgressBarColor = () => {
        if (quota.percentage > 90) return 'bg-red-500';
        if (quota.percentage > 75) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12">
            <div className="max-w-4xl mx-auto">

                <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-6">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-white">Encryption Vault</h1>
                        <p className="text-gray-400 mt-2 max-w-lg">
                            Upload files securely. Data is encrypted client-side before transmission.
                        </p>
                    </div>

                    {/* QUOTA WIDGET*/}
                    <div className="w-full md:w-auto">
                        <div className="bg-[#1e293b] border border-gray-700 p-3.5 rounded-xl w-full md:w-64 shadow-xl">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                    <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="text-xs font-bold text-gray-300">Vault Status</span>
                                </div>
                                {/* Minimalist File Count Badge */}
                                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black tracking-tight uppercase">
                                    {quota.file_count || 0} FILES
                                </span>
                            </div>

                            {/* MB Used Display - Smaller fonts */}
                            <div className="mb-2.5">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-white">
                                        {formatMB(quota.used || 0)}
                                    </span>
                                    <span className="text-gray-500 font-bold text-xs">MB / 500 MB</span>
                                </div>
                            </div>

                            {/* Thinner Progress Bar (h-1.5) */}
                            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1.5 overflow-hidden border border-gray-700/50">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${quota.percentage || 0}%` }}
                                    // minWidth keeps even tiny files visible
                                    style={{ minWidth: (quota.used > 0) ? '3px' : '0' }}
                                    className={`h-full rounded-full transition-all duration-700 ease-out ${quota.percentage > 90 ? 'bg-red-500' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                                        }`}
                                />
                            </div>

                            {/* Mini Percentage Display */}
                            <div className="flex justify-end text-[10px] font-bold">
                                <span className="text-gray-500">
                                    {(quota.percentage || 0).toFixed(1)}% Full
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Drag and Drop Zone */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1e293b] border border-gray-700 rounded-2xl p-8 shadow-xl"
                >
                    <div
                        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${file ? 'border-blue-500 bg-blue-500/5' : 'border-gray-600 hover:border-gray-500 hover:bg-white/5'}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => !file && fileInputRef.current.click()}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

                        {!file ? (
                            <div className="flex flex-col items-center cursor-pointer">
                                <div className="p-4 bg-gray-800 rounded-full mb-4">
                                    <UploadCloud className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Click or drag file to this area to upload</h3>
                                <p className="text-sm text-gray-400 mt-2">Strictly secured by AES-256 Encryption</p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <File className="w-8 h-8 text-blue-400" />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-white truncate w-48 md:w-96">{file.name}</p>
                                        <p className="text-xs text-gray-400">{formatMB(file.size)} MB</p>
                                    </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); clearFile(); }} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-gray-400 hover:text-white" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleUpload}
                            disabled={!file || isUploading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${!file || isUploading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
                        >
                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                            {isUploading ? 'Encrypting...' : 'Secure & Upload'}
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Dashboard;