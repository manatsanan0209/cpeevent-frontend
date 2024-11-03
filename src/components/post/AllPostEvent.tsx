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

import { SearchIcon } from '../icons';

import voteImage from '@/images/Vote.png';
import formImage from '@/images/Form.png';
import postImage from '@/images/Post.png';
import pollImage from '@/images/Poll.png';

interface PostEventProps {
    _id: string;
    kind: string;
    assignTo: string;
    title: string;
    description: string;
    postDate: string;
    endDate: string | null;
    author: string;
    markdown: string;
    questions?: {
        question: string;
        type: string;
        options: string[];
    }[];
}

interface AllPostEventProps {
    posts: PostEventProps[];
}

export default function AllPostEvent({ posts = [] }: AllPostEventProps) {
    const [sortedEvents, setSortedPosts] = useState<PostEventProps[]>(posts);
    const [sortOption, setSortOption] = useState<string>('DateDSC');
    const [searchInput, setSearchInput] = useState<string>('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const sortEvents = (option: string) => {
        let sortedArray = [...posts];

        switch (option) {
            case 'DateASC':
                sortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(a.postDate).getTime() -
                        new Date(b.postDate).getTime();

                    if (dateComparison !== 0) return dateComparison;

                    return a.title.localeCompare(b.title);
                });
                break;
            case 'DateDSC':
                sortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(b.postDate).getTime() -
                        new Date(a.postDate).getTime();

                    if (dateComparison !== 0) return dateComparison;

                    return b.title.localeCompare(a.title);
                });
                break;
            case 'NameASC':
                sortedArray.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'NameDSC':
                sortedArray.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                break;
        }
        setSortedPosts(sortedArray);
    };

    useEffect(() => {
        sortEvents(sortOption);
    }, [sortOption, posts]);

    useEffect(() => {
        const filteredPosts = posts.filter((post) =>
            post.title.toLowerCase().includes(searchInput.toLowerCase()),
        );

        setSortedPosts(filteredPosts);
    }, [searchInput, posts]);

    const displayEventStatus = (kind: string) => {
        switch (kind) {
            case 'poll':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-3 text-green-500" />
                        <span className="text-green-500 text-sm font-semibold">
                            Poll
                        </span>
                    </span>
                );
            case 'post':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-5 text-violet-700" />
                        <span className="text-violet-700 text-sm font-medium">
                            Post
                        </span>
                    </span>
                );
            case 'vote':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-yellow-500" />
                        <span className="text-yellow-500 text-sm font-medium">
                            Vote
                        </span>
                    </span>
                );
            case 'form':
                return (
                    <span className="flex flex-row">
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-blue-500" />
                        <span className="text-blue-500 text-sm font-medium">
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

    return (
        <div>
            <div className="flex flex-row justify-between my-2">
                <div className="w-1/4 mx-20">
                    <Input
                        aria-label="Search"
                        classNames={{
                            inputWrapper: 'bg-white shadow-lg',
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
                {/* Sort by */}
                <div className="flex w-1/4 mx-20">
                    <div className="w-20 mt-2 text-sm">Sort by</div>
                    <Select
                        disallowEmptySelection
                        isRequired
                        aria-label="Sort by"
                        className="max-w-xs"
                        defaultSelectedKeys={[sortOption]}
                        selectedKeys={[sortOption]}
                        style={{
                            boxShadow: '0 8px 10px rgba(82, 82, 91, 0.1)',
                        }}
                        variant="bordered"
                        onChange={(e) => setSortOption(e.target.value)}
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

            {/* card */}
            <div className="max-w-full gap-6 grid grid-cols-12 grid-rows-2 px-8 my-8">
                {sortedEvents.map((post) => (
                    <Card
                        key={post._id}
                        className="col-span-12 sm:col-span-4 h-[300px]"
                    >
                        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                            {displayEventStatus(post.kind)}
                            <h4 className="text-zinc-600 font-bold text-large ">
                                {post.title}
                            </h4>
                            <p className="text-tiny text-zinc-600/60">
                                {post.description}
                            </p>
                            <p className="text-tiny text-zinc-600/60">
                                Assign To: {post.assignTo}
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
                                <p className="text-black text-tiny">
                                    Post Date: {post.postDate}
                                </p>
                                <p className="text-black text-tiny">
                                    End Date: {post.endDate}
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
                ))}
            </div>
        </div>
    );
}
