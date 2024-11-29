import type { Event } from '@/types/index';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';

import { axiosAPIInstance } from '@/api/axios-config';
import New3 from '@/images/New3.png';

export default function EventHome() {
    const [page, setPage] = useState(0);
    const eventsPerPage = 3;

    const fetchEvents = async () => {
        const response = await axiosAPIInstance.get('v1/events');

        return response.data.data;
    };

    const {
        data: events,
        isLoading,
        error,
    } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading events</div>;

    const startIndex = page * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const currentEvents = events ? events.slice(startIndex, endIndex) : [];

    return (
        <>
            <div className="flex flex-row">
                <p className="text-zinc-600 font-bold text-4xl ">Event</p>
                <Button
                    className="w-1/5 text-base font-semibold ml-auto"
                    color="primary"
                >
                    See all events
                </Button>
            </div>
            <div className="flex justify-center w-full">
                {page > 0 && (
                    <button onClick={() => setPage(page - 1)}>
                        <GrFormPrevious />
                    </button>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-8">
                    {currentEvents.map((event) => (
                        <Card
                            key={event._id}
                            className="shadow-md shadow-slate-300"
                        >
                            <CardHeader>
                                <div className="text-zinc-600 font-semibold text-xl">
                                    {event.eventName}
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="flex flex-row">
                                    <img
                                        alt="Event"
                                        className="w-1/2 rounded-lg shadow-lg h-28"
                                        src={New3}
                                    />
                                    <div className="text-sm text-zinc-600 ml-3">
                                        {event.eventDescription}
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="text-sm text-zinc-600 mt-3">
                                        <span className="font-bold">
                                            Start date:{' '}
                                        </span>
                                        <span className="font-normal">
                                            {new Date(
                                                event.startDate,
                                            ).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <Button
                                        className="flex text-tiny font-semibold justify-end ml-auto bg-blue-500 text-white"
                                        size="sm"
                                    >
                                        See more
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
                {events && endIndex < events.length && (
                    <button onClick={() => setPage(page + 1)}>
                        <MdOutlineNavigateNext />
                    </button>
                )}
            </div>
        </>
    );
}
