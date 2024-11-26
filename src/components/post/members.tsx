import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { axiosAPIInstance } from '@/api/axios-config.ts';
import {
    Input,
    Select,
    SelectItem,
    Kbd,
} from '@nextui-org/react';
import { IoFilter } from 'react-icons/io5';
import { SearchIcon } from '../icons.tsx';
import { read } from 'fs';

interface StaffMember {
    stdID: string;
    name: string;
    role: string;
    phoneNumber: string;
}

interface Participant {
    stdID: string;
    name: string;
    phoneNumber: string;
}

interface EventMembersType {
    _id: string;
    eventID: string;
    staff: StaffMember[];
    participants: Participant[];
}

export default function MembersPage() {
    const location = useLocation();
    const eventID = location.pathname.split('/')[2];

    const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [searchInput, setSearchInput] = useState('');
    const [sortedAndSearchMembers, setSortedAndSearchMembers] = useState<StaffMember[]>([]);
    const [sortOption, setSortOption] = useState('IdDSC');
    const [filterRole, setFilterRole] = useState('all');

    const fetchEvents = async () => {
        const response = await axiosAPIInstance.get(
            `v1/event/${eventID}/members`,
        );

        return response.data as EventMembersType;
    };

    const { data: eventsData } = useQuery<EventMembersType>({
        queryKey: ['events', eventID],
        queryFn: fetchEvents,
    });

    useEffect(() => {
        if (eventsData) {
            setStaffMembers(eventsData.staff);
            console.log(staffMembers);
            setParticipants(eventsData.participants);
        } else {
            console.log('No data');
        }
    }, [eventsData, eventID]);

    useEffect (() => {
        setSortedAndSearchMembers(sortedAndSearchMembersFunc(sortOption, searchInput, filterRole),
        );
    }, [sortOption, searchInput, filterRole, eventsData]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    function sortedAndSearchMembersFunc(
        option: string,
        searchTerm: string,
        filter: string,
    ): StaffMember[] {
        let newSortedArray = Array.isArray(eventsData?.staff) ? [...eventsData.staff] : [];

        switch (option) {
            case 'IdASC':
                newSortedArray = newSortedArray.sort((a, b) => a.stdID.localeCompare(b.stdID));
                break;
            case 'IdDSC':
                newSortedArray = newSortedArray.sort((a, b) => b.stdID.localeCompare(a.stdID));
                break;
            case 'NameASC':
                newSortedArray = newSortedArray.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'NameDSC':
                newSortedArray = newSortedArray.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        if (filter !== 'all') {
            newSortedArray = newSortedArray.filter(member => member.role === filter);
        }

        if (searchTerm) {
            newSortedArray = newSortedArray.filter(member => member.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return newSortedArray;
    }

    const roles = Array.from(new Set(staffMembers.map(member => member.role)));
    roles.push('all');

    return (
        <div className="w-full ">
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
                <div className="flex content-center col-end-5">
                    <div className="w-1/4 mr-4 mt-2 items-center text-sm text-zinc-600 font-bold">
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
                        <SelectItem key="IdDSC" value="IdDSC">
                            Std ID ( Descending )
                        </SelectItem>
                        <SelectItem key="IdASC" value="IdASC">
                            Std ID ( Ascending )
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
        <div>
        <div className="flex col-start-3 flex-col">
                <div className="flex flex-row mr-4 w-full items-center justify-between">
                    <div className="ml-24 mb-2 text-zinc-600 font-bold text-large mt-4">
                        All staff
                    </div>
                    <div className="flex flex-row items-center ml-auto mt-4 mb-2">
                        <div className="flex mr-2 items-center text-sm text-zinc-600 font-bold">
                            Filter
                        </div>
                        <div className="content-center mr-2">
                            <IoFilter className="flex" />
                        </div>
                        <div className="flex"></div>
                        <Select
                                disallowEmptySelection
                                isRequired
                                aria-label="Filter"
                                className="max-w-xs w-32 mr-20"
                                defaultSelectedKeys={[filterRole]}
                                selectedKeys={[filterRole]}
                                style={{ backgroundColor: '#DED1FF' }}
                                variant="bordered"
                                onChange={(e) => setFilterRole(e.target.value)}
                            >
                                {roles.map((role) => (
                                    <SelectItem key={role} value={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                 </div>
            </div>
            <div className="h-fit mx-20 rounded-xl shadow-md border border-gray-100 p-8">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-purple-200 w-fit ">
                            <th className="px-4 py-2 rounded-l-lg text-gray-700 ">
                                Student
                            </th>
                            <th className="px-4 py-2 text-gray-700 ">
                                Name
                            </th>
                            <th className="px-4 py-2 text-gray-700 ">
                                Role
                            </th>
                            <th className="px-4 py-2 rounded-r-lg text-gray-700 ">
                                Tel
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {sortedAndSearchMembers.length > 0 ? (
                            sortedAndSearchMembers.map((member, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-300"
                                >
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {member.stdID}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {member.name}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {member.role}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {member.phoneNumber}
                                    </td>
                                </tr>
                            ))) : (
                            <tr>
                                <td
                                    className="px-4 py-3 text-center text-gray-500"
                                    colSpan={4}
                                >
                                    No staff available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className=" ml-24 mb-2 mt-10 text-zinc-600 font-bold text-large w-full">
                Participants
            </div>
            <div className="h-fit mx-20 rounded-xl shadow-md border border-gray-100 p-8">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-purple-200 w-fit">
                            <th className="px-4 py-2 text-gray-700 rounded-l-lg">
                                Student ID
                            </th>
                            <th className="px-4 py-2 text-gray-700 ">Name</th>
                            <th className="px-4 py-2 text-gray-700 rounded-r-lg">
                                Tel
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.length > 0 ? (
                            participants.map((participant, index) => (
                                <tr
                                    key={index}
                                    className="border-t border-gray-300"
                                >
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {participant.stdID}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {participant.name}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {participant.phoneNumber}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    className="px-4 py-3 text-center text-gray-500"
                                    colSpan={3}
                                >
                                    No participants available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>  
    );
}
