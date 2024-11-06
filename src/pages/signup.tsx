import { Input, Button, Image } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

import { useSignup } from '@/hooks/use-signup';
import { Logo } from '@/components/icons';
import eventImg from '@/images/event.png';

export default function SignupPage() {
    const [studentID, setStudentID] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();
    const { signup, loading, error } = useSignup();

    const [slideIn, setSlideIn] = useState(false);

    useEffect(() => {
        setSlideIn(true); // Trigger the slide-in effect on mount
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const year = 1957 + parseInt(studentID.substring(0, 2), 10);
        const username = email.split('@')[0];
        signup(
            studentID,
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            year,
            username,
        )
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                console.error('Sign up failed:', error);
                // Handle Sign up failure (e.g., show an error message)
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10  bg-violet-700 drop-shadow-lg flex justify-center flex-1 rounded-lg">
                {/* Left Section */}
                <div
                    className={`flex flex-col items-center mx-auto bg-white lg:w-2/5 rounded-l-lg transform transition-transform duration-{100ms} ${
                        slideIn ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <Logo className="w-32 h-32 mt-8" />
                    <div className="flex flex-col w-full flex-grow">
                        {/* Sign Up */}
                        <div className="my-6 ml-8">
                            <p className="text-2xl font-bold text-zinc-600 my-2">
                                Create an account
                            </p>
                            <p className="text-lg text-zinc-500 my-2">
                                Enter your student ID and password to continue.
                            </p>
                        </div>
                        <form
                            className="w-full max-w-md flex flex-col gap-4 mx-auto"
                            onSubmit={handleSubmit}
                        >
                            <div className="">
                                <Input
                                    label="Student ID"
                                    type="text"
                                    value={studentID}
                                    onChange={(e) =>
                                        setStudentID(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            e.key !== 'Backspace' &&
                                            e.key !== 'Delete' &&
                                            e.key !== 'ArrowLeft' &&
                                            e.key !== 'ArrowRight' &&
                                            e.key !== 'Tab'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="Password"
                                    type={'password'}
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <Input
                                    label="First Name"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    className="mr-4"
                                />
                                <Input
                                    label="Last Name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="">
                                <Input
                                    label="Phone Number"
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            e.key !== 'Backspace' &&
                                            e.key !== 'Delete' &&
                                            e.key !== 'ArrowLeft' &&
                                            e.key !== 'ArrowRight' &&
                                            e.key !== 'Tab'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                className="bg-violet-800 hover:bg-violet-900 text-white font-bold rounded-xl mt-2"
                                isLoading={loading}
                                type="submit"
                            >
                                {loading ? 'Signing up...' : 'Sign up'}
                            </Button>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="relative flex items-center">
                                <div className="flex-grow border-t border-gray-400" />
                                <span className="flex-shrink mx-4 text-sm text-gray-400">
                                    Or Login with
                                </span>
                                <div className="flex-grow border-t border-gray-400" />
                            </div>
                            <Button className="bg-white hover:bg-gray-100 border-2 text-gray-800 rounded-xl mt-2 flex items-center justify-center">
                                <FcGoogle className="w-5 h-5 mr-2" />
                                Sign up with Google
                            </Button>
                            <div className="text-sm flex justify-center">
                                <div className="">
                                    Already have an account? &nbsp;{' '}
                                </div>
                                <Link className="text-violet-800" to="/login">
                                    Login here
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Right Section */}
                <div className="md:flex flex-col gap-3 mx-auto lg:w-3/5 p-6 sm:p-12 justify-center items-center">
                    <Image src={eventImg} alt="event" />
                </div>
            </div>
        </div>
    );
}
