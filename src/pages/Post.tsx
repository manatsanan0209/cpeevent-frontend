import React from 'react';
import {
    Tabs,
    Tab,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Select,
    SelectItem,
} from '@nextui-org/react';
import { LuMoreHorizontal } from 'react-icons/lu';
import { IoIosArrowDropdownCircle } from 'react-icons/io';

import DefaultLayout from '@/layouts/default';
import AllPostEvent from '@/components/post/AllPostEvent';
import CalendarPage from '@/components/post/CalendarEvent';
import { posts } from '@/data/post';

export default function Post() {
    const [Filter, setFilter] = React.useState('all');
    const filteredPosts =
        Filter === 'all' ? posts : posts.filter((post) => post.kind === Filter);

    return (
        <DefaultLayout>
            <div className="flex mb-4 text-left mt-4 ml">
                <h2 className="flex-col m-0 text-4xl font-bold w-11/12 text-zinc-600">
                    Comcamp 34
                </h2>
                <Dropdown className="flex justify-end">
                    <DropdownTrigger>
                        <button>
                            <LuMoreHorizontal className="flex-col text-2xl mt-2 text-zinc-600" />
                        </button>
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
                <Tab
                    key="All"
                    title={
                        <div className="flex w-24 font-bold bg-transparent">
                            <Select
                                className="w-full"
                                color="secondary"
                                defaultSelectedKeys={[Filter]}
                                placeholder="All"
                                selectedKeys={[Filter]}
                                selectorIcon={<IoIosArrowDropdownCircle />}
                                size="md"
                                style={{
                                    fontWeight: 'bold',
                                    backgroundColor: 'transparent',
                                }}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <SelectItem key="all" value="all">
                                    All
                                </SelectItem>
                                <SelectItem key="vote" value="vote">
                                    Vote
                                </SelectItem>
                                <SelectItem key="post" value="post">
                                    Post
                                </SelectItem>
                                <SelectItem key="poll" value="poll">
                                    Poll
                                </SelectItem>
                                <SelectItem key="form" value="form">
                                    Form
                                </SelectItem>
                            </Select>
                        </div>
                    }
                >
                    <AllPostEvent posts={filteredPosts} />
                </Tab>
                <Tab key="Calendar" title="Calendar">
                    <CalendarPage />
                </Tab>
                <Tab key="notification" title="notification">
                    <CalendarPage />
                </Tab>
            </Tabs>
        </DefaultLayout>
    );
}
