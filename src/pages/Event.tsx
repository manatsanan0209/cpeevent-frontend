import type { Event } from '@/types/index';

import { Tabs, Tab, Skeleton } from '@nextui-org/react';
import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

import DefaultLayout from '@/layouts/default';
import AllEvent from '@/components/eventComponents/AllEvent.tsx';
import { AuthContext } from '@/context/AuthContext';
import JoinedEvent from '@/components/eventComponents/JoinedEvent';
import { fetchEvents } from '@/hooks/api';

export default function Event() {
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
                                events={
                                    allEventData &&
                                    allEventData.filter(
                                        (event) =>
                                            event.staff?.some(
                                                (staff) =>
                                                    staff.stdID === user_id._id,
                                            ) ||
                                            event.participants?.some(
                                                (participant) =>
                                                    participant === user_id._id,
                                            ),
                                    )
                                }
                            />
                        </Tab>
                    </Tabs>
                </Skeleton>
            )}
        </DefaultLayout>
    );
}
