import { Input } from '@nextui-org/input';
import {
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from '@nextui-org/navbar';
import { VscBell, VscAccount, VscChevronDown } from 'react-icons/vsc';
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
} from '@nextui-org/react';
import { useState, useContext, useEffect } from 'react';
// eslint-disable-next-line import/order
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '@/context/AuthContext';
import { SearchIcon } from '@/components/icons';

export const Navbar = () => {
    const { user } = useContext(AuthContext);
    const [searchContent, setSearchContent] = useState('');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        toast.promise(logout(), {
            pending: 'Logging out...',
            success: 'Logout successful',
            error: 'An error occurred. Please try again.',
        });
    };

    const searchInput = (
        <Input
            aria-label="Search"
            classNames={{
                inputWrapper: 'bg-default-100',
                input: 'text-sm',
            }}
            labelPlacement="outside"
            placeholder="Search..."
            startContent={
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="search"
            value={searchContent}
            onChange={(e) => setSearchContent(e.target.value)}
        />
    );

    //dummy noti
    const notification = {
        Noti1: 'Notification 1',
        Noti2: 'Notification 2',
    };

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    return (
        <NextUINavbar
            className={clsx(scrolled ? 'shadow' : '', 'flex flex-col')}
            maxWidth="full"
            position="sticky"
        >
            <NavbarBrand>
                <p className="font-bold text-inherit" />
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {searchInput}
            </NavbarContent>
            <NavbarContent
                className="hidden sm:flex basis-1/5 sm:basis-full"
                justify="end"
            >
                {user ? (
                    <div className="flex items-center space-x-4">
                        <NavbarItem className="hidden lg:flex text-lg">
                            <Dropdown>
                                <DropdownTrigger>
                                    <button>
                                        <VscBell />
                                    </button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    {Object.entries(notification).map(
                                        ([key, value]) => (
                                            <DropdownItem key={key}>
                                                {value}
                                            </DropdownItem>
                                        ),
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                        <NavbarItem className="hidden lg:flex">
                            <VscAccount className="text-2xl m-2" />

                            <Dropdown>
                                <DropdownTrigger>
                                    <button>
                                        <VscChevronDown />
                                    </button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="ViewProfile">
                                        View Profile
                                    </DropdownItem>
                                    <DropdownItem key="Setting">
                                        Setting
                                    </DropdownItem>
                                    <DropdownItem
                                        key="SignOut"
                                        className="text-danger"
                                        color="danger"
                                        onClick={handleLogout}
                                    >
                                        Sign out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                    </div>
                ) : (
                    <div>
                        <Button
                            className="bg-violet-700 text-white px-7 mx-3"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                        <Button
                            className="bg-blue-500 text-white px-7"
                            // onClick={() => navigate('/login')}
                        >
                            Sign Up
                        </Button>
                    </div>
                )}
            </NavbarContent>
            <ToastContainer position="top-center" />
        </NextUINavbar>
    );
};
