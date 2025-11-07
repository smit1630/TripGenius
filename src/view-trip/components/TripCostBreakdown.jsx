import React from 'react';

const TripCostBreakdown = ({ trip }) => {
    const estimatedCosts = trip?.tripData?.estimatedCosts;
    const budget = trip?.tripData?.budget;

    if (!estimatedCosts) return null;

    return (
        <div className="mt-10 bg-white rounded-xl shadow p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                Trip Budget & Cost Breakdown
            </h2>

            {budget && (
                <p className="text-gray-700 text-lg mb-4">
                    <span className="font-semibold">Budget:</span> {budget}
                </p>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-gray-700 text-sm">
                {/* Hotels */}
                <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-700 mb-1">Hotels</h3>
                    <p><span className="font-semibold">Range:</span> {estimatedCosts.hotels?.perNightRange}</p>
                    <p><span className="font-semibold">Min:</span> {estimatedCosts.hotels?.min} {estimatedCosts.currencySymbol}</p>
                    <p><span className="font-semibold">Max:</span> {estimatedCosts.hotels?.max} {estimatedCosts.currencySymbol}</p>
                </div>

                {/* Food */}
                <div className="bg-green-50 rounded-lg p-4 shadow-sm border border-green-200">
                    <h3 className="text-lg font-semibold text-green-700 mb-1">Food</h3>
                    <p>{estimatedCosts.food?.details}</p>
                    <p><span className="font-semibold">Min:</span> {estimatedCosts.food?.min} {estimatedCosts.currencySymbol}</p>
                    <p><span className="font-semibold">Max:</span> {estimatedCosts.food?.max} {estimatedCosts.currencySymbol}</p>
                </div>

                {/* Activities */}
                <div className="bg-yellow-50 rounded-lg p-4 shadow-sm border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-700 mb-1">Activities</h3>
                    <p>{estimatedCosts.activities?.details}</p>
                    <p><span className="font-semibold">Min:</span> {estimatedCosts.activities?.min} {estimatedCosts.currencySymbol}</p>
                    <p><span className="font-semibold">Max:</span> {estimatedCosts.activities?.max} {estimatedCosts.currencySymbol}</p>
                </div>

                {/* Local Transport */}
                <div className="bg-purple-50 rounded-lg p-4 shadow-sm border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-700 mb-1">Local Transport</h3>
                    <p>{estimatedCosts.localTransport?.details}</p>
                    <p><span className="font-semibold">Min:</span> {estimatedCosts.localTransport?.min} {estimatedCosts.currencySymbol}</p>
                    <p><span className="font-semibold">Max:</span> {estimatedCosts.localTransport?.max} {estimatedCosts.currencySymbol}</p>
                </div>

                {/* Miscellaneous */}
                <div className="bg-pink-50 rounded-lg p-4 shadow-sm border border-pink-200">
                    <h3 className="text-lg font-semibold text-pink-700 mb-1">Miscellaneous</h3>
                    <p>{estimatedCosts.miscellaneous?.details}</p>
                    <p><span className="font-semibold">Min:</span> {estimatedCosts.miscellaneous?.min} {estimatedCosts.currencySymbol}</p>
                    <p><span className="font-semibold">Max:</span> {estimatedCosts.miscellaneous?.max} {estimatedCosts.currencySymbol}</p>
                </div>
            </div>

            {/* Total Estimate */}
            {estimatedCosts.totalEstimatedRange && (
                <div className="mt-6 text-lg font-semibold text-gray-800">
                    Total Estimated Cost: <span className="text-indigo-700">{estimatedCosts.totalEstimatedRange}</span>
                </div>
            )}
        </div>
    );
};

export default TripCostBreakdown;
