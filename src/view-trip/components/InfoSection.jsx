import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { IoIosShare } from "react-icons/io";
import { toast } from 'react-toastify';

const InfoSection = ({ trip }) => {
    const [photoUrl, setPhotoUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(true);

    useEffect(() => {
        const fetchPhoto = async () => {
            setImageLoading(true);
            try {
                //  AI image (future ready)
                const aiImage = trip?.tripData?.imageUrl;
                if (aiImage) {
                    setPhotoUrl(aiImage);
                    return;
                }

                // location fallback
                const locationQuery =
                    trip?.tripData?.location?.trim() ||
                    trip?.userSelection?.location?.label?.trim() ||
                    trip?.userSelection?.location?.description?.trim() ||
                    "India";

                console.log("📍 Fetching photo for:", locationQuery);

                //Google API call
                const data = { textQuery: locationQuery };
                const result = await GetPlaceDetails(data);

                const photos = result?.data?.places?.[0]?.photos;
                if (photos?.length > 0) {
                    const photoIndex = Math.min(3, photos.length - 1);
                    const selectedPhoto = photos[photoIndex]?.name || photos[0]?.name;
                    const generatedPhotoUrl = PHOTO_REF_URL.replace("{NAME}", selectedPhoto);
                    setPhotoUrl(generatedPhotoUrl);
                } else {
                    console.warn(" No photos found for:", locationQuery);
                    setPhotoUrl("/placeholder.jpg");
                }
            } catch (error) {
                console.error(" Error fetching location photo:", error);
                setPhotoUrl("/placeholder.jpg");
            } finally {
                setImageLoading(false);
            }
        };

        fetchPhoto();
    }, [trip]);

    if (!trip || !trip.userSelection) {
        return (
            <div className="text-center p-4 text-gray-500">
                <p>Loading trip information...</p>
                <div className="h-48 w-full bg-gray-200 animate-pulse rounded-xl mt-4"></div>
            </div>
        );
    }

    const tripLocationLabel =
        trip?.tripData?.location ||
        trip?.userSelection?.location?.label ||
        trip?.userSelection?.location?.description ||
        "Unknown Destination";

    const altText = `Scenic view of ${tripLocationLabel}`;

    //Share logic
    const handleShareTrip = async () => {
        const tripUrl = window.location.href;
        const tripTitle = `My Trip to ${tripLocationLabel} with Trip Genius AI`;
        const tripText = `Check out my amazing trip plan to ${tripLocationLabel} created with Trip Genius AI!`;

        if (navigator.share) {
            try {
                await navigator.share({ title: tripTitle, text: tripText, url: tripUrl });
                console.log('✅ Trip shared successfully!');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Share failed:', error);
                    fallbackCopyLink(tripUrl);
                }
            }
        } else {
            fallbackCopyLink(tripUrl);
        }
    };

    const fallbackCopyLink = (url) => {
        navigator.clipboard.writeText(url)
            .then(() => toast.info('📋 Trip URL copied to clipboard!'))
            .catch(() => toast.error('Failed to copy URL.'));
    };

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-lg">
            {imageLoading ? (
                <div className="h-[200px] sm:h-[280px] md:h-[380px] w-full bg-gray-200 animate-pulse rounded-xl"></div>
            ) : (
                <img
                    src={photoUrl || "/placeholder.jpg"}
                    alt={altText}
                    className="h-[200px] sm:h-[280px] md:h-[380px] w-full object-cover rounded-xl"
                    onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5 gap-4 sm:gap-0">
                <div className='flex flex-col gap-2'>
                    <h2 className='font-bold text-xl sm:text-2xl md:text-3xl'>{tripLocationLabel}</h2>
                    <div className='flex flex-wrap gap-2 sm:gap-3'>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-800 text-xs sm:text-sm'>
                            🗓 {trip.userSelection?.noOfDays || 1} Day{trip.userSelection?.noOfDays > 1 ? 's' : ''}
                        </h2>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-800 text-xs sm:text-sm'>
                            💰 {trip.userSelection?.budget || "Custom"} Budget
                        </h2>
                        <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-800 text-xs sm:text-sm'>
                            🥂 Travelers: {trip.userSelection?.traveler?.people || 'N/A'}
                        </h2>
                        {trip.userSelection?.traveler?.desc && (
                            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-900 text-xs sm:text-sm'>
                                {trip.userSelection.traveler.desc}
                            </h2>
                        )}
                    </div>
                </div>
                <Button onClick={handleShareTrip} className="shrink-0 px-4 py-2 text-sm sm:px-6 sm:py-3 md:text-base">
                    <IoIosShare className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Share Trip
                </Button>
            </div>
        </div>
    );
};

export default InfoSection;
