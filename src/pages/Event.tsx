import { Tabs, Tab } from '@nextui-org/react';

import { events } from '../data/events.ts';
import { user } from '../data/user.ts';

import DefaultLayout from '@/layouts/default';
import AllEvent from '@/components/eventComponents/AllEvent.tsx';
import JoinedEvent from '@/components/eventComponents/JoinedEvent.tsx';

export default function Event() {
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
                    <AllEvent events={events} user={user} />
                </Tab>

                <Tab key="Joined" title="Joined">
                    <JoinedEvent
                        events={events.filter((event) =>
                            event.participants.includes(user.student_id),
                        )}
                        user={user}
                    />
                </Tab>
            </Tabs>
        </DefaultLayout>
    );
}
