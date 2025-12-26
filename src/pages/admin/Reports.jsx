import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, AlertCircle, Users as UsersIcon, BookOpen } from 'lucide-react';
import { getTopBorrowed, getOverdueLoans, getActiveUsers, exportToCSV } from '../../services/library';

const Reports = () => {
    const [topBooks, setTopBooks] = useState([]);
    const [overdueLoans, setOverdueLoans] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);

    useEffect(() => {
        setTopBooks(getTopBorrowed());
        setOverdueLoans(getOverdueLoans());
        setActiveUsers(getActiveUsers());
    }, []);

    const handleExport = (type) => {
        let data, filename;
        switch (type) {
            case 'top':
                data = topBooks.map(b => ({
                    Title: b.title,
                    Author: b.author,
                    'Borrow Count': b.borrowCount
                }));
                filename = 'top_borrowed_books.csv';
                break;
            case 'overdue':
                data = overdueLoans.map(l => ({
                    'Book Title': l.title,
                    'Student Name': l.userName,
                    'Due Date': new Date(l.due_date).toLocaleDateString(),
                    'Days Overdue': Math.ceil((new Date() - new Date(l.due_date)) / (1000 * 60 * 60 * 24))
                }));
                filename = 'overdue_books.csv';
                break;
            case 'active':
                data = activeUsers.map(u => ({
                    'Student ID': u.id,
                    Name: u.name,
                    Email: u.email,
                    'Active Loans': u.activeLoansCount
                }));
                filename = 'active_users.csv';
                break;
        }
        exportToCSV(data, filename);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
                <p className="text-gray-400 mt-1">View library statistics and export data</p>
            </div>

            {/* Top Borrowed Books */}
            <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-primary" />
                            Top 10 Borrowed Books
                        </h3>
                    </div>
                    <button
                        onClick={() => handleExport('top')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medium"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Rank</th>
                                <th className="px-6 py-3">Book Title</th>
                                <th className="px-6 py-3">Author</th>
                                <th className="px-6 py-3 text-right">Times Borrowed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {topBooks.map((book, index) => (
                                <tr key={book.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${index < 3 ? 'text-primary' : 'text-white'}`}>
                                            #{index + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white font-semibold">{book.title}</td>
                                    <td className="px-6 py-4">{book.author}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full font-bold">
                                            {book.borrowCount}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {topBooks.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No data available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Overdue Books */}
            <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <AlertCircle className="text-red-400" />
                            Overdue Books
                        </h3>
                    </div>
                    <button
                        onClick={() => handleExport('overdue')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Book Title</th>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Due Date</th>
                                <th className="px-6 py-3 text-right">Days Overdue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {overdueLoans.map((loan) => {
                                const daysOverdue = Math.ceil((new Date() - new Date(loan.due_date)) / (1000 * 60 * 60 * 24));
                                return (
                                    <tr key={loan.id} className="bg-red-500/5 hover:bg-red-500/10 transition-colors">
                                        <td className="px-6 py-4 text-white font-medium">{loan.title}</td>
                                        <td className="px-6 py-4">{loan.userName}</td>
                                        <td className="px-6 py-4">{new Date(loan.due_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full font-bold">
                                                {daysOverdue} days
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {overdueLoans.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <BookOpen size={48} className="text-green-500/20" />
                                            <p>No overdue books! 🎉</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Active Users */}
            <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <UsersIcon className="text-green-400" />
                            Active Users
                        </h3>
                    </div>
                    <button
                        onClick={() => handleExport('active')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-medium"
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Student ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3 text-right">Active Loans</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {activeUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white font-medium">{user.id}</td>
                                    <td className="px-6 py-4 text-white">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-bold">
                                            {user.activeLoansCount}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {activeUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No active users currently.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
