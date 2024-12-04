import type { Event } from '@/types/index';

import { useState } from 'react';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tabs,
    Tab,
    useDisclosure,
} from '@nextui-org/react';
import { LuMoreHorizontal } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { FullCalendar } from '@/components/calendarComponents/fullCalendar';

import { fetchEvents } from '@/hooks/api';
import MembersPage from '@/components/post/members';
import LeaveEventModal from '@/components/post/leaveEventModal';
import DefaultLayout from '@/layouts/default';
interface Props {
    children: React.ReactNode;
}

export default function Post(props: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [backdrop, setBackdrop] = useState<'opaque' | 'transparent' | 'blur'>(
        'opaque',
    );
    const { eventid } = useParams<{ eventid: string }>();

    const { data: events = [], error } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    const event = events.find((event) => event._id === eventid);
    const eventName = event
        ? event.eventName
        : error
        ? 'Error fetching event'
        : 'Event not found';

    const handleOpen = (backdrop: 'opaque' | 'transparent' | 'blur') => {
        setBackdrop(backdrop);
        onOpen();
    };

    return (
        <DefaultLayout>
            <div className="flex mb-4 text-left ml">
                <h2 className="flex-col m-0 text-4xl font-bold w-11/12 text-zinc-600 capitalize">
                    {eventName}
                </h2>
                <Dropdown className="flex justify-end">
                    <DropdownTrigger>
                        <div
                            className="flex-col text-2xl mt-2 text-zinc-600 cursor-pointer"
                            role="button"
                        >
                            <LuMoreHorizontal />
                        </div>
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem
                            key="leave"
                            className="text-danger"
                            color="danger"
                            onPress={() => handleOpen('opaque')}
                        >
                            Leave Event
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <div className="">
                <Tabs
                    key="secondary"
                    fullWidth
                    color="secondary"
                    size="md"
                    style={{ fontWeight: 'bold' }}
                    variant="underlined"
                >
                    <Tab key="Post" title="Post">
                        {props.children}
                    </Tab>
                    <Tab key="Calendar" title="Calendar">
                        <FullCalendar
                            
                        />
                    </Tab>
                    <Tab key="Member" title="Member">
                        <MembersPage />
                    </Tab>
                </Tabs>
            </div>
            {eventid ? (
                <LeaveEventModal
                    backdrop={backdrop}
                    eventID={eventid}
                    isOpen={isOpen}
                    onClose={onClose}
                />
            ) : null}
            {/* <LeaveEventModal
                backdrop={backdrop}
                eventID={eventid}
                isOpen={isOpen}
                onClose={onClose}
            /> */}
        </DefaultLayout>
    );
}
