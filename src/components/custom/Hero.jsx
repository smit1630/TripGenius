import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-16 text-center overflow-hidden">

            <div className="absolute inset-0 z-0 opacity-10">

                <img
                    src="/hero-background.jpg"
                    alt="Scenic travel destination background"
                    className="w-full h-full object-cover"
                />

            </div>

            <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto gap-8 md:gap-10">
                <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
                        Craft Your Perfect Journey
                    </span>
                    <br />
                    with AI-Powered Itineraries
                </h1>

                <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
                    Say goodbye to travel planning stress! Our intelligent assistant creates custom, detailed itineraries tailored to your unique interests, budget, and travel style.
                </p>

                <Link to={'/create-trip'}>
                    <button className="px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-blue-300">
                        Start Planning Your Free Trip Now!
                    </button>
                </Link>


                <div className="mt-8 text-gray-600 text-sm md:text-base">
                    <p>Join thousands of happy travelers exploring the world effortlessly. ✨</p>
                </div>
            </div>


            <div className="relative z-10 mt-12 flex flex-col md:flex-row items-center justify-center gap-6 px-4 md:px-0">
                <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
                    <img
                        src="./mytrip1.png"
                        alt="Example of a personalized travel itinerary"
                        className="w-full h-auto rounded-lg object-cover"
                    />
                    <p className="mt-4 text-gray-800 font-medium text-lg">Detailed Itineraries at Your Fingertips</p>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out overflow-hidden">
                    <img
                        src="./mytrip.png"
                        alt="Screenshot of the AI trip planning interface"
                        className="w-full h-auto rounded-lg object-cover"
                    />
                    <p className="mt-4 text-gray-800 font-medium text-lg">Visualize Your Adventures</p>
                </div>
            </div>
        </div>
    );
};

export default Hero;