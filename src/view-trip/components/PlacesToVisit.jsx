import React from 'react';
import PlaceCardItem from './PlaceCardItem'; // Ensure this path is correct

const PlacesToVisit = ({ trip }) => {
    // Check for essential trip data availability
    if (!trip || !trip.tripData || !Array.isArray(trip.tripData.itinerary)) {
        return (
            <div className="text-center p-6 sm:p-8 text-gray-500 text-sm sm:text-base">
                <p>Loading your trip itinerary...</p>
            </div>
        );
    }

    // If itinerary is an empty array, provide a specific message
    if (trip.tripData.itinerary.length === 0) {
        return (
            <div className="text-center p-6 sm:p-8 text-gray-500 text-sm sm:text-base">
                <p>No places to visit planned for this trip yet. Check back soon!</p>
            </div>
        );
    }

    return (
        <div className="mt-6 p-4 sm:p-6 bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="font-extrabold text-2xl sm:text-3xl text-gray-800 mb-4 sm:mb-6 border-b-2 border-indigo-200 pb-2 sm:pb-3">
                📍 Places to Visit
            </h2>
            <div className="space-y-6 sm:space-y-8">
                {trip.tripData.itinerary.map((item, dayIndex) => (
                    <div key={dayIndex}>
                        <h2 className="font-bold text-xl sm:text-2xl text-gray-700 mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                            <span className="text-indigo-600">Day {item.day || (dayIndex + 1)}</span>
                            {trip.tripData.location && (
                                <span className="text-sm font-normal text-gray-500 text-left sm:text-right">
                                    – Explore {trip.tripData.location}
                                </span>
                            )}
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5'>
                            {Array.isArray(item.activities) && item.activities.length > 0 ? (
                                item.activities.map((place, placeIndex) => (
                                    <div key={place.id || placeIndex} className='my-2 sm:my-3'>
                                        <h3 className={`font-semibold text-base sm:text-lg mb-1 sm:mb-2 text-blue-600`}>
                                            {place.timeSlot ? `${place.timeSlot} ` : ''}
                                            {place.optimalVisitTime && (
                                                <span className="font-normal text-xs sm:text-sm opacity-90">
                                                    ({place.optimalVisitTime})
                                                </span>
                                            )}
                                            {place.placeName || 'Activity'}
                                        </h3>
                                        <PlaceCardItem place={place} trip={trip} />
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-full text-gray-500 text-center text-xs sm:text-sm italic">No activities planned for Day {item.day || (dayIndex + 1)}.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {trip.tripData?.notes && trip.tripData.notes.trim() !== "" && trip.tripData.notes !== "No general notes provided." && (
                <div className="mt-6 p-4 sm:p-6 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-800 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg sm:text-xl mb-2">Additional Notes:</h3>
                    <p className="text-sm sm:text-base leading-relaxed">{trip.tripData.notes}</p>
                </div>
            )}
        </div>
    );
}

export default PlacesToVisit;