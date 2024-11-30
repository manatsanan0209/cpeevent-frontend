import { useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

import { axiosAPIInstance } from '@/api/axios-config';
import New3 from '@/images/New3.png';

export default function EventHome() {
    const [page, setPage] = useState(0);
    const eventsPerPage = 3;

    const fetchEvents = async () => {
        const response = await axiosAPIInstance.get('v1/events');

        return response.data.data;
    };

    const navigate = useNavigate();

    const {
        data: events,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading events</div>;

    const startIndex = page * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const currentEvents = events ? events.slice(startIndex, endIndex) : [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <p className="text-zinc-600 font-bold text-4xl">Event</p>
                <Button
                    className="w-1/5 text-base font-semibold"
                    color="primary"
                    onClick={() => navigate('/events')}
                >
                    See all events
                </Button>
            </div>

            <div className="flex justify-center items-center">
                <button
                    className={
                        page === 0
                            ? 'flex items-center justify-center w-7 h-7 bg-zinc-300 text-white rounded-full mr-2'
                            : 'flex items-center justify-center w-7 h-7 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition duration-300 mr-2'
                    }
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                >
                    <GrFormPrevious className="text-xl" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 justify-items-center w-full max-w-screen-xl mx-auto">
                    {currentEvents.map(
                        (event: {
                            _id: string;
                            eventName: string;
                            eventDescription: string;
                            startDate: string;
                        }) => (
                            <Card
                                key={event._id}
                                className="shadow-md shadow-slate-300 w-full max-w-md"
                            >
                                <CardHeader>
                                    <div className="text-zinc-600 font-semibold text-xl h-7 w-full overflow-hidden text-ellipsis whitespace-nowrap">
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
                                        <div className="text-sm text-zinc-600 ml-3 w-11/12 h-20 overflow-hidden text-ellipsis line-clamp-4">
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
                        ),
                    )}
                </div>
                <button
                    className={
                        events && endIndex < events.length
                            ? 'flex items-center justify-center w-7 h-7 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition duration-300 ml-2'
                            : 'flex items-center justify-center w-7 h-7 bg-zinc-300 text-white rounded-full ml-2'
                    }
                    disabled={!(events && endIndex < events.length)}
                    onClick={() => setPage(page + 1)}
                >
                    <MdOutlineNavigateNext className="text-xl" />
                </button>
            </div>
        </div>
    );
}
