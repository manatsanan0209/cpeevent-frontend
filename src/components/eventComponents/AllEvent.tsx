import { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionItem,
    Button,
    Input,
    Kbd,
    Select,
    SelectItem,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';
import { GrStatusGoodSmall } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

import { SearchIcon } from '../icons';

// Define type of data
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

interface User {
    _id: string;
}

interface AllEventProps {
    events: Event[];
    user: User;
}

export default function AllEvent({ events, user }: AllEventProps) {
    const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
    const [sortOption, setSortOption] = useState<string>('DateDSC');
    const [searchInput, setSearchInput] = useState<string>('');
    const navigate = useNavigate();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        if (Array.isArray(events)) {
            sortEvents(sortOption);
        }
    }, [sortOption, events]);

    useEffect(() => {
        if (Array.isArray(events)) {
            filterEvents(searchInput);
        }
    }, [searchInput, events]);

    // 1'st times access; default sort
    useEffect(() => {
        if (Array.isArray(events)) {
            sortEvents('DateDSC');
        }
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const filterEvents = (searchTerm: string) => {
        if (!Array.isArray(events)) return;

        const filteredEvents = events.filter((event) =>
            event.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        setSortedEvents(filteredEvents);
    };

    const sortEvents = (option: string) => {
        if (!Array.isArray(events)) return;

        let sortedArray = [...events];

        switch (option) {
            case 'DateASC':
                sortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(a.startDate).getTime() -
                        new Date(b.startDate).getTime();

                    if (dateComparison !== 0) return dateComparison;

                    return a.eventName.localeCompare(b.eventName);
                });
                break;
            case 'DateDSC':
                sortedArray.sort((a, b) => {
                    const dateComparison =
                        new Date(b.startDate).getTime() -
                        new Date(a.startDate).getTime();

                    if (dateComparison !== 0) return dateComparison;

                    return b.eventName.localeCompare(a.eventName);
                });
                break;
            case 'NameASC':
                sortedArray.sort((a, b) =>
                    a.eventName.localeCompare(b.eventName),
                );
                break;
            case 'NameDSC':
                sortedArray.sort((a, b) =>
                    b.eventName.localeCompare(a.eventName),
                );
                break;
            default:
                break;
        }
        setSortedEvents(sortedArray);
    };

    const displayEventStatus = (event: Event) => {
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
    };

    const eventStatus = (event: Event) => {
        const current_time = getCurrentTime();

        if (current_time < event.startDate) {
            return 'Upcoming';
        } else if (current_time > event.endDate) {
            return 'Ended';
        } else {
            return 'Ongoing';
        }
    };

    const getCurrentTime = (): string => {
        const now = new Date();

        return now.toISOString();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <>
            <div className="flex flex-row justify-between">
                <div className=" flex justify-center w-1/4 my-8">
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
                {/* <div className="min-w-10" /> */}
                <div className="flex w-1/5 my-8 justify-end flex-row mr-10">
                    <div className="w-1/4 mt-2 items-end text-sm ">Sort by</div>
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

            <div className="mx-8">
                <Accordion variant="splitted">
                    {sortedEvents.map((event) => (
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
                                            style={{ fontWeight: 'bold' }}
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
                                <div className="flex flex-col text-wrap w-1/4">
                                    <Button
                                        aria-label="Join Event"
                                        className={`mx-12 my-5 ${
                                            event.staff?.some(
                                                (staff) =>
                                                    staff.stdID === user._id,
                                            ) ||
                                            eventStatus(event) != 'Upcoming'
                                                ? 'bg-zinc-300 text-violet-700'
                                                : 'bg-violet-700 text-white'
                                        }`}
                                        isDisabled={
                                            event.staff?.some(
                                                (staff) =>
                                                    staff.stdID === user._id,
                                            ) ||
                                            eventStatus(event) != 'Upcoming'
                                        }
                                        onPress={onOpen}
                                    >
                                        {!event.staff?.some(
                                            (staff) => staff.stdID === user._id,
                                        ) ? (
                                            <strong>Join</strong>
                                        ) : (
                                            <strong>Joined</strong>
                                        )}
                                    </Button>

                                    <Modal
                                        isOpen={isOpen}
                                        onOpenChange={onOpenChange}
                                    >
                                        <ModalContent>
                                            {(onClose) => (
                                                <>
                                                    <ModalHeader className="flex flex-col gap-1">
                                                        Join Workspace
                                                        Confirmation
                                                    </ModalHeader>
                                                    <ModalBody>
                                                        <p>
                                                            Are you sure you
                                                            want to join the
                                                            workspace?
                                                        </p>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button
                                                            color="danger"
                                                            variant="light"
                                                            onPress={onClose}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            color="primary"
                                                            onPress={onClose}
                                                        >
                                                            Confirm
                                                        </Button>
                                                    </ModalFooter>
                                                </>
                                            )}
                                        </ModalContent>
                                    </Modal>

                                    <Button
                                        aria-label="Go to Workspace"
                                        className={`mx-12 my-5 ${
                                            !event.staff?.some(
                                                (staff) =>
                                                    staff.stdID === user._id,
                                            )
                                                ? 'bg-gray-300 text-blue-600'
                                                : 'bg-blue-500 text-white'
                                        }`}
                                        isDisabled={
                                            !event.staff?.some(
                                                (staff) =>
                                                    staff.stdID === user._id,
                                            )
                                        }
                                        onClick={() =>
                                            navigate('/post', {
                                                state: { event },
                                            })
                                        }
                                    >
                                        <strong>Workspace</strong>
                                    </Button>
                                </div>
                            </div>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </>
    );
}
