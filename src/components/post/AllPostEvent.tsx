import type { PostEventProps } from '@/types/index';

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardFooter,
    Image,
    Button,
    Input,
    Select,
    SelectItem,
    Kbd,
} from '@nextui-org/react';
import { GrStatusGoodSmall } from 'react-icons/gr';
import { IoFilter } from 'react-icons/io5';

import { SearchIcon } from '../icons';

import voteImage from '@/images/Vote.png';
import formImage from '@/images/Form.png';
import postImage from '@/images/Post.png';
import pollImage from '@/images/Poll.png';

export default function AllPostEvent({ posts }: { posts: PostEventProps[] }) {
    // const [sortOption, setSortOption] = useState<string>('DateDSC');
    const [searchInput, setSearchInput] = useState<string>('');
    const [sortOption, setSortOption] = useState<string>('DateDSC');
    const [sortedAndSearchEvents, setSortedAndSearchEvents] = useState<
        PostEventProps[]
    >([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filterOption, setFilterOption] = useState<string>('all');

    useEffect(() => {
        setSortedAndSearchEvents(
            sortedAndSearchEventsFunc(sortOption, searchInput, filterOption),
        );
        setIsLoading(false);
    }, [sortOption, searchInput, filterOption, posts]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    function sortedAndSearchEventsFunc(
        option: string,
        searchTerm: string,
        filter: string,
    ): PostEventProps[] {
        let newSortedArray = [...posts];

        switch (option) {
            case 'DateASC':
                newSortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(a.postDate).getTime() -
                        new Date(b.postDate).getTime();

                    return dateComparison;
                });
                break;
            case 'DateDSC':
                newSortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(b.postDate).getTime() -
                        new Date(a.postDate).getTime();

                    return dateComparison;
                });
                break;
            case 'NameASC':
                newSortedArray.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'NameDSC':
                newSortedArray.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                break;
        }

        if (filter !== 'all') {
            newSortedArray = newSortedArray.filter(
                (post) => post.kind === filter,
            );
        }

        return newSortedArray.filter((post) =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }

    const displayPostStatus = (kind: string) => {
        switch (kind) {
            case 'poll':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-3 text-green-500" />
                        <span className="text-zinc-600 text-sm font-semibold">
                            Poll
                        </span>
                    </span>
                );
            case 'post':
                return (
                    <span className="flex flex-row ">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-3 text-violet-700" />
                        <span className="text-violet-700 text-sm font-semibold">
                            Post
                        </span>
                    </span>
                );
            case 'vote':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-3 text-yellow-400" />
                        <span className="text-yellow-500 text-sm font-semibold">
                            Vote
                        </span>
                    </span>
                );
            case 'form':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-3 text-blue-500" />
                        <span className="text-zinc-600 text-sm font-medium">
                            Form
                        </span>
                    </span>
                );
            default:
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-gray-500" />
                        <span className="text-gray-500 text-sm">
                            Not specified
                        </span>
                    </span>
                );
        }
    };

    const getBackgroundImage = (kind: string) => {
        switch (kind) {
            case 'vote':
                return voteImage;
            case 'form':
                return formImage;
            case 'post':
                return postImage;
            case 'poll':
                return pollImage;
            default:
                return '';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime() + 7 * 60 * 60 * 1000;
        const diffMinutes = Math.floor(diff / (1000 * 60));
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            if (diffHours === 0) {
                return `${diffMinutes} minutes ago`;
            }

            return `${diffHours} hours ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays === -1) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('eg-GB', {
                // day: '2-digit',
                // month: '2-digit',
                // year: 'numeric',
            });
        }
    };

    return (
        <div>
            <div className="grid grid-cols-4 gap-4 mt-4 items-center px-8  ">
                {/* Search bar */}
                <div className="flex justify-center items-center content-center">
                    <Input
                        aria-label="Search"
                        classNames={{
                            inputWrapper: 'bg-white shadow-lg mx-auto',
                            input: 'text-sm',
                        }}
                        endContent={
                            <Kbd
                                className="hidden lg:inline-block"
                                keys={['command']}
                            >
                                K
                            </Kbd>
                        }
                        labelPlacement="outside"
                        placeholder="Search"
                        startContent={
                            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        type="search"
                        value={searchInput}
                        onChange={handleSearchChange}
                    />
                </div>
                {/* Filter */}
                <div className="flex col-start-3">
                    <div className="flex flex-row mr-4 ">
                        <div className="flex mr-2 items-center text-sm text-zinc-600 font-bold">
                            Filter
                        </div>
                        <div className="content-center">
                            <IoFilter className="flex" />
                        </div>
                    </div>
                    <div className="flex justify-center w-3/4 mx-auto">
                        <Select
                            disallowEmptySelection
                            isRequired
                            aria-label="Filter"
                            className="max-w-xs"
                            defaultSelectedKeys={[filterOption]}
                            selectedKeys={[filterOption]}
                            style={{ backgroundColor: '#DED1FF' }}
                            variant="bordered"
                            onChange={(e) =>
                                setFilterOption(e.target.value as string)
                            }
                        >
                            <SelectItem key="all" value="all">
                                All
                            </SelectItem>
                            <SelectItem key="poll" value="poll">
                                Poll
                            </SelectItem>
                            <SelectItem key="vote" value="vote">
                                Vote
                            </SelectItem>
                            <SelectItem key="post" value="post">
                                Post
                            </SelectItem>
                            <SelectItem key="form" value="form">
                                Form
                            </SelectItem>
                        </Select>
                    </div>
                </div>
                {/* Sort by */}
                <div className="flex items-center">
                    <div className="w-1/4 mr-4 items-center text-sm text-zinc-600 font-bold">
                        Sort by
                    </div>
                    <Select
                        disallowEmptySelection
                        isRequired
                        aria-label="Sort by"
                        className="max-w-xs"
                        selectedKeys={[sortOption]}
                        style={{
                            boxShadow: '0 8px 10px rgba(82, 82, 91, 0.1)',
                        }}
                        variant="bordered"
                        onChange={(e) =>
                            setSortOption(e.target.value as string)
                        }
                    >
                        <SelectItem key="DateDSC" value="DateDSC">
                            Date ( Descending )
                        </SelectItem>
                        <SelectItem key="DateASC" value="DateASC">
                            Date ( Ascending )
                        </SelectItem>
                        <SelectItem key="NameASC" value="NameASC">
                            Name ( A-Z )
                        </SelectItem>
                        <SelectItem key="NameDSC" value="NameDSC">
                            Name ( Z-A )
                        </SelectItem>
                    </Select>
                </div>
            </div>
            {!isLoading && (
                <div className="max-w-full gap-6 grid grid-cols-12 grid-rows-2 px-8 my-8">
                    {sortedAndSearchEvents.map((post) => {
                        return (
                            <Card
                                key={post._id}
                                className="col-span-12 sm:col-span-4 h-[300px]"
                            >
                                <CardHeader className="absolute z-10 top-1 flex-col items-start">
                                    <div className="flex flex-row w-full justify-between">
                                        <p className="flex items-center px-2 py-1 ">
                                            {displayPostStatus(post.kind)}
                                        </p>
                                        <p className="flex text-zinc-600 text-tiny items-center mr-4">
                                            {formatDate(post.postDate)}
                                        </p>
                                    </div>
                                    <div className="flex flex-row w-full">
                                        <h4 className="text-zinc-600 font-bold text-large w-full">
                                            {post.title}
                                        </h4>
                                        <p className="flex  text-sm bg-gray-50 text-rose-600 px-1 h-6 items-center rounded-lg">
                                            {post.assignTo}
                                        </p>
                                    </div>
                                    <p className="text-tiny text-zinc-600/80">
                                        {post.description}
                                    </p>
                                </CardHeader>
                                <Image
                                    removeWrapper
                                    alt="Card background"
                                    className="z-0 w-full h-full object-cover"
                                    src={getBackgroundImage(post.kind)}
                                />
                                <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
                                    <div>
                                        <p className="text-tiny text-zinc-600">
                                            End Date:{' '}
                                            <span
                                                className={
                                                    post.endDate &&
                                                    new Date(post.endDate) <
                                                        new Date()
                                                        ? 'text-rose-500'
                                                        : 'text-blue-500'
                                                }
                                            >
                                                {post.endDate
                                                    ? new Date(post.endDate) >=
                                                      new Date() // Check if end date is in the future
                                                        ? formatDate(
                                                              post.endDate,
                                                          )
                                                        : 'Ended'
                                                    : 'No end date'}
                                            </span>
                                        </p>
                                    </div>
                                    <Button
                                        className="text-tiny"
                                        color="primary"
                                        radius="full"
                                        size="sm"
                                    >
                                        Learn More
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
