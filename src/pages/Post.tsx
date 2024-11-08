import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Tabs,
    Tab,
} from '@nextui-org/react';
import { LuMoreHorizontal } from 'react-icons/lu';
import { useLocation, useParams } from 'react-router-dom';

import DefaultLayout from '@/layouts/default';
import { axiosAPIInstance } from '@/api/axios-config';
import { useQuery } from '@tanstack/react-query';
import { PostEventProps } from '@/types';
import { ChildProcess } from 'child_process';
import CalendarPage from './calendar';

interface Props {
    children: React.ReactNode;
}

export default function Post(props: Props) {
    const location = useLocation();
    // const { event } = location.state as { event: Event };
    let { eventid } = useParams();

    

    return (
        <DefaultLayout>
            <div className="flex mb-4 text-left ml">
                <h2 className="flex-col m-0 text-4xl font-bold w-11/12 text-zinc-600 capitalize">
                    {/* {event.eventName} */}
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
                            // href="/post/create"
                            className="text-zinc-600"
                        >
                            Member
                        </DropdownItem>
                        <DropdownItem
                            // href="/post/create"
                            key="leave"
                            className="text-danger"
                            color="danger"
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
                    <Tab key="Notification" title="Notifications">
                        <CalendarPage />
                    </Tab>
                </Tabs>
            </div>
        </DefaultLayout>
    );
}
