import type { PostEventProps, Event } from '@/types/index';

import {
    Tabs,
    Tab,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from '@nextui-org/react';
import { LuMoreHorizontal } from 'react-icons/lu';
import { useLocation } from 'react-router-dom';
import { axiosAPIInstance } from '@/api/axios-config.ts';

import DefaultLayout from '@/layouts/default';
import AllPostEvent from '@/components/post/AllPostEvent';
import CalendarPage from '@/components/post/CalendarEvent';
import { useQuery } from '@tanstack/react-query';
// import { posts } from '@/data/post';

export default function Post() {
    const location = useLocation();
    const { event } = location.state as { event: Event };

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(
            `v1/event/${event._id}/posts`,
        );

        return response.data.data;
    };

    const { data: posts = [] } = useQuery<PostEventProps[]>({
        queryKey: ['posts', event._id],
        queryFn: fetchPosts,
    });

    console.log(event._id);
    console.log(posts);

    return (
        <DefaultLayout>
            <div className="flex mb-4 text-left ml">
                <h2 className="flex-col m-0 text-4xl font-bold w-11/12 text-zinc-600 capitalize">
                    {event.eventName}
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
            <Tabs
                key="secondary"
                fullWidth
                color="secondary"
                size="md"
                style={{ fontWeight: 'bold' }}
                variant="underlined"
            >
                <Tab key="Post" title="Post">
                    <AllPostEvent posts={posts} />
                </Tab>
                <Tab key="Calendar" title="Calendar">
                    <CalendarPage />
                </Tab>
                <Tab key="Notification" title="Notifications">
                    <CalendarPage />
                </Tab>
            </Tabs>
        </DefaultLayout>
    );
}
