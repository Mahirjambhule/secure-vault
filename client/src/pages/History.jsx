import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Loader2, ShieldAlert, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = window.location.hostname === "localhost" 
  ? "http://127.0.0.1:5000" 
  : "https://secure-vault-u2pt.onrender.com";

const History = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingFile, setDownloadingFile] = useState(null);

    // 1. Memoized fetchFiles so it's stable and accessible everywhere
    const fetchFiles = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/files`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setFiles(response.data.files || []); 
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // Handle Download
    const handleDownload = async (filename) => {
        setDownloadingFile(filename);
        const toastId = toast.loading(`Decrypting ${filename}...`);
        try {
            const response = await axios.get(`${API_URL}/download/${filename}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Decryption successful!', { id: toastId });
        } catch (error) {
            toast.error('Decryption failed.', { id: toastId });
        } finally {
            setDownloadingFile(null);
        }
    };

    // Handle Delete
    const handleDelete = async (fileId) => {
        if (!fileId) return toast.error("Invalid File ID");
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;
        
        try {
            const token = localStorage.getItem('token');
            // Sending the MongoDB _id to the backend
            await axios.delete(`${API_URL}/delete/${fileId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success("File deleted successfully");
            fetchFiles(); // Reload the list
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Failed to delete file.");
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12 bg-[#0f172a]">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Your Secure Vault</h1>
                    <p className="text-gray-400 mt-2">View and decrypt your secured files.</p>
                </div>

                <div className="bg-[#1e293b] border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
                    {isLoading ? (
                        <div className="p-12 flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                            <p className="text-gray-400">Unlocking vault...</p>
                        </div>
                    ) : files.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center text-center">
                            <ShieldAlert className="w-12 h-12 text-gray-500 mb-4" />
                            <h3 className="text-xl font-semibold text-white">Vault is Empty</h3>
                            <p className="text-gray-400 mt-2">No encrypted files found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-800/50 border-b border-gray-700">
                                        <th className="p-4 font-semibold text-gray-300">Filename</th>
                                        <th className="p-4 font-semibold text-gray-300">Date Secured</th>
                                        <th className="p-4 font-semibold text-gray-300 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file, index) => (
                                        <motion.tr
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={file._id}
                                            className="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="p-4 flex items-center gap-3 text-white">
                                                <FileText className="w-5 h-5 text-blue-400" />
                                                <span className="truncate max-w-xs">{file.filename}</span>
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm">
                                                {file.timestamp}
                                            </td>
                                            <td className="p-4 text-right flex justify-end gap-3">
                                                <button
                                                    onClick={() => handleDownload(file.filename)}
                                                    disabled={downloadingFile === file.filename}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50"
                                                >
                                                    {downloadingFile === file.filename ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4" />
                                                    )}
                                                    Download
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(file._id)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all text-sm font-medium"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;