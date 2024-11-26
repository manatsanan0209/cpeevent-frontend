import type { Event } from '@/types/index';

import { Tabs, Tab, Skeleton, Button } from '@nextui-org/react';
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { axiosAPIInstance } from '@/api/axios-config.ts';
import DefaultLayout from '@/layouts/default';
import AllEvent from '@/components/eventComponents/AllEvent.tsx';
import { AuthContext } from '@/context/AuthContext';
import JoinedEvent from '@/components/eventComponents/JoinedEvent';

export default function Event() {
    const { user, access } = useContext(AuthContext);
    const navigate = useNavigate();
    const user_id = {
        _id: user as string,
    };

    const fetchEvents = async () => {
        const response = await axiosAPIInstance.get('v1/events');

        return response.data.data;
    };

    const {
        data: allEventData = [],
        error,
        isLoading,
    } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    return (
        <DefaultLayout>
            {error ? (
                <div>Error loading events: {error.message}</div>
            ) : (
                <Skeleton isLoaded={!isLoading}>
                    <Tabs
                        key="secondary"
                        fullWidth
                        color="secondary"
                        size="md"
                        style={{ fontWeight: 'bold' }}
                        variant="underlined"
                    >
                        <Tab key="All" title="All">
                            <AllEvent events={allEventData} user={user_id} />
                        </Tab>

                        <Tab key="Joined" title="Joined">
                            <JoinedEvent
                                events={allEventData.filter((event) =>
                                    event.staff?.some(
                                        (staff) => staff.stdID === user_id._id,
                                    ),
                                )}
                            />
                        </Tab>
                    </Tabs>
                    {parseInt(access) > 1 && (
                        <div className="flex justify-center">
                            <div className="flex w-full rounded-lg justify-center ">
                                <Button
                                    color="primary"
                                    onPress={() => navigate('/events/create')}
                                >
                                    Create Event
                                </Button>
                            </div>
                        </div>
                    )}
                </Skeleton>
            )}
        </DefaultLayout>
    );
}
