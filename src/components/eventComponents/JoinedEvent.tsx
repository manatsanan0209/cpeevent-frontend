import {
    Accordion,
    AccordionItem,
    Button,
    Input,
    Kbd,
    Select,
    SelectItem,
} from '@nextui-org/react';
import { GrStatusGoodSmall } from 'react-icons/gr';
import { useEffect, useState } from 'react';

import { SearchIcon } from '../icons';

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

interface AllEventProps {
    events: Event[];
}

export default function JoinedEvent({ events }: AllEventProps) {
    const [sortedAndSearchEvents, setSortedAndSearchEvents] = useState<Event[]>(
        [],
    );

    const [sortOption, setSortOption] = useState<string>('DateDSC');
    const [searchInput, setSearchInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setSortedAndSearchEvents(
            sortedAndSearchEventsFunc(sortOption, searchInput),
        );
        setIsLoading(false);
    }, [sortOption, searchInput]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const searchInputComponent = (
        <Input
            aria-label="Search"
            classNames={{
                inputWrapper: 'bg-white shadow-lg',
                input: 'text-sm',
            }}
            endContent={
                <Kbd className="hidden lg:inline-block" keys={['command']}>
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
    );

    function getCurrentTime(): string {
        const now = new Date();

        return now.toISOString();
    }

    function eventStatus(event: Event) {
        const current_time = getCurrentTime();

        if (current_time < event.startDate) {
            return 'Upcoming';
        } else if (current_time > event.endDate) {
            return 'Ended';
        } else {
            return 'Ongoing';
        }
    }

    function displayEventStatus(event: Event) {
        const status = eventStatus(event);

        if (status == 'Upcoming') {
            return (
                <span className="flex flex-row">
                    <span>
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-green-500" />
                    </span>
                    <span className="text-blue-500">Upcoming</span>
                </span>
            );
        } else if (status == 'Ended') {
            return (
                <span className="flex flex-row">
                    <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-rose-600" />
                    <span className="text-blue-500">Ended</span>
                </span>
            );
        } else {
            return (
                <span className="flex flex-row">
                    <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-yellow-500" />
                    <span className="text-blue-500">Ongoing</span>
                </span>
            );
        }
    }

    function sortedAndSearchEventsFunc(
        option: string,
        searchTerm: string,
    ): Event[] {
        let newSortedArray = [...events];

        switch (option) {
            case 'DateASC':
                newSortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime();

                    return dateComparison;
                });
                break;
            case 'DateDSC':
                newSortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(b.startDate).getTime() -
                        new Date(a.startDate).getTime();

                    return dateComparison;
                });
                break;
            case 'NameASC':
                newSortedArray.sort((a, b) =>
                    a.eventName.localeCompare(b.eventName),
                );
                break;
            case 'NameDSC':
                newSortedArray.sort((a, b) =>
                    b.eventName.localeCompare(a.eventName),
                );
                break;
            default:
                break;
        }

        return newSortedArray.filter((event) =>
            event.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }

    return (
        <>
            <div className="flex flex-row justify-between ">
                {/* Search */}
                <div className=" w-1/4 mx-20 my-8 justify-start mb-4 md:mb-0">
                    {searchInputComponent}
                </div>
                {/* Sort by */}
                <div className=" w-1/4 mx-20 my-8 item-start flex flex-row">
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
            {!isLoading && (
                <div className="mx-8">
                    <Accordion variant="splitted">
                        {sortedAndSearchEvents.map((event) => {
                            return (
                                <AccordionItem
                                    key={event._id}
                                    aria-label={event.eventName}
                                    title={
                                        <div className="flex flex-row">
                                            <span
                                                className="w-5/12 text-zinc-600"
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                {event.eventName}
                                            </span>
                                            <span className="text-sm w-3/12 pt-1">
                                                {displayEventStatus(event)}
                                            </span>
                                            <span className="flex justify-end text-sm w-4/12 pt-1 pr-8">
                                                <span
                                                    className="text-zinc-600"
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Start Date :{''}
                                                </span>
                                                <span className="text-blue-500 ml-2">
                                                    {event.startDate
                                                        .substring(0, 10)
                                                        .replace(/-/g, '/')}
                                                </span>
                                            </span>
                                        </div>
                                    }
                                >
                                    <div className="flex flex-row">
                                        <div className="flex flex-col text-wrap w-1/2 mx-12 my">
                                            <div
                                                className="text-zinc-600"
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                Description
                                            </div>
                                            <p className="text-zinc-500">
                                                {event.eventDescription}
                                            </p>
                                        </div>
                                        <div className="flex flex-col text-wrap w-1/4">
                                            <div
                                                className="text-zinc-600"
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                Poster
                                            </div>
                                            <div className="text-zinc-500">
                                                {event.poster ? (
                                                    <img
                                                        alt="Poster"
                                                        src={event.poster}
                                                    />
                                                ) : (
                                                    'No poster available'
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col text-wrap w-1/4">
                                            <Button
                                                aria-label="Go to Workspace"
                                                className="mx-12 my-5 bg-blue-500 text-white"
                                            >
                                                <strong>Workspace</strong>
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </div>
            )}
        </>
    );
}
