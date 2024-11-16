import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { axiosAPIInstance } from '@/api/axios-config.ts';

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

    return (
        <div>
            <div className="font-bold text-4xl m-10 text-gray-700">Members</div>
            <div className="font-medium text-2xl ml-24 mb-2 text-gray-600 ">
                All staff
            </div>
            <div className="h-fit mx-20 rounded-xl shadow-md border border-gray-100 p-8">
                <table className="w-full">
                    <thead>
                        <tr className="bg-purple-200 w-fit ">
                            <th className="px-4 py-2 rounded-l-lg text-gray-700 w-1/4 ">
                                Student ID
                            </th>
                            <th className="px-4 py-2 text-gray-700 w-1/4">
                                Name
                            </th>
                            <th className="px-4 py-2 text-gray-700 w-1/4">
                                Role
                            </th>
                            <th className="px-4 py-2 rounded-r-lg text-gray-700 w-1/4">
                                Tel
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {staffMembers
                            .sort((a, b) => {
                                const roleComparison = a.role.localeCompare(
                                    b.role,
                                );

                                if (roleComparison !== 0) {
                                    return roleComparison;
                                }

                                return a.stdID.localeCompare(b.stdID);
                            })
                            .map((member, index) => (
                                <tr
                                    key={index}
                                    className={
                                        index === 0 ||
                                        (index > 0 &&
                                            member.role ===
                                                staffMembers[index - 1].role)
                                            ? 'border-t-0'
                                            : 'border-t border-gray-300'
                                    }
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
                            ))}
                    </tbody>
                </table>
            </div>
            <div className="font-medium text-2xl ml-24 mb-2 text-gray-600 mt-10">
                Participants
            </div>
            <div className="h-fit mx-20 rounded-xl shadow-md border border-gray-100 p-8">
                <table className="w-full">
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
