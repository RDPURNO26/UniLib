import React, { useState, useEffect } from 'react';
import { Check, X, Calendar, Clock, User, BookOpen, Filter, Search } from 'lucide-react';
import { getLoans, approveLoan, rejectLoan, markReturned, MOCK_USERS } from '../../services/library';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const BorrowRequests = () => {
    const [requests, setRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [dueDate, setDueDate] = useState('');
    const [filter, setFilter] = useState('pending');
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchRequests = () => {
        const allLoans = getLoans();
        const enriched = allLoans.map(req => {
            const user = MOCK_USERS.find(u => u.id === req.user_id);
            return { ...req, userName: user ? user.name : 'Unknown User' };
        });
        setRequests(enriched);
    };

    useEffect(() => {
        fetchRequests();
        const date = new Date();
        date.setDate(date.getDate() + 14);
        setDueDate(date.toISOString().split('T')[0]);
    }, []);

    const filteredRequests = requests
        .filter(r => filter === 'all' ? true : r.status.toLowerCase() === filter.toLowerCase())
        .filter(r =>
            (r.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.title || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleApprove = () => {
        if (!selectedRequest || !dueDate) return;

        try {
            approveLoan(selectedRequest.id, new Date(dueDate));

            // Confetti celebration!
            confetti({
                particleCount: 100,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#f59e0b', '#fbbf24', '#fcd34d']
            });

            toast.success("Request approved successfully! 🎉");
            setSelectedRequest(null);
            fetchRequests();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;

        const date = new Date();
        date.setDate(date.getDate() + 14);

        selectedIds.forEach(id => {
            try {
                approveLoan(id, date);
            } catch (error) {
                console.error(error);
            }
        });

        // Confetti celebration!
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#fbbf24', '#fcd34d']
        });

        toast.success(`🎉 ${selectedIds.length} requests approved in bulk!`);
        setSelectedIds([]);
        fetchRequests();
    };

    const handleBulkReject = () => {
        if (selectedIds.length === 0) return;

        const reason = prompt("Enter rejection reason for all selected requests:");
        if (!reason || !reason.trim()) {
            toast.error("Rejection cancelled - reason is required");
            return;
        }

        selectedIds.forEach(id => {
            try {
                rejectLoan(id, reason);
            } catch (error) {
                console.error(error);
            }
        });

        toast.success(`${selectedIds.length} requests rejected`);
        setSelectedIds([]);
        fetchRequests();
    };

    const handleReject = (request) => {
        if (!rejectReason.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        try {
            rejectLoan(request.id, rejectReason);
            toast.success("Request rejected");
            setShowRejectModal(null);
            setRejectReason('');
            fetchRequests();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleMarkReturned = (loanId) => {
        if (window.confirm("Mark this book as returned?")) {
            try {
                markReturned(loanId);
                toast.success("Book marked as returned ✅");
                fetchRequests();
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredRequests.filter(r => r.status === 'pending').length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredRequests.filter(r => r.status === 'pending').map(r => r.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Borrow Requests</h1>
                    <p className="text-gray-400 mt-1">Manage student loan requests</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by student name or book title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-xl"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:border-primary backdrop-blur-xl"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="returned">Returned</option>
                        <option value="all">All Requests</option>
                    </select>
                </div>
            </div>

            {/* Premium Table */}
            <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-200 bg-white/5 border-b border-white/10 text-xs uppercase font-bold tracking-wider">
                                <th className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.length === filteredRequests.filter(r => r.status === 'pending').length && filteredRequests.filter(r => r.status === 'pending').length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                                    />
                                </th>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">Book</th>
                                <th className="px-6 py-4">Requested</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredRequests.map((req, i) => (
                                <tr
                                    key={req.id}
                                    className={`transition-all hover:bg-primary/5 ${i % 2 === 0 ? 'bg-zinc-900/30' : 'bg-transparent'}`}
                                >
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(req.id)}
                                            onChange={() => toggleSelect(req.id)}
                                            disabled={req.status !== 'pending'}
                                            className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center text-white font-bold shadow-lg">
                                                {req.userName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{req.userName}</p>
                                                <p className="text-xs text-gray-500">ID: {req.user_id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={req.cover} className="w-10 h-14 object-cover rounded-lg shadow-lg" alt={req.title} />
                                            <p className="font-medium text-white">{req.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-500" />
                                            {new Date(req.request_date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${req.status === 'pending' ? 'bg-primary/20 text-primary border border-primary/20' :
                                            req.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                                req.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                    'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                            }`}>
                                            {req.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {req.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => setSelectedRequest(req)}
                                                        className="bg-amber-500 text-gray-900 px-4 py-2 rounded-xl font-bold shadow-md hover:bg-amber-400 transition-all text-xs"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setShowRejectModal(req)}
                                                        className="text-red-400 hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-all text-xs font-medium border border-transparent hover:border-red-500/20"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {req.status === 'approved' && (
                                                <button
                                                    onClick={() => handleMarkReturned(req.id)}
                                                    className="bg-blue-500/20 text-blue-400 border border-blue-500/50 px-4 py-2 rounded-xl font-bold shadow-md hover:bg-blue-500/30 transition-all text-xs"
                                                >
                                                    Mark Returned
                                                </button>
                                            )}
                                            {req.status === 'rejected' && req.rejection_reason && (
                                                <span className="text-xs text-gray-500 italic">
                                                    "{req.rejection_reason}"
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <BookOpen size={48} className="text-gray-700 opacity-50" />
                                            <p>No {filter !== 'all' ? filter : ''} requests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Approval Modal */}
            <div>
                {selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div
                            className="glass-card w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Approve Loan Request</h3>
                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Student</p>
                                        <p className="text-white font-bold text-lg">{selectedRequest.userName}</p>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div>
                                        <p className="text-sm text-gray-400">Book</p>
                                        <p className="text-white font-bold text-lg">{selectedRequest.title}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Set Due Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="date"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setSelectedRequest(null)}
                                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        className="flex-1 py-3 rounded-xl bg-amber-500 text-gray-900 font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={20} />
                                        Approve Loan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            <div>
                {showRejectModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div
                            className="glass-card w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Reject Request</h3>
                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-400">Student</p>
                                        <p className="text-white font-bold text-lg">{showRejectModal.userName}</p>
                                    </div>
                                    <div className="h-px bg-white/10" />
                                    <div>
                                        <p className="text-sm text-gray-400">Book</p>
                                        <p className="text-white font-bold text-lg">{showRejectModal.title}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Reason for Rejection
                                    </label>
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Enter reason..."
                                        rows="4"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowRejectModal(null);
                                            setRejectReason('');
                                        }}
                                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleReject(showRejectModal)}
                                        className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                    >
                                        Confirm Rejection
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating Bulk Actions Bar */}
            <div>
                {selectedIds.length > 0 && (
                    <div
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-primary/50 rounded-2xl p-6 shadow-2xl z-50"
                    >
                        <p className="text-white font-bold mb-3 text-center">
                            {selectedIds.length} request{selectedIds.length > 1 ? 's' : ''} selected
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleBulkApprove}
                                className="bg-amber-500 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/30 flex items-center gap-2"
                            >
                                <CheckCircle size={20} />
                                Approve All
                            </button>
                            <button
                                onClick={handleBulkReject}
                                className="bg-red-500/20 text-red-400 border border-red-500/50 px-6 py-3 rounded-xl font-bold hover:bg-red-500/30 transition-all flex items-center gap-2"
                            >
                                <X size={20} />
                                Reject All
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BorrowRequests;
