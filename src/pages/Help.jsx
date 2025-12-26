import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const Help = () => {
    const faqs = [
        { question: 'How do I borrow a book?', answer: 'Search for a book, click on it, and press the "Borrow Now" button.' },
        { question: 'What is the borrowing period?', answer: 'Books can be borrowed for 14 days, with an option to renew.' },
        { question: 'How do I return a book?', answer: 'Go to My Account > Current Loans and click the "Return" button.' },
        { question: 'Can I suggest a book for purchase?', answer: 'Yes! Contact our library staff with your suggestion.' }
    ];

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-5xl font-bold text-white mb-12 text-center">Help & FAQ</h1>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={faq.question}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg 
                       border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/50 
                       transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">{faq.question}</h3>
                                <ChevronDown className="w-5 h-5 text-amber-400" />
                            </div>
                            <p className="text-gray-400 mt-3">{faq.answer}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 p-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl 
                      border border-amber-500/30 text-center">
                    <HelpCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Need More Help?</h3>
                    <p className="text-gray-400 mb-6">Our support team is here to assist you 24/7</p>
                    <button className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 
                           font-semibold rounded-full transition-all hover:scale-105">
                        Contact Support
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Help;
