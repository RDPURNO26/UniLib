import React, { useState, useEffect } from 'react';
import { Edit2, Lock, Unlock, X, Search, User, Mail, Shield, Activity } from 'lucide-react';
import { getUsers, updateUser, toggleUserStatus } from '../../services/library';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = () => {
        try {
            const data = getUsers();
            if (Array.isArray(data)) {
                setUsers(data);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ ...user });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateUser(editingUser.id, formData);
        setEditingUser(null);
        fetchUsers();
        toast.success('User updated successfully');
    };

    const handleToggleStatus = (id) => {
        toggleUserStatus(id);
        fetchUsers();
        toast.success('User status updated');
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <p className="text-gray-400 mt-1">Manage student accounts and permissions</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-primary w-full md:w-64"
                    />
                </div>
            </div>

            <div className="glass-card rounded-xl border border-white/10 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Active Borrows</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                        <User size={48} className="mx-auto mb-3 opacity-20" />
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                            {filteredUsers.map((user, index) => (
                                <tr key={user.id} className={`transition-colors hover:bg-primary/5 ${index % 2 === 0 ? 'bg-zinc-900/30' : 'bg-transparent'}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-600 flex items-center justify-center text-white font-bold shadow-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{user.name}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Mail size={10} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'
                                            }`}>
                                            <Shield size={10} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase ${user.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'
                                            }`}>
                                            <Activity size={10} />
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-white font-bold text-lg">
                                            {user.borrows ? user.borrows.filter(b => b.status === 'approved').length : 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Edit user"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(user.id)}
                                                className={`p-2 rounded-lg transition-colors ${user.status === 'active'
                                                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                                    : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                                                    }`}
                                                title={user.status === 'active' ? 'Block user' : 'Unblock user'}
                                            >
                                                {user.status === 'active' ? <Lock size={18} /> : <Unlock size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <div>
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div
                            className="glass-card w-full max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Edit User</h3>
                                <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name || ''}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Password <span className="text-gray-500 font-normal">(leave blank to keep current)</span></label>
                                    <input
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        placeholder="Enter new password"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role || 'member'}
                                        onChange={handleChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setEditingUser(null)}
                                        className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-2.5 rounded-xl bg-amber-500 text-gray-900 font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
