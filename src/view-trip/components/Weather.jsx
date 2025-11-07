import React from 'react';

const Weather = ({ trip }) => {
    const weatherPlan = trip?.tripData?.alternativeWeatherPlan;
    const foodGuide = trip?.tripData?.famousLocalFoodGuide;

    if (!weatherPlan && (!foodGuide || foodGuide.length === 0)) return null;

    return (
        <div className="mt-10 bg-white rounded-xl shadow p-6 md:p-8">
            {weatherPlan && (
                <>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                        Weather-Based Alternative Plans
                    </h2>

                    {weatherPlan.noteOnViews && (
                        <p className="text-gray-700 text-lg mb-2">
                            <span className="font-semibold">Note on Views:</span> {weatherPlan.noteOnViews}
                        </p>
                    )}

                    {weatherPlan.description && (
                        <p className="text-gray-700 text-lg mb-2">
                            <span className="font-semibold">Description:</span> {weatherPlan.description}
                        </p>
                    )}

                    {weatherPlan.currentWeatherPlaceholder && (
                        <p className="text-gray-700 text-lg mb-4">
                            <span className="font-semibold">Current Weather:</span> {weatherPlan.currentWeatherPlaceholder}
                        </p>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                        {["Clear", "Foggy", "Rainy"].map((type) => {
                            const alternatives = weatherPlan?.alternatives?.[type];
                            if (!alternatives?.length) return null;

                            return (
                                <div key={type} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                                    <h3 className="text-lg font-semibold text-indigo-600 mb-2">{type} Weather Plan</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {alternatives.map((activity, index) => (
                                            <li key={index}>{activity}</li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* Famous Local Food Guide Section */}
            {foodGuide && foodGuide.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                        Famous Local Food Guide
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {foodGuide.map((item, index) => (
                            <div
                                key={index}
                                className="bg-orange-50 rounded-lg p-4 border border-orange-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-orange-700 mb-1">
                                    {item.dishName}
                                </h3>
                                <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Where to find:</span> {item.whereToFind}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;
