import type { Event } from '@/types/index';

import React from 'react';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tabs,
    Tab,
    useDisclosure,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { LuMoreHorizontal } from 'react-icons/lu';
import { useParams } from 'react-router-dom';

import CalendarPage from './calendar';

import LeaveEventModal from '@/components/post/leaveEventModal';
import DefaultLayout from '@/layouts/default';
import { axiosAPIInstance } from '@/api/axios-config';
interface Props {
    children: React.ReactNode;
}

export default function Post(props: Props) {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [eventName, setEventName] = React.useState<string | null>(null);

    const [backdrop, setBackdrop] = React.useState<
        'opaque' | 'transparent' | 'blur'
    >('opaque');

    const handleOpen = (backdrop: 'opaque' | 'transparent' | 'blur') => {
        setBackdrop(backdrop);
        onOpen();
    };
    // let { eventid } = useParams();
    const { eventid } = useParams<{ eventid: string }>();

    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosAPIInstance.get('v1/events');
                const events: Event[] = response.data.data;

                const event = events.find((event) => event._id === eventid);

                if (event) {
                    setEventName(event.eventName);
                } else {
                    setEventName('Event not found');
                }
            } catch (error) {
                setEventName('Error fetching event');
            }
        };

        fetchEvents();
    }, [eventid]);

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
                        <CalendarPage />
                    </Tab>
                    <Tab key="Member" title="Member">
                        <CalendarPage />
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
