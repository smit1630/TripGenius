import React from 'react';

import { HotleCardItem } from './HotleCardItem';

const Hotels = ({ trip }) => {
    // Basic null/undefined check for tripData and hotels
    if (!trip || !trip.tripData || !trip.tripData.hotels || trip.tripData.hotels.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-8">
                <p>No hotel recommendations available for this trip yet.</p>
                <p>Please ensure the AI has generated the hotel data.</p>
            </div>
        );
    }
    

    return (
        <div className="mt-8"> 
            <h2 className="font-bold text-2xl text-gray-800 mb-6"> {/* Larger, darker heading, increased bottom margin */}
                Hotel Recommendations
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* More responsive grid, slightly larger gap */}
                {trip.tripData.hotels.map((hotel, index) => (
                    <HotleCardItem key={hotel.name || index} hotel={hotel} />
                ))}
            </div>
        </div>
    );
};

export default Hotels;