import { Button } from '@/components/ui/button'; 
import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa6";
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';

const PlaceCardItem = ({ place, trip }) => { 

    const [photoUrl, setPhotoUrl] = useState(null); // Initialize with null for proper loading state
    const [imageLoading, setImageLoading] = useState(true); // State to manage image loading

    useEffect(() => {
        const fetchPhoto = async () => {
            setImageLoading(true); // Start loading animation
            if (place && place.name) {
                try {
                    const data = {
                        textQuery: place.name
                    };
                    const result = await GetPlaceDetails(data);

                    // Robustly check for photos array and its content
                    if (result.data.places && result.data.places.length > 0 &&
                        result.data.places[0].photos && result.data.places[0].photos.length > 0) {
                        
                        // Try to get the 4th photo (index 3), or fallback to the last available photo
                        const photoIndex = Math.min(3, result.data.places[0].photos.length - 1);
                        const photoName = result.data.places[0].photos[photoIndex]?.name;

                        if (photoName) {
                            const generatedPhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
                            setPhotoUrl(generatedPhotoUrl);
                        } else {
                            console.warn(`No suitable photo found for ${place.name}. Falling back to placeholder.`);
                            setPhotoUrl("/placeholder.jpg"); // Fallback if specific photo not found
                        }
                    } else {
                        console.warn(`No photos found for ${place.name}. Falling back to placeholder.`);
                        setPhotoUrl("/placeholder.jpg"); // Fallback if no photos array or empty
                    }
                } catch (error) {
                    console.error("Error fetching place photo:", error);
                    setPhotoUrl("/placeholder.jpg"); // Fallback on API error
                }
            } else {
                setPhotoUrl("/placeholder.jpg"); // Fallback if place name is missing
            }
            setImageLoading(false); // End loading animation
        };

        fetchPhoto();
    }, [place]); // Depend on 'place' object to re-fetch if place data changes


    // Construct Google Maps URL 
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ', ' + trip.tripData?.location)}`;

    const altText = place.name ? `Image of ${place.name}` : "Place photo";

    return (
        <Link
            to={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            // Use flex-col on small screens, flex-row on medium and above
            className='block border shadow-sm rounded-xl p-3 mt-2 flex flex-col sm:flex-row gap-3 sm:gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'
        >
            {imageLoading ? (
                // Skeleton loader for the image
                <div className='w-full h-32 sm:w-[140px] sm:h-[140px] bg-gray-200 animate-pulse rounded-xl flex-shrink-0'></div>
            ) : (
                <img
                    src={photoUrl || '/placeholder.jpg'} // Ensure fallback even if photoUrl ends up null
                    alt={altText}
                    className='w-full h-32 object-cover rounded-xl flex-shrink-0 sm:w-[140px] sm:h-[140px]'
                    loading="lazy"
                />
            )}
            <div className='flex-grow'> {/* Allows content to take remaining space */}
                <h2 className="font-bold text-lg sm:text-xl text-gray-800 mb-1">{place.name}</h2>
                <p className="text-gray-600 text-sm sm:text-base mb-2 line-clamp-2">{place.details}</p>
                <div className="text-gray-700 text-xs sm:text-sm space-y-1">
                    {place.travelTime && <h3 className="flex items-center gap-1">🕒 {place.travelTime}</h3>}
                    {place.optimalVisitTime && (
                        <h3 className="flex items-center gap-1">
                            ✨ Optimal Visit: <span className="font-medium">{place.optimalVisitTime}</span>
                        </h3>
                    )}
                    {place.ticketPrice && place.ticketPrice !== 'N/A' && (
                        <h3 className="flex items-center gap-1">
                            🎟️ Price: <span className="font-medium">{place.ticketPrice}</span>
                        </h3>
                    )}
                    {place.rating && (
                        <h3 className="flex items-center gap-1">
                            <FaStar className="text-yellow-500" /> {place.rating} / 5
                        </h3>
                    )}
                    {place.notes && place.notes.trim() !== "" && (
                        <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">Note: {place.notes}</p>
                    )}
                </div>
                {/* Optional: Add a button to view on map explicitly if desired,
                    instead of making the whole card a link.
                    Or, keep the whole card a link and add a small map icon.
                */}
                {/* <Button size="sm" className="mt-2" onClick={(e) => { e.preventDefault(); window.open(googleMapsUrl, '_blank'); }}>
                    <FaLocationDot className="mr-1" /> View on Map
                </Button> */}
            </div>
        </Link>
    );
}

export default PlaceCardItem;  