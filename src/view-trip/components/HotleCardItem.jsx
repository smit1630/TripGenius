import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export const HotleCardItem = ({ hotel }) => {

    const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg'); // Default placeholder like text dafault

    useEffect(() => {
        hotel && GetplacePhoto();
    }, [hotel]);


    const GetplacePhoto = async () => {
        try {
            const data = { textQuery: hotel.name };
            const result = await GetPlaceDetails(data);
            const photos = result?.data?.places?.[0]?.photos;

            if (photos && photos.length > 0) {
                // if index 3 exists, use it. Else fallback to 0.
                const selectedPhoto = photos[3]?.name || photos[0]?.name;
                const photoUrl = PHOTO_REF_URL.replace("{NAME}", selectedPhoto);
                setPhotoUrl(photoUrl);
            } else {
                console.warn("No photos found for:", hotel.name);
                setPhotoUrl('/placeholder.jpg');
            }
        } catch (error) {
            console.error("Axios Error:", error);
            setPhotoUrl('/placeholder.jpg');
        }
    };


    return (
        <Link
            to={

                `https://www.google.com/maps/search/?api=1&query=` + hotel.name + hotel.address

            }
            target="_blank"
            rel="noopener noreferrer" // Important for security when using target="_blank"
            className="block" // Ensures the whole link is clickable
        >
            <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg"> 
                <img
                    src={photoUrl ? photoUrl : '/placeholder.jpg'} 
                    alt={hotel.name || 'Hotel Image'}
                    loading='lazy'
                    className="w-full h-48 object-cover rounded-t-xl" 
                />
                <div className="p-4 flex flex-col gap-2"> 
                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{hotel.name}</h3> {/* Larger, darker text, line-clamp for long names */}
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                        <span className="text-orange-500">📍</span>{hotel.address} {/* Using text-orange-500 for emoji */}
                    </p>
                    <p className="text-base text-green-700 font-medium">
                        <span className="text-yellow-600">💰</span>{hotel.price || 'N/A'} {/* Consistent text size, green for price */}
                    </p>
                    {/* Conditionally render rating if available and valid */}
                    {hotel.rating && typeof hotel.rating === 'number' && hotel.rating > 0 && (
                        <p className="text-sm text-blue-600 flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>{hotel.rating.toFixed(1)} / 5 {/* Format rating to one decimal place */}
                        </p>
                    )}
                    <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                        <span className="font-medium">Description: </span>{hotel.description || 'No description available.'} {/* Bold label, line-clamp for description */}
                    </p>
                </div>
            </div>
        </Link>
    )
}
