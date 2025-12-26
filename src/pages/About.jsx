import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-5xl font-bold text-white mb-8">
                    About <span className="text-amber-400">UniLib</span>
                </h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                    UniLib is a premium library management system designed for modern educational institutions.
                    We combine cutting-edge technology with a passion for literature to create an unparalleled
                    borrowing experience.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {[
                        { title: 'Digital Innovation', desc: 'AI-powered recommendations and digital management' },
                        { title: 'Vast Collection', desc: 'Thousands of books across all genres and subjects' },
                        { title: 'Smart Access', desc: '24/7 availability with intelligent search and filters' }
                    ].map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-lg 
                       border border-amber-500/30 rounded-2xl p-6"
                        >
                            <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <Star className="w-8 h-8 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default About;
