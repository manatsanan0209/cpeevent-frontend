import { Tabs, Tab } from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';

import { axiosAPIInstance } from '@/api/axios-config.ts';
import DefaultLayout from '@/layouts/default';
import AllEvent from '@/components/eventComponents/AllEvent.tsx';
import { AuthContext } from '@/context/AuthContext';
import JoinedEvent from '@/components/eventComponents/JoinedEvent';

export default function Event() {
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
        <DefaultLayout>
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
        </DefaultLayout>
    );
}
