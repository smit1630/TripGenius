import React, { useEffect, useState, useRef } from 'react';
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateTravelPlan } from '@/service/AIModel';
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';

// 🌍 Autocomplete component
function PlaceAutocomplete({ onSelect }) {
    const inputRef = useRef(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const placesLib = useMapsLibrary("places");

    useEffect(() => {
        if (!placesLib || !inputRef.current) return;

        const ac = new placesLib.Autocomplete(inputRef.current, {
            fields: ["formatted_address", "geometry", "name"],
        });

        const listener = ac.addListener("place_changed", () => {
            const place = ac.getPlace();
            if (place) onSelect(place);
        });

        setAutocomplete(ac);
        return () => listener.remove();
    }, [placesLib]);

    return (
        <input
            ref={inputRef}
            type="text"
            placeholder="Enter destination..."
            className="w-full p-3 rounded-lg border-gray-300"
        />
    );
}

// ✨ Main CreateTrip Component
function CreateTrip() {
    const [formData, setFormData] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (name, value) => {
        if (name === 'noOfDays' && value > 10) {
            toast("Please Enter Trip Days Less Than 10");
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        console.log("Form Data:", formData);
    }, [formData]);

    // 🔑 Google login
    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log("Google Login Error:", error),
    });

    // 🚀 Generate Trip Flow
    const OngenerateTrip = async () => {
        const user = localStorage.getItem('user');
        if (!user) {
            setOpenDialog(true);
            return;
        }

        if (!formData?.location || !formData?.budget || !formData?.traveler) {
            toast("Please Fill All Details!");
            return;
        }

        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location?.formatted_address || "Unknown")
            .replace('{totalDays}', formData?.noOfDays)
            .replace('{traveler}', formData?.traveler?.people || "Solo")
            .replace('{budget}', formData?.budget);

        console.log("Final AI Prompt:", FINAL_PROMPT);

        try {
            const aiResponse = await generateTravelPlan(FINAL_PROMPT);
            console.log("AI Response:", aiResponse);
            const formattedResponse = typeof aiResponse === "string" ? JSON.parse(aiResponse) : aiResponse;
            await SaveAiTrip(formattedResponse);
        } catch (error) {
            console.error("AI Generation Error:", error);
            toast("Failed to generate trip plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 💾 Save Trip to Firestore
    const SaveAiTrip = async (TripData) => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || "{}");
        const docID = Date.now().toString();

        let parsedTripData = {};
        try {
            parsedTripData = typeof TripData === "string" ? JSON.parse(TripData) : TripData;
            parsedTripData.totalDays = parsedTripData.totalDays ?? formData.noOfDays ?? 1;
        } catch (error) {
            console.error("Failed to parse TripData:", error);
            parsedTripData = { totalDays: formData.noOfDays ?? 1 };
        }

        const cleanedFormData = {
            ...formData,
            location: formData?.location
                ? {
                    label: formData.location.label ?? "",
                    place_id: formData.location.value?.place_id ?? "",
                    description: formData.location.value?.description ?? "",
                    lat:
                        typeof formData.location.value?.geometry?.location?.lat === "function"
                            ? formData.location.value.geometry.location.lat()
                            : formData.location.value?.geometry?.location?.lat ?? null,
                    lng:
                        typeof formData.location.value?.geometry?.location?.lng === "function"
                            ? formData.location.value.geometry.location.lng()
                            : formData.location.value?.geometry?.location?.lng ?? null,
                }
                : null,
        };

        try {
            await setDoc(doc(db, "AITrips", docID), {
                userSelection: cleanedFormData,
                tripData: parsedTripData,
                userEmail: user?.email ?? "Unknown",
                id: docID,
            });

            console.log("Trip saved successfully!");
            navigate(`/view-trip/${docID}`);
        } catch (error) {
            console.error("Error saving trip:", error);
            toast("Failed to save trip. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 👤 Get Google User Profile
    const GetUserProfile = (tokenInfo) => {
        axios
            .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
                headers: {
                    Authorization: `Bearer ${tokenInfo?.access_token}`,
                    Accept: 'application/json',
                },
            })
            .then((resp) => {
                console.log("User Profile Data:", resp.data);
                localStorage.setItem('user', JSON.stringify(resp.data));

                // 🔥 Notify header immediately
                window.dispatchEvent(new Event('userUpdate'));

                setOpenDialog(false);

                // 🕒 Delay so header updates before redirect
                setTimeout(() => {
                    OngenerateTrip();
                }, 300);

                toast.success(`Welcome, ${resp.data.given_name || resp.data.name}!`);
            })
            .catch((error) => {
                console.error("Failed to fetch user profile:", error);
                toast("Error fetching user profile. Please try again.");
            });
    };

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}>
            <div className="max-w-4xl mx-auto py-10 px-5">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-5">
                    Tell us your travel preferences 🏕️🌴
                </h2>
                <p className="text-gray-700 text-lg text-center">
                    Just provide some basic information, and our trip planner will generate a customized itinerary.
                </p>

                <div className="mt-10 space-y-10">
                    {/* Destination */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-3">What is your destination?</h2>
                        <PlaceAutocomplete onSelect={(place) => handleInputChange('location', place)} />
                    </div>

                    {/* Trip Duration */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-3">How many days is your trip?</h2>
                        <Input
                            placeholder="Ex. 3"
                            type="number"
                            className="w-full p-3 rounded-lg border-gray-300"
                            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                        />
                        {formData?.noOfDays && (
                            <p className="mt-3 text-gray-900"><strong>Trip Duration:</strong> {formData.noOfDays} Days</p>
                        )}
                    </div>

                    {/* Budget */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-3">What is your budget?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SelectBudgetOptions.map((item, index) => (
                                <div
                                    key={index}
                                    className={`p-5 border rounded-lg cursor-pointer hover:shadow-lg transition duration-300 ${formData?.budget === item.title ? "bg-blue-200 border-blue-500" : "bg-white"}`}
                                    onClick={() => handleInputChange('budget', item.title)}
                                >
                                    <h2 className="text-3xl">{item.icons}</h2>
                                    <h2 className="font-bold text-lg">{item.title}</h2>
                                    <p className="text-sm text-gray-700">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Travel Companions */}
                    <div className="bg-gray-100 p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-3">Who are you traveling with?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SelectTravelesList.map((item, index) => (
                                <div
                                    key={index}
                                    className={`p-5 border rounded-lg cursor-pointer hover:shadow-lg transition duration-300 ${formData?.traveler?.title === item.title ? "bg-green-200 border-green-500" : "bg-white"}`}
                                    onClick={() => handleInputChange('traveler', { title: item.title, desc: item.desc, people: item.people })}
                                >
                                    <h2 className="text-3xl">{item.icons}</h2>
                                    <h2 className="font-bold text-lg">{item.title}</h2>
                                    <p className="text-sm text-gray-700">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Generate Trip */}
                <div className="mt-10 flex justify-center">
                    <Button
                        disabled={loading}
                        onClick={OngenerateTrip}
                        className="font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
                    >
                        {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : "Generate Trip"}
                    </Button>
                </div>

                {/* Google Sign-In Dialog */}
                <Dialog open={openDialog}>
                    <DialogContent className="bg-white p-4 rounded-lg shadow-lg max-w-sm mx-auto">
                        <DialogHeader className="text-left">
                            <DialogDescription className="flex flex-col items-start gap-2 text-gray-600">
                                <img src="/logo.svg" className="w-32 h-16 animate-pulse" alt="App Logo" />
                                <DialogTitle className="text-lg font-bold text-gray-900">Sign In With Google</DialogTitle>
                                <DialogTitle className="text-sm text-gray-500">
                                    Sign in to the App with Google Authentication
                                </DialogTitle>

                                <Button
                                    disabled={loading}
                                    onClick={login}
                                    className="w-full gap-4 items-center mt-2 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                                >
                                    <FcGoogle className="w-7 h-7" /> Sign In With Google
                                </Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </APIProvider>
    );
}

export default CreateTrip;
