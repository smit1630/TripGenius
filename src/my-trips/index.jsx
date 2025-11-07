import { db } from '@/service/firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripsCardItem from './componenets/UserTripsCardItem'; // Ensure correct path

const MyTrips = () => {
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        setLoading(true);
        setError(null);

        const user = JSON.parse(localStorage.getItem('user'));

        if (!user || !user.email) {
            console.log("No user or user email found, redirecting to home.");
            navigate("/");
            setLoading(false); // Stop loading if no user
            return;
        }

        try {
            const q = query(collection(db, "AITrips"), where("userEmail", "==", user.email));
            const querySnapshot = await getDocs(q);

            const fetchedTrips = [];
            if (querySnapshot.empty) {
                console.log("No matching documents for the user's email.");
            } else {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data());
                    fetchedTrips.push({ id: doc.id, ...doc.data() });
                });
            }
            setUserTrips(fetchedTrips);
        } catch (err) {
            console.error("Error fetching user trips:", err);
            setError("Failed to load your trips. Please try again.");
        } finally {
            setLoading(false); // Stop loading regardless of success or failure
        }
    };

    //  Conditional Rendering Logic 

    // 1. Show skeleton loader while loading
    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">My Trips</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render skeleton cards */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className='border rounded-lg p-4 shadow-sm h-60 bg-gray-200 animate-pulse'>
                            <div className='w-full h-32 bg-gray-300 rounded mb-4'></div> {/* Image placeholder */}
                            <div className='w-3/4 h-6 bg-gray-300 rounded mb-2'></div> {/* Title placeholder */}
                            <div className='w-1/2 h-4 bg-gray-300 rounded'></div> {/* Text placeholder */}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // koi err ho to
    if (error) {
        return <div className="text-center p-4 text-red-600 font-semibold">{error}</div>;
    }

    // Show "No trips found" message if no trips are available after loading
    if (userTrips.length === 0) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">My Trips</h2>
                <div className="text-center text-gray-600 text-lg">
                    <p>It looks like you haven't planned any trips yet.</p>
                    <p>Start your next adventure now!</p>
                    <button
                        onClick={() => navigate('/create-trip')}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Plan a New Trip
                    </button>
                </div>
            </div>
        );
    }

    //  Show the list of trips if loaded successfully and trips exist
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">My Trips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTrips.map((trip) => (
                    <UserTripsCardItem key={trip.id} trip={trip} />
                ))}
            </div>
        </div>
    );
};

export default MyTrips;