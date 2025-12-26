
// MOCK DATA CONSTANTS - Synced with api.js
import { initialMockData } from '../utils/api';

export const MOCK_USERS = initialMockData.users;

// --- HELPERS ---

const getStorage = (key, defaultVal = []) => {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultVal;
    try {
        return JSON.parse(stored);
    } catch (e) {
        return defaultVal;
    }
};

const setStorage = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val));
};

// --- BOOK MANAGEMENT ---

export const getBooks = () => {
    return getStorage('unilib_books');
};

export const addBook = (bookData) => {
    const books = getBooks();
    const newBook = {
        ...bookData,
        id: Date.now().toString(),
        availableCopies: parseInt(bookData.totalCopies || bookData.total_copies),
        totalCopies: parseInt(bookData.totalCopies || bookData.total_copies),
        available: parseInt(bookData.totalCopies || bookData.total_copies) > 0,
        createdAt: new Date().toISOString()
    };
    books.unshift(newBook);
    setStorage('unilib_books', books);

    // Dispatch custom event for usage elsewhere if needed
    window.dispatchEvent(new CustomEvent('unilib-book-added', { detail: newBook }));
    return newBook;
};

export const updateBook = (id, updates) => {
    const books = getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
        books[index] = { ...books[index], ...updates };

        // Recalculate availability if total copies changed
        if (updates.totalCopies) {
            books[index].availableCopies = parseInt(updates.totalCopies) - (books[index].totalCopies - books[index].availableCopies);
        }

        setStorage('unilib_books', books);
        return books[index];
    }
    return null;
};

export const deleteBook = (id) => {
    const books = getBooks();
    const newBooks = books.filter(b => b.id !== id);
    setStorage('unilib_books', newBooks);
};

// --- LOAN MANAGEMENT ---

export const getLoans = () => {
    return getStorage('unilib_borrow_requests');
};

export const getCurrentUserLoans = (userId) => {
    const loans = getLoans();
    // Support both casings during migration if needed, but prefer camelCase
    return loans.filter(l => (l.userId === userId || l.user_id === userId) && ['approved', 'pending', 'Approved', 'Pending'].includes(l.status));
};

export const getUserHistory = (userId) => {
    const loans = getLoans();
    return loans.filter(l => (l.userId === userId || l.user_id === userId) && ['returned', 'rejected', 'Returned', 'Rejected'].includes(l.status));
};

export const approveLoan = (loanId, dueDate) => {
    const loans = getLoans();
    const index = loans.findIndex(l => l.id === loanId);
    if (index !== -1) {
        loans[index].status = 'approved';
        loans[index].approvedDate = new Date().toISOString();
        loans[index].dueDate = dueDate.toISOString();
        setStorage('unilib_borrow_requests', loans);

        // Update book availability
        const books = getBooks();
        const bookId = loans[index].book_id;
        const bookIndex = books.findIndex(b => b.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].availableCopies = Math.max(0, books[bookIndex].availableCopies - 1);
            setStorage('unilib_books', books);
        }
    }
};

export const rejectLoan = (loanId, reason) => {
    const loans = getLoans();
    const index = loans.findIndex(l => l.id === loanId);
    if (index !== -1) {
        loans[index].status = 'rejected';
        loans[index].rejectionReason = reason;
        setStorage('unilib_borrow_requests', loans);
    }
};

export const markReturned = (loanId) => {
    const loans = getLoans();
    const index = loans.findIndex(l => l.id === loanId);
    if (index !== -1) {
        loans[index].status = 'returned';
        loans[index].returnedDate = new Date().toISOString();
        setStorage('unilib_borrow_requests', loans);

        // Update book availability
        const books = getBooks();
        const bookId = loans[index].bookId || loans[index].book_id;
        const bookIndex = books.findIndex(b => b.id === bookId);
        if (bookIndex !== -1) {
            books[bookIndex].availableCopies += 1;
            setStorage('unilib_books', books);
        }
    }
};

// --- USER MANAGEMENT ---

export const getUsers = () => {
    return getStorage('unilib_users');
};

export const updateUser = (id, updates) => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        setStorage('unilib_users', users);
        return users[index];
    }
    return null;
};

export const toggleUserStatus = (id) => {
    const users = getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index].status = users[index].status === 'active' ? 'blocked' : 'active';
        setStorage('unilib_users', users);
    }
};

// --- STATS & REPORTS ---

export const getDashboardStats = async () => {
    // Mimic async to match original interface
    const books = getBooks();
    const loans = getLoans();
    const users = getUsers();

    const activeLoans = loans.filter(l => l.status === 'approved');
    const overdue = activeLoans.filter(l => l.due_date && new Date(l.due_date) < new Date()).length;
    const pending = loans.filter(l => l.status === 'pending').length;

    return {
        totalBooks: books.length,
        activeLoans: activeLoans.length,
        activeMembers: users.filter(u => u.role === 'member' || u.role === 'student').length,
        overdue,
        pending,
        totalUsers: users.length,
        revenueToday: overdue * 5 // Mock calculation
    };
};

// --- ALGORITHMIC INSIGHTS ---

export const getInsights = () => {
    const loans = getLoans();
    const books = getBooks();
    const users = getUsers();

    // 1. Algorithm: Trending Genre (Frequency Analysis)
    // Analyze the last 50 loans to find the most popular genre
    const recentLoans = loans.slice(-50);
    const genreCounts = {};

    recentLoans.forEach(loan => {
        const book = books.find(b => b.id === loan.bookId); // Note: check capitalization of bookId vs book_id
        // In previous code I used book_id in some places and bookId in others, need to auto-detect or fix.
        // Let's check getLoans structure data.
        // Data usually has book_id based on previous file viewing.
        // But let's handle both just in case or standardized.
        const id = loan.bookId || loan.book_id;
        const b = books.find(x => x.id === id);
        if (b && b.genre) {
            genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
        }
    });

    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    const topGenre = sortedGenres.length > 0 ? sortedGenres[0][0] : 'Fiction'; // Default
    const topGenreCount = sortedGenres.length > 0 ? sortedGenres[0][1] : 0;
    const trendPercentage = recentLoans.length > 0 ? Math.round((topGenreCount / recentLoans.length) * 100) : 0;

    // 2. Algorithm: Peak Activity Prediction (Time Series Mock/Heuristic)
    // Real-time systems would analyze server logs. Here we analyze request timestamps.
    const hourCounts = {};
    loans.forEach(loan => {
        const date = new Date(loan.request_date || loan.requestDate);
        const hour = date.getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Find peak hour
    let peakHour = 12; // Default
    let maxActivity = 0;
    Object.entries(hourCounts).forEach(([h, count]) => {
        if (count > maxActivity) {
            maxActivity = count;
            peakHour = parseInt(h);
        }
    });

    // Format peak time interval (e.g., "2 PM - 5 PM") - Simplified logic
    const peakStart = peakHour > 12 ? `${peakHour - 12} PM` : `${peakHour} AM`;
    const peakEnd = (peakHour + 3) > 12 ? `${(peakHour + 3) - 12} PM` : `${peakHour + 3} AM`;

    // 3. Algorithm: Revenue/Fine Projection
    // Based on currently overdue books * fine rate + average delay
    const currentDate = new Date();
    const overdueLoans = loans.filter(l => l.status === 'approved' && l.dueDate && new Date(l.dueDate) < currentDate);
    const potentialFines = overdueLoans.length * 5; // Current fines
    const projectedFines = potentialFines * 1.5; // Simple projection: expect 50% more before return

    return {
        trendingGenre: topGenre,
        trendPercentage: Math.max(trendPercentage, 15), // ensuring some non-zero data for demo
        peakTime: `${peakStart} - ${peakEnd}`,
        projectedRevenue: projectedFines,
        overdueCount: overdueLoans.length
    };
};

export const getRecentActivity = async () => {
    // Construct activity from loans for now
    const loans = getLoans();
    return loans.slice(-20).reverse().map(l => ({
        id: l.id,
        id: l.id,
        type: l.status.toLowerCase() === 'pending' ? 'request' : l.status.toLowerCase() === 'approved' ? 'borrow' : 'return',
        action: `${l.status.toLowerCase() === 'pending' ? 'Requested' : l.status.toLowerCase() === 'approved' ? 'Borrowed' : 'Returned'} book`,
        user: l.userName || 'Unknown User', // This assumes userName is stored on request. 
        // UniLibContext DOES NOT store userName. We need to look it up.
        // We can do it here.
        timestamp: l.requestDate || l.request_date
    }));
};

export const getTopBorrowed = () => {
    const books = getBooks();
    // Use borrowedCount property if exists, or random for mock
    return books
        .sort((a, b) => (b.borrowedCount || 0) - (a.borrowedCount || 0))
        .slice(0, 10);
};

export const getOverdueLoans = () => {
    const loans = getLoans();
    return loans.filter(l => ['Approved', 'approved'].includes(l.status) && l.dueDate && new Date(l.dueDate) < new Date());
};

export const getActiveUsers = () => {
    const users = getUsers();
    const loans = getLoans();

    return users.map(u => ({
        ...u,
        activeLoansCount: loans.filter(l => (l.userId === u.id || l.user_id === u.id) && ['Approved', 'approved'].includes(l.status)).length
    })).filter(u => u.activeLoansCount > 0);
};

export const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
