import React from 'react';
import { Link } from 'react-router-dom'; 
import { FaGithub, FaLinkedin, FaGlobe } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-gray-300 py-8 px-4 sm:px-6 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

                <div className="flex flex-col items-center md:items-start">
                    <h3 className="text-xl font-bold text-white mb-2">Trip Genius AI</h3>
                    <p className="text-sm">
                        Crafting your perfect journey with the power of artificial intelligence.
                        Plan smarter, travel better.
                    </p>
                    <div className="flex space-x-4 mt-4">

                        <a href="https://github.com/smit1630" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                            <FaGithub size={24} />
                        </a>
                        <a href="https://linkedin.com/in/smit-movadiya" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                            <FaLinkedin size={24} />
                        </a>

                        <a href="https://x.com/being_smovadiya" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                            <FaX size={24} />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                        <li><Link to="/create-trip" className="hover:text-blue-400 transition-colors">Create a Trip</Link></li>
                        <li><Link to="/my-trips" className="hover:text-blue-400 transition-colors">My Trips</Link></li>
                        <li><a href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                    </ul>
                </div>


                <div className="flex flex-col items-center md:items-end">
                    <h3 className="text-lg font-semibold text-white mb-4">Ready to Explore?</h3>
                    <p className="text-sm mb-4">
                        Let AI revolutionize your travel planning.
                    </p>
                    <Link to="/create-trip">
                        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-md">
                            Plan Your Next Adventure
                        </button>
                    </Link>

                </div>

            </div>

            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Trip Genius AI. All rights reserved. | Created with &hearts; by Smit Movadiya.
            </div>
        </footer>
    );
};

export default Footer;