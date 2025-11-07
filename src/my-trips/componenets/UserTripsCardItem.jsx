import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserTripsCardItem = ({ trip }) => {
    const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");

    useEffect(() => {
        if (trip) fetchPlacePhoto();
    }, [trip]);

    const fetchPlacePhoto = async () => {
        try {
            const locationQuery =
                trip?.tripData?.location ||
                trip?.userSelection?.location?.label ||
                trip?.userSelection?.location?.description ||
                "India";

            const data = { textQuery: locationQuery };
            const result = await GetPlaceDetails(data);

            const photos = result?.data?.places?.[0]?.photos;
            if (photos?.length > 0) {
                const photoIndex = Math.min(3, photos.length - 1);
                const photoName = photos[photoIndex]?.name || photos[0]?.name;
                const generatedUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
                setPhotoUrl(generatedUrl);
            } else {
                console.warn(" No Google photo found for:", locationQuery);
                setPhotoUrl("/placeholder.jpg");
            }
        } catch (error) {
            console.error(" Error fetching place photo:", error);
            setPhotoUrl("/placeholder.jpg");
        }
    };

    const locationName =
        trip?.tripData?.location ||
        trip?.userSelection?.location?.label ||
        trip?.userSelection?.location?.description ||
        "Untitled Trip";

    return (
        <Link to={`/view-trip/${trip?.id}`}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 ease-in-out cursor-pointer">
                <img
                    src={photoUrl}
                    alt={locationName}
                    className="w-full h-48 object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                />
                <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{locationName}</h3>
                    <h2 className="text-sm text-gray-600">
                        {trip?.userSelection?.noOfDays || "?"} Days trip with {trip?.userSelection?.budget || "Custom"} Budget
                    </h2>
                </div>
            </div>
        </Link>
    );
};

export default UserTripsCardItem;
