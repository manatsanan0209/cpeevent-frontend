import { siteConfig } from '@/config/site';
import { axiosAPIInstance } from '@/api/axios-config.ts';
import { AuthContext } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import { Logo } from '@/components/icons';
import { Link, link as linkStyles } from '@nextui-org/react';
import { BiCalendarStar } from 'react-icons/bi';
import { LuCalendarClock } from 'react-icons/lu';
import { GoChecklist } from 'react-icons/go';
import clsx from 'clsx';

export const Sidebar = () => {
    const currentPath = window.location.pathname;
    const navigate = useNavigate();

    // type KindColor =
    //     | 'default'
    //     | 'primary'
    //     | 'secondary'
    //     | 'success'
    //     | 'warning'
    //     | 'danger';

    // const kindColor: { [key: string]: KindColor } = {
    //     competition: 'danger',
    //     camp: 'success',
    //     seminar: 'secondary',
    //     training: 'warning',
    // };

    interface Event {
        _id: string;
        eventName: string;
        eventDescription: string;
        nParticipant: number;
        participants: string[];
        nStaff: number;
        startDate: string;
        endDate: string;
        president: string;
        kind: string;
        role: string[];
        icon: string | null;
        poster: string | null;
        postList: string[];
        staff: {
            stdID: string;
            role: string;
        }[];
    }

    const [allEventData, setAllEventData] = useState<Event[]>([]);
    const { user } = useContext(AuthContext);
    const user_id = {
        _id: user as string,
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosAPIInstance.get('v1/events');

                setAllEventData(response.data.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);
    return (
        <aside
            id="sidebar"
            className="fixed h-full p-6 w-64 z-50 border-r transition-transform -translate-x-full md:translate-x-0"
            aria-label="Sidebar"
        >
            <div className="flex items-center justify-center h-32">
                <Link href="/" aria-label="Home">
                    <Logo className="w-32 h-32 " />
                </Link>
            </div>
            {siteConfig.sideItems.map((item) => (
                <Link
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className={clsx(
                        linkStyles({
                            color: 'foreground',
                        }),
                        'data-[active=true]:text-primary data-[active=true]:font-medium cursor-pointer',
                        currentPath === item.href &&
                            'text-violet-500 bg-default-100 font-medium',
                        'flex items-center gap-2 my-4 p-2 rounded-lg hover:bg-default-100 dark:hover:bg-default-800 dark:hover:text-default-100',
                    )}
                    aria-label={item.label}
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
            ))}
            <hr className="my-4 border-1 border-violet-200 dark:border-default-700" />
            {/* list events */}
            <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">Events</h3>
                <ul className="flex flex-col gap-2 ml-2 list-disc">
                    {allEventData.map(
                        (event) =>
                            event.staff?.some(
                                (staff) => staff.stdID === user_id._id,
                            ) && (
                                <li key={event._id} className="ml-4">
                                    <Link
                                        onClick={() => {
                                            const eventID = event._id;

                                            navigate(`/workspace/${eventID}`, {
                                                state: { event },
                                            });
                                        }}
                                        className={clsx(
                                            linkStyles({
                                                color: 'foreground',
                                            }),
                                            'data-[active=true]:text-primary data-[active=true]:font-medium cursor-pointer',
                                            currentPath ===
                                                `/workspace/${event._id}` &&
                                                'text-violet-500 bg-default-100',
                                            'flex items-center gap-2 p-2 rounded-lg hover:bg-default-100 dark:hover:bg-default-800 dark:hover:text-default-100',
                                        )}
                                        aria-label={event.eventName}
                                    >
                                        <span>{event.eventName}</span>
                                        {/* <Chip
                                            color={kindColor[event.kind.toLowerCase()]}
                                            variant="flat"
                                        >
                                            {event.kind}
                                        </Chip> */}
                                    </Link>
                                </li>
                            ),
                    )}
                </ul>
            </div>
        </aside>
    );
};
