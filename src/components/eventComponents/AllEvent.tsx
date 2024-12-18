import type { Event } from '@/types/index';

import { useContext, useEffect, useState } from 'react';
import {
    Accordion,
    AccordionItem,
    Button,
    Input,
    Kbd,
    Select,
    SelectItem,
    useDisclosure,
} from '@nextui-org/react';
import { GrStatusGoodSmall } from 'react-icons/gr';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IoTrashBin } from 'react-icons/io5';

import { SearchIcon } from '../icons';

import JoinEventModal from './joinEventModal';
import DeleteEventModal from './deleteEventModal';

import { AuthContext } from '@/context/AuthContext';

interface User {
    _id: string;
}

interface AllEventProps {
    events: Event[];
    user: User;
    state: string;
}

export default function AllEvent({ events, user, state }: AllEventProps) {
    const { access } = useContext(AuthContext);
    const [sortedAndSearchEvents, setSortedAndSearchEvents] = useState<Event[]>(
        [],
    );
    const [sortOption, setSortOption] = useState<string>('DateDSC');
    const [searchInput, setSearchInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        isOpen: isDeleteModalOpen,
        onOpen: onOpenDeleteModal,
        onOpenChange: onOpenDeleteModalChange,
    } = useDisclosure();

    useEffect(() => {
        if (events && events.length > 0) {
            setSortedAndSearchEvents(
                sortedAndSearchEventsFunc(sortOption, searchInput),
            );
            setIsLoading(false);
        }
    }, [events, sortOption, searchInput]);

    useEffect(() => {
        if (events) {
            setSortedAndSearchEvents(
                sortedAndSearchEventsFunc(sortOption, searchInput),
            );
            setIsLoading(false);
        }
    }, [sortOption, searchInput]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const displayEventStatus = (event: Event) => {
        const status = eventStatus(event);

        if (status == 'Ongoing') {
            return (
                <span className="flex flex-row">
                    <span>
                        <GrStatusGoodSmall className="text-xs mt-0.5 mr-7 text-green-500" />
                    </span>
                    <span className="text-blue-500">Ongoing</span>
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
                    <span className="text-blue-500">Upcoming</span>
                </span>
            );
        }
    };

    function sortedAndSearchEventsFunc(
        option: string,
        searchTerm: string,
    ): Event[] {
        if (!events) return [];

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
    const eventStatus = (event: Event) => {
        const current_time = new Date(
            getCurrentTime().getTime() + 7 * 60 * 60 * 1000,
        );

        if (current_time < new Date(event.startDate)) {
            return 'Upcoming';
        } else if (current_time > new Date(event.endDate)) {
            return 'Ended';
        } else {
            return 'Ongoing';
        }
    };

    const getCurrentTime = (): Date => {
        return new Date();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    interface LocationState {
        targetID: string;
    }

    const locationState = useLocation();
    const { targetID } = (locationState.state as LocationState) || {};

    useEffect(() => {
        const e = document.getElementById(targetID);

        if (e) {
            e.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isLoading, targetID]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-8 items-center px-4 sm:px-10">
                <div className="flex justify-center items-center content-center">
                    <Input
                        aria-label="Search"
                        classNames={{
                            inputWrapper: 'flex bg-white shadow-lg mx-auto',
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
                <div className="flex content-center col-span-1 sm:col-end-5 mt-4 sm:mt-0">
                    <div className="w-full sm:w-1/4 mr-4 mt-2 text-sm text-zinc-600 font-bold">
                        Sort by
                    </div>
                    <Select
                        disallowEmptySelection
                        isRequired
                        aria-label="Sort by"
                        className="w-full sm:max-w-xs mx-auto"
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
            {state === 'All' && parseInt(access) > 2 && (
                <div className="mx-4 sm:mx-10 my-2">
                    <Button
                        fullWidth
                        className="h-24 border-2 border-dashed border-foreground-300 text-foreground-400"
                        variant="light"
                        onPress={() => navigate('/events/create')}
                    >
                        <div className="flex-col grid justify-items-center">
                            <IoAddCircleOutline size={40} />
                            <p className="text-lg">Create Event</p>
                        </div>
                    </Button>
                </div>
            )}
            {!isLoading && (
                <div className="mx-4 sm:mx-8">
                    <Accordion
                        defaultExpandedKeys={[targetID]}
                        variant="splitted"
                    >
                        {sortedAndSearchEvents.map((event) => {
                            return (
                                <AccordionItem
                                    key={event._id}
                                    aria-label={event.eventName}
                                    id={event._id}
                                    title={
                                        <div className="flex flex-col sm:flex-row">
                                            <span className="w-full sm:w-5/12 text-zinc-600 pr-2 font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
                                                {event.eventName}
                                            </span>
                                            <span className="text-sm w-full sm:w-3/12 pt-1">
                                                {displayEventStatus(event)}
                                            </span>
                                            <span className="flex justify-end text-sm w-full sm:w-4/12 pt-1 pr-0 sm:pr-8">
                                                <span
                                                    className="text-zinc-600"
                                                    style={{
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    Start Date :{''}
                                                </span>
                                                <span className="text-blue-500 ml-2">
                                                    {formatDate(
                                                        event.startDate
                                                            .substring(0, 10)
                                                            .replace(/-/g, '/'),
                                                    )}
                                                </span>
                                            </span>
                                        </div>
                                    }
                                >
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="flex flex-col text-wrap w-full sm:w-1/2 mx-4 sm:mx-12 my-2">
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
                                        <div className="flex flex-col text-wrap w-full sm:w-1/4">
                                            <div
                                                className="text-zinc-600"
                                                style={{ fontWeight: 'bold' }}
                                            >
                                                Poster
                                            </div>
                                            <p className="text-zinc-500">
                                                {event.poster ? (
                                                    <img
                                                        alt="Poster"
                                                        src={event.poster}
                                                    />
                                                ) : (
                                                    'No poster available'
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex flex-col text-wrap w-full sm:w-1/4">
                                            {state === 'All' && (
                                                <Button
                                                    aria-label="Join Event"
                                                    className={`mx-4 sm:mx-12 my-5 ${
                                                        event.staff?.some(
                                                            (staff) =>
                                                                staff.stdID ===
                                                                user._id,
                                                        ) ||
                                                        (eventStatus(event) !==
                                                            'Upcoming' &&
                                                            eventStatus(
                                                                event,
                                                            ) !== 'Ongoing') ||
                                                        event.participants.includes(
                                                            user._id,
                                                        )
                                                            ? 'bg-zinc-300 text-violet-700'
                                                            : 'bg-violet-700 text-white'
                                                    }`}
                                                    isDisabled={
                                                        event.staff?.some(
                                                            (staff) =>
                                                                staff.stdID ===
                                                                user._id,
                                                        ) ||
                                                        (eventStatus(event) !==
                                                            'Upcoming' &&
                                                            eventStatus(
                                                                event,
                                                            ) !== 'Ongoing') ||
                                                        event.participants.includes(
                                                            user._id,
                                                        )
                                                    }
                                                    onPress={onOpen}
                                                >
                                                    {!(
                                                        event.staff?.some(
                                                            (staff) =>
                                                                staff.stdID ===
                                                                user._id,
                                                        ) ||
                                                        event.participants.includes(
                                                            user._id,
                                                        )
                                                    ) ? (
                                                        <strong>Join</strong>
                                                    ) : (
                                                        <strong>Joined</strong>
                                                    )}
                                                </Button>
                                            )}

                                            <JoinEventModal
                                                eventID={event._id}
                                                isOpen={isOpen}
                                                onOpenChange={onOpenChange}
                                            />
                                            <Button
                                                aria-label="Go to Workspace"
                                                className={`mx-12 my-5 ${
                                                    !(
                                                        event.staff?.some(
                                                            (staff) =>
                                                                staff.stdID ===
                                                                user._id,
                                                        ) ||
                                                        event.participants.includes(
                                                            user._id,
                                                        )
                                                    )
                                                        ? 'bg-gray-300 text-blue-600'
                                                        : 'bg-blue-500 text-white'
                                                }`}
                                                isDisabled={
                                                    !(
                                                        event.staff?.some(
                                                            (staff) =>
                                                                staff.stdID ===
                                                                user._id,
                                                        ) ||
                                                        event.participants.includes(
                                                            user._id,
                                                        )
                                                    )
                                                }
                                                onClick={() => {
                                                    const eventID = event._id;

                                                    navigate(
                                                        `/workspace/${eventID}`,
                                                        {
                                                            state: { event },
                                                        },
                                                    );
                                                }}
                                            >
                                                <strong>Workspace</strong>
                                            </Button>

                                            {((user._id === event.president &&
                                                parseInt(access) === 2) ||
                                                parseInt(access) >= 3) && (
                                                <div className="flex flex-row justify-center my-4">
                                                    <Button
                                                        className=" bg-yellow-500 w-5/12 mr-2"
                                                        // color="warning"
                                                        startContent={
                                                            <MdEdit />
                                                        }
                                                        onPress={() =>
                                                            navigate(
                                                                `/events/update/${event._id}`,
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        className="bg-transparent border border-red-500"
                                                        onPress={
                                                            onOpenDeleteModal
                                                        }
                                                    >
                                                        <IoTrashBin className="text-red-500" />
                                                    </Button>
                                                    <DeleteEventModal
                                                        eventID={event._id}
                                                        isOpen={
                                                            isDeleteModalOpen
                                                        }
                                                        onOpenChange={
                                                            onOpenDeleteModalChange
                                                        }
                                                    />
                                                </div>
                                            )}
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
