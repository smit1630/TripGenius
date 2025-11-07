import React, { useEffect, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';

const Header = () => {
    const [user, setUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleSignOut = () => {
        googleLogout();
        localStorage.removeItem('user');
        setUser(null);
        toast.info("You have been signed out successfully!");
    };

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setLoading(true);
            GetUserProfile(tokenResponse);
        },
        onError: (errorResponse) => {
            console.error("Google Login Error:", errorResponse);
            toast.error("Google Sign-In failed. Please try again.");
            setLoading(false);
        },
        scope: 'profile email', // Explicitly request email scope
    });

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'application/json'
            }
        })
        .then((resp) => {
            console.log("User Profile Data from Google:", resp.data);
            localStorage.setItem('user', JSON.stringify(resp.data));
            setUser(resp.data);
            setOpenDialog(false);
            toast.success(`Welcome, ${resp.data.given_name || resp.data.name}!`);
            if (!resp.data.email) {
                toast.warn("Email not retrieved. Please try signing in again.");
            }
        })
        .catch((error) => {
            console.error("Failed to fetch user profile:", error);
            toast.error("Error fetching user profile. Please try again.");
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className="p-2 top-0 flex justify-between items-center px-4 sm:px-6 bg-white shadow-sm">
            <img
                className="w-24 h-20 object-contain animate-pulse  sm:w-32 sm:h-28 md:w-40 md:h-32 "
                src="/logo.svg"
                alt="Trip Planner Logo"
            />
            <div>
                {user ? (
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <h2 className='hidden sm:block text-sm sm:text-base'>Welcome {user?.given_name || 'User'}!</h2>
                        <a href="/create-trip">
                            <Button variant="outline" className="px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm">
                                + Create Trip
                            </Button>
                        </a>
                        <a href="/my-trips">
                            <Button variant="outline" className="px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm">
                                My Trips
                            </Button>
                        </a>
                        <Popover>
                            <PopoverTrigger>
                                <img src={user?.picture} className='h-[30px] w-[30px] rounded-full cursor-pointer sm:h-[35px] sm:w-[35px]' alt="User Profile" />
                            </PopoverTrigger>
                            <PopoverContent className="p-2">
                                <p className="p-2 text-sm text-gray-600 truncate">{user?.email || 'No email available'}</p>
                                <h2 className='cursor-pointer hover:bg-gray-100 p-2 rounded-md' onClick={handleSignOut}>Logout</h2>
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <Button onClick={() => setOpenDialog(true)} className="px-3 py-1.5 text-sm sm:px-4 sm:py-2">Sign In</Button>
                )}
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-white p-4 rounded-lg shadow-lg max-w-xs mx-auto transition-all duration-300 ease-in-out sm:max-w-sm">
                    <DialogHeader className="text-left">
                        <DialogDescription className="flex flex-col items-start gap-2 text-gray-600">
                            <img src='/logo.svg' className="w-28 h-14 mt-0 animate-pulse sm:w-32 sm:h-16" alt="App Logo" />
                            <DialogTitle className="text-base font-bold text-gray-900 sm:text-lg">Sign In With Google</DialogTitle>
                            <DialogTitle className="text-xs text-gray-500 sm:text-sm">Sign in to the App with Google Authentication</DialogTitle>
                            <Button
                                disabled={loading}
                                onClick={login}
                                className="w-full gap-2 items-center mt-2 font-bold px-3 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-300 text-sm sm:px-4 sm:py-2 sm:text-base"
                            >
                                <FcGoogle className='w-6 h-6 sm:w-7 sm:h-7' /> {loading ? 'Signing In...' : 'Sign In With Google'}
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Header;