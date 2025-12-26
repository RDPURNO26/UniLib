// Initial mock data
export const initialMockData = {
    users: [
        { id: '1', name: 'Dr. Smith', email: 'admin@unilib.edu', password: 'admin', role: 'admin', borrows: [], status: 'active' },
        { id: '2', name: 'Alex Johnson', email: 'alex@student.edu', password: 'alex', role: 'student', borrows: [], status: 'active' },
        { id: '3', name: 'Priya Patel', email: 'priya@student.edu', password: 'priya', role: 'student', borrows: [], status: 'active' },
        { id: '4', name: 'Rahul Sharma', email: 'rahul@student.edu', password: 'rahul', role: 'student', borrows: [], status: 'active' },
        { id: '5', name: 'Sarah Williams', email: 'sarah@student.edu', password: 'sarah', role: 'student', borrows: [], status: 'active' },
        { id: '6', name: 'Michael Chen', email: 'michael@student.edu', password: 'michael', role: 'student', borrows: [], status: 'active' },
        { id: '7', name: 'Emma Davis', email: 'emma@student.edu', password: 'emma', role: 'student', borrows: [], status: 'active' }
    ],
    books: [
        {
            id: '1', title: 'Dune', author: 'Frank Herbert', genre: ['Sci-Fi', 'Adventure'],
            description: 'A epic science fiction novel set in the distant future amidst a feudal interstellar society.',
            cover: 'https://covers.openlibrary.org/b/id/8226455-L.jpg', isbn: '9780441013593',
            totalCopies: 5, availableCopies: 3, publishYear: 1965, pageCount: 412,
            createdAt: '2024-12-01', borrowedCount: 42
        },
        {
            id: '2', title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: ['Fantasy', 'Adventure'],
            description: 'A fantasy novel about the adventures of hobbit Bilbo Baggins.',
            cover: 'https://covers.openlibrary.org/b/id/6979865-L.jpg', isbn: '9780547928227',
            totalCopies: 7, availableCopies: 2, publishYear: 1937, pageCount: 310,
            createdAt: '2024-11-15', borrowedCount: 38
        },
        {
            id: '3', title: '1984', author: 'George Orwell', genre: ['Dystopian', 'Political'],
            description: 'A dystopian social science fiction novel and cautionary tale.',
            cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg', isbn: '9780451524935',
            totalCopies: 6, availableCopies: 4, publishYear: 1949, pageCount: 328,
            createdAt: '2024-12-05', borrowedCount: 51
        },
        {
            id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', genre: ['Romance', 'Classic'],
            description: 'A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet.',
            cover: 'https://covers.openlibrary.org/b/id/7070189-L.jpg', isbn: '9780141439518',
            totalCopies: 8, availableCopies: 6, publishYear: 1813, pageCount: 432,
            createdAt: '2024-11-20', borrowedCount: 29
        },
        {
            id: '5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: ['Classic', 'Tragedy'],
            description: 'A novel about the American dream and the roaring twenties.',
            cover: 'https://covers.openlibrary.org/b/id/8137159-L.jpg', isbn: '9780743273565',
            totalCopies: 6, availableCopies: 3, publishYear: 1925, pageCount: 180,
            createdAt: '2024-12-10', borrowedCount: 45
        }
    ],
    borrowRequests: [],
    searchCache: {},
    chatHistory: []
};

// Initialize localStorage
export const initializeStorage = () => {
    // Users
    let users = JSON.parse(localStorage.getItem('unilib_users') || '[]');
    const adminExists = users.some(u => u.email === 'admin@unilib.edu');

    // Check if we have enough users or if users are missing passwords (schema update)
    const missingPasswords = users.some(u => !u.password);

    if (!users.length || !adminExists || users.length < 7 || missingPasswords) {
        // Reset to initial mock data to ensure we have the requested accounts
        // We chose to reset rather than merge to avoid ID conflicts and stale data
        users = initialMockData.users;
        localStorage.setItem('unilib_users', JSON.stringify(users));
        console.log('UniLib: Storage reset due to missing data or schema update');
    }

    if (!localStorage.getItem('unilib_books')) {
        localStorage.setItem('unilib_books', JSON.stringify(initialMockData.books));
    }
    if (!localStorage.getItem('unilib_borrow_requests')) {
        localStorage.setItem('unilib_borrow_requests', JSON.stringify(initialMockData.borrowRequests));
    }
    if (!localStorage.getItem('unilib_search_cache')) {
        localStorage.setItem('unilib_search_cache', JSON.stringify(initialMockData.searchCache));
    }
    if (!localStorage.getItem('unilib_chat_history')) {
        localStorage.setItem('unilib_chat_history', JSON.stringify(initialMockData.chatHistory));
    }
    if (!localStorage.getItem('unilib_theme')) {
        localStorage.setItem('unilib_theme', 'dark');
    }
};

// Gemini API simulation
export const simulateGeminiAPI = async (query) => {
    // Mock response for book recommendations
    const mockBooks = JSON.parse(localStorage.getItem('unilib_books') || '[]').slice(0, 3);

    return {
        candidates: [{
            content: {
                parts: [{
                    text: JSON.stringify({
                        books: mockBooks.map(book => ({
                            title: book.title,
                            author: book.author,
                            reason: `Because you showed interest in ${query.includes('Dune') ? 'sci-fi epics' : 'classic literature'}`,
                            cover: book.cover
                        })),
                        response: `As your witty librarian, I recommend these 3 books based on "${query}":`
                    })
                }]
            }
        }]
    };
};

// Google Books API simulation
export const simulateGoogleBooksAPI = async (query, maxResults = 40) => {
    const cached = JSON.parse(localStorage.getItem('unilib_search_cache') || '{}');
    const cacheKey = `${query}-${maxResults}`;

    if (cached[cacheKey] && Date.now() - cached[cacheKey].timestamp < 3600000) {
        return cached[cacheKey].data;
    }

    // Mock search results
    const mockResults = {
        items: Array.from({ length: Math.min(maxResults, 10) }, (_, i) => ({
            id: `mock-${i}`,
            volumeInfo: {
                title: `${query} Book ${i + 1}`,
                authors: [`Author ${i + 1}`],
                description: `Description for ${query} book ${i + 1}`,
                imageLinks: { thumbnail: `https://covers.openlibrary.org/b/id/${8226455 + i}-L.jpg` },
                pageCount: 200 + (i * 20),
                publishedDate: `${2000 + i}`,
                categories: i % 2 === 0 ? ['Fiction', 'Sci-Fi'] : ['Non-Fiction', 'History']
            }
        }))
    };

    // Update cache
    cached[cacheKey] = { data: mockResults, timestamp: Date.now() };
    localStorage.setItem('unilib_search_cache', JSON.stringify(cached));

    return mockResults;
};
