import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUniLib } from '../context/UniLibContext';

import { getCurrentUserLoans, getUserHistory, getBooks, markReturned } from '../services/library';

const MyAccount = () => {
    const { currentUser } = useUniLib();
    const [activeTab, setActiveTab] = useState('loans');
    const [userLoans, setUserLoans] = useState([]);
    const [borrowHistory, setBorrowHistory] = useState([]);
    const [books, setBooks] = useState([]);

    const fetchData = () => {
        if (currentUser) {
            const allBooks = getBooks();
            setBooks(allBooks);

            const loans = getCurrentUserLoans(currentUser.id).map(loan => {
                const book = allBooks.find(b => b.id === (loan.book_id || loan.bookId)) || {};
                return {
                    ...loan,
                    title: loan.title || book.title || 'Unknown Book',
                    cover: loan.cover || book.cover,
                    // format dates
                    borrowDate: loan.request_date ? new Date(loan.request_date).toLocaleDateString() : 'N/A',
                    dueDate: loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'Pending Approval'
                };
            });
            setUserLoans(loans);

            const history = getUserHistory(currentUser.id).map(loan => {
                const book = allBooks.find(b => b.id === (loan.book_id || loan.bookId)) || {};
                return {
                    ...loan,
                    title: loan.title || book.title || 'Unknown Book',
                    cover: loan.cover || book.cover,
                    borrowDate: loan.request_date ? new Date(loan.request_date).toLocaleDateString() : 'N/A',
                    dueDate: loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : 'N/A'
                };
            });
            setBorrowHistory(history);
        }
    };

    useEffect(() => {
        fetchData();
        // Set up an interval to refresh data periodically to catch admin approvals
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [currentUser]);

    const handleReturn = (loanId) => {
        markReturned(loanId);
        fetchData(); // Refresh immediately
    };

    if (!currentUser) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-6">Please Login</h1>
                <p className="text-gray-400 mb-8">You need to login to access your account</p>
                <Link
                    to="/login"
                    className="inline-block px-8 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 
                   font-semibold rounded-full transition-all hover:scale-105"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-lg 
                      border border-amber-500/30 rounded-3xl p-8 mb-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full 
                            flex items-center justify-center text-3xl font-bold text-gray-900">
                                {currentUser.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{currentUser.name}</h1>
                                <p className="text-gray-300">{currentUser.email}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                    <span className="px-4 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                                        {currentUser.role}
                                    </span>
                                    <span className="text-gray-400">ID: {currentUser.id}</span>
                                </div>
                            </div>
                        </div>
                        <button className="px-6 py-3 border border-amber-500/30 text-amber-400 
                             hover:bg-amber-500/10 rounded-xl transition-all">
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-8 border-b border-gray-800">
                    {['loans', 'history', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-medium capitalize transition-all ${activeTab === tab
                                ? 'text-amber-400 border-b-2 border-amber-400'
                                : 'text-gray-400 hover:text-gray-300'}`}
                        >
                            {tab === 'loans' ? 'Current Loans' :
                                tab === 'history' ? 'Borrow History' : 'Settings'}
                        </button>
                    ))}
                </div>

                {/* Current Loans */}
                {activeTab === 'loans' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {userLoans.map((loan, idx) => (
                            <div
                                key={loan.id}
                                className="bg-gradient-to-r from-gray-900/60 to-gray-800/60 backdrop-blur-lg 
                         border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 
                         transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={loan.cover}
                                            alt={loan.title}
                                            className="w-16 h-24 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{loan.title}</h3>
                                            <div className="flex items-center space-x-6 mt-2">
                                                <div>
                                                    <p className="text-sm text-gray-400">Borrow Date</p>
                                                    <p className="text-white">{loan.borrowDate}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Due Date</p>
                                                    <p className={`${loan.status.toLowerCase() === 'pending' ? 'text-yellow-400' :
                                                        loan.status.toLowerCase() === 'approved' ? 'text-green-400' :
                                                            'text-red-400'}`}>
                                                        {loan.dueDate}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <span className={`px-4 py-2 rounded-full ${loan.status.toLowerCase() === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            loan.status.toLowerCase() === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                'bg-red-500/20 text-red-400'}`}>
                                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                                        </span>
                                        {loan.status.toLowerCase() === 'approved' && (
                                            <button
                                                onClick={() => handleReturn(loan.id)}
                                                className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 
                                       font-semibold rounded-lg transition-all">
                                                Return
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Borrow History */}
                {activeTab === 'history' && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="py-4 text-left text-gray-400">Book</th>
                                    <th className="py-4 text-left text-gray-400">Borrow Date</th>
                                    <th className="py-4 text-left text-gray-400">Due Date</th>
                                    <th className="py-4 text-left text-gray-400">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowHistory.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/20">
                                        <td className="py-4">
                                            <div className="flex items-center space-x-3">
                                                <img
                                                    src={item.cover}
                                                    alt={item.title}
                                                    className="w-12 h-16 object-cover rounded"
                                                />
                                                <span className="text-white">{item.title}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-gray-300">{item.borrowDate}</td>
                                        <td className="py-4 text-gray-300">{item.dueDate}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm ${item.status.toLowerCase() === 'returned' ? 'bg-gray-500/20 text-gray-400' :
                                                item.status.toLowerCase() === 'approved' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-yellow-500/20 text-yellow-400'}`}>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Settings */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl">
                        <div className="space-y-6">
                            <div className="bg-gray-900/60 p-6 rounded-2xl border border-amber-500/20">
                                <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue={currentUser.name}
                                            className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg 
                               text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Email</label>
                                        <input
                                            type="email"
                                            defaultValue={currentUser.email}
                                            className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg 
                               text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/60 p-6 rounded-2xl border border-amber-500/20">
                                <h3 className="text-xl font-bold text-white mb-4">Security</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg 
                               text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 mb-2">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg 
                               text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 
                               font-semibold rounded-xl transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default MyAccount;
