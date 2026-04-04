import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Loader2, ShieldAlert, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const History = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingFile, setDownloadingFile] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/files', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                setFiles(response.data.files);
            } catch (error) {
                toast.error("Failed to load vault history.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFiles();
    }, []);

    // Handle the Download & Decrypt process
    const handleDownload = async (filename) => {
        setDownloadingFile(filename);
        const toastId = toast.loading(`Decrypting ${filename}...`);

        try {
            const response = await axios.get(`http://127.0.0.1:5000/download/${filename}`, {
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
            toast.error('Decryption failed or file corrupted.', { id: toastId });
        } finally {
            setDownloadingFile(null);
        }
    };

    // Handle the Deletion process
    const handleDelete = async (filename) => {
        if (!window.confirm(`Are you sure you want to completely destroy ${filename}? This action cannot be reversed.`)) {
            return;
        }

        const toastId = toast.loading(`Shredding ${filename}...`);

        try {
            await axios.delete(`http://127.0.0.1:5000/delete/${filename}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            setFiles(files.filter(file => file.filename !== filename));

            toast.success('Data securely destroyed.', { id: toastId });
        } catch (error) {
            toast.error('Failed to destroy file.', { id: toastId });
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 pb-12">
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
                            <p className="text-gray-400 mt-2">You haven't encrypted any files yet.</p>
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
                                            transition={{ delay: index * 0.1 }}
                                            key={index}
                                            className="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="p-4 flex items-center gap-3 text-white">
                                                <FileText className="w-5 h-5 text-blue-400" />
                                                {file.filename}
                                            </td>
                                            <td className="p-4 text-gray-400 text-sm">
                                                {file.timestamp}
                                            </td>
                                            <td className="p-4 text-right flex justify-end gap-3">
                                                {/* Download Button */}
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

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => handleDelete(file.filename)}
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