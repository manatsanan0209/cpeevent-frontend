import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Link, link as linkStyles, Skeleton } from '@nextui-org/react';
import { BiCalendarStar } from 'react-icons/bi';
import { LuCalendarClock } from 'react-icons/lu';
import { GoChecklist } from 'react-icons/go';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { motion } from 'framer-motion';

import { Event } from '@/types/index';
import logo from '@/images/logo256.png';
import { AuthContext } from '@/context/AuthContext';
import { fetchEvents } from '@/hooks/api';
import { siteConfig } from '@/config/site';

export const Sidebar = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const sidebarRef = useRef<HTMLDivElement>(null);
    const currentPath = window.location.pathname;
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const user_id = {
        _id: user as string,
    };

    const {
        data: allEventData = [],
        error,
        isLoading,
    } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    useEffect(() => {
        if (!isOpen) return;

        const isMobile = window.innerWidth <= 768;

        if (!isMobile) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <button
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                ref={sidebarRef}
                aria-label="Sidebar"
                className={`fixed h-full p-6 w-64 z-50 border-r transition-transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}
                id="sidebar"
            >
                <div className="flex items-center justify-between h-32">
                    <Link aria-label="Home" href="/">
                        <img alt="logo" className="h-32" src={logo} />
                    </Link>
                    <button
                        aria-label="Close sidebar"
                        className="md:hidden"
                        onClick={onClose}
                    >
                        <RxCross2 size={30} />
                    </button>
                </div>
                {siteConfig.sideItems.map((item) => (
                    <div key={item.href} className="my-2">
                        <Link
                            key={item.href}
                            aria-label={item.label}
                            className={
                                clsx(
                                    linkStyles({
                                        color: 'foreground',
                                    }),
                                    'data-[active=true]:text-primary data-[active=true]:font-medium cursor-pointer',
                                    currentPath === item.href &&
                                        'text-violet-500 bg-default-100 font-medium',
                                ) +
                                ' flex items-center gap-2 p-2 rounded-lg hover:bg-default-100 dark:hover:bg-default-800 dark:hover:text-default-100'
                            }
                            onClick={() => navigate(item.href)}
                        >
                            {/* icon */}
                            {item.icon === 'event' && (
                                <BiCalendarStar className="w-6 h-6 mx-4" />
                            )}
                            {item.icon === 'calendar' && (
                                <LuCalendarClock className="w-6 h-6 mx-4" />
                            )}
                            {item.icon === 'todo' && (
                                <GoChecklist className="w-6 h-6 mx-4" />
                            )}
                            {/* label */}
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    </div>
                ))}
                <hr className="my-4 border-1 border-violet-200 dark:border-default-700" />
                {/* list events */}
                <div className="flex flex-col gap-2">
                    <h3 className="text-md text-foreground-400 font-medium">
                        Your Events
                    </h3>
                    {error ? (
                        <div>Error loading events: {error.message}</div>
                    ) : (
                        <Skeleton isLoaded={!isLoading}>
                            <ul className="flex flex-col gap-2">
                                {allEventData &&
                                    allEventData.map(
                                        (event) =>
                                            (event.staff?.some(
                                                (staff) =>
                                                    staff.stdID === user_id._id,
                                            ) ||
                                                event.participants.includes(
                                                    user_id._id,
                                                )) && (
                                                <li
                                                    key={event._id}
                                                    className=""
                                                >
                                                    <Link
                                                        aria-label={
                                                            event.eventName
                                                        }
                                                        className={clsx(
                                                            linkStyles({
                                                                color: 'foreground',
                                                            }),
                                                            'data-[active=true]:text-primary data-[active=true]:font-medium cursor-pointer',
                                                            currentPath.includes(
                                                                event._id,
                                                            ) &&
                                                                'text-violet-500 bg-default-100',
                                                            'flex items-center gap-2 p-2 rounded-lg hover:bg-default-100 dark:hover:bg-default-800 dark:hover:text-default-100',
                                                        )}
                                                        onClick={() => {
                                                            const eventID =
                                                                event._id;

                                                            navigate(
                                                                `/workspace/${eventID}`,
                                                                {
                                                                    state: {
                                                                        event,
                                                                    },
                                                                },
                                                            );
                                                            onClose();
                                                        }}
                                                    >
                                                        <motion.span
                                                            animate={
                                                                currentPath.includes(
                                                                    event._id,
                                                                )
                                                                    ? {
                                                                          scale: [
                                                                              1,
                                                                              1.2,
                                                                              1,
                                                                          ],
                                                                      }
                                                                    : {}
                                                            }
                                                            className={`flex mr-2 items-center justify-center w-3 h-3 rounded-full ring-4 ${
                                                                currentPath.includes(
                                                                    event._id,
                                                                )
                                                                    ? 'bg-violet-700 ring-violet-400'
                                                                    : 'bg-foreground-500 ring-0 ring-transparent'
                                                            }`}
                                                            transition={{
                                                                duration: 1,
                                                                repeat: Infinity,
                                                                ease: 'easeInOut',
                                                            }}
                                                        />
                                                        <span className="capitalize truncate">
                                                            {event.eventName}
                                                        </span>
                                                    </Link>
                                                </li>
                                            ),
                                    )}
                            </ul>
                        </Skeleton>
                    )}
                </div>
            </aside>
        </>
    );
};
