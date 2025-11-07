import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';

import Weather from '../components/Weather';
import TripCostBreakdown from '../components/TripCostBreakdown';
import Footer from '../components/Footer';

const viewTrip = () => {

    const { tripId } = useParams();
    const [trip, setTrip] = useState([]);

    useEffect(() => {
        tripId && GetTripData();

    }, [tripId])

    const GetTripData = async () => {
        const docRef = doc(db, 'AITrips', tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document:", docSnap.data());
            setTrip(docSnap.data());
        }
        else {
            console.log("No Such Document");
            toast('No Trip Found!!')
        }
    }


    return (
        <div className='p-10 md:px-20 lg:px-44 xl:px-50'>
            {/* information section */}
            <InfoSection trip={trip}/>

            {/* Recommended hoels */}
            <Hotels trip={trip}/>

            {/* daily plan */}
            <PlacesToVisit trip={trip}/>

            {/* wether info , etc , footer*/}
            <Weather trip={trip}/>

            <TripCostBreakdown trip={trip}/>

            <Footer trip={trip}/>
        </div>
    )
}

export default viewTrip