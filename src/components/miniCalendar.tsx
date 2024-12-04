//import React from "react";
import type { PostEventProps } from '@/types/index';

import { useState } from 'react';
import type { Event } from '@/types/index';
//import { today } from "@internationalized/date";
import { useQuery } from "@tanstack/react-query";
import { axiosAPIInstance } from "@/api/axios-config.ts";
//import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import {
    IoMdArrowDropleft,
    IoMdArrowDropright,
} from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const calendarDayName = 'text-center text-sm font-thin bg-primary text-white mb-1 p-2';
const classDay = 'w-8 h-8 bg-white text-center flex flex-col cursor-pointer';


export default function MiniCalendar() {
    const navigate = useNavigate();

    const fetchEvents = async () => {
        const response = await axiosAPIInstance.get('v1/events');
        return response.data.data;
    };

    const { data: events = [] } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(`v1/event/${events[0]?._id}/posts`);
        return response.data.data;
    };

    useQuery<PostEventProps[]>({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    });

    const EventList = events?.map((event) => {
        return {
            eventID: event._id,
            eventName: event.eventName,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            kind: event.kind,
        };
    });

    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const firstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const renderDays = () => {
        const days = [];
        const date = new Date(currentDate);
        const month = date.getMonth();
        const year = date.getFullYear();
        const daysInCurrentMonth = daysInMonth(month, year);
        const firstDay = firstDayOfMonth(month, year);
        const today = new Date();


        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={classDay}></div>);
        }


        for (let day = 1; day <= daysInCurrentMonth; day++) {
            const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
            const eventsForDay = EventList
                ? EventList.filter(
                    (event) =>
                        event.startDate.getDate() === day &&
                        event.startDate.getMonth() === month &&
                        event.startDate.getFullYear() === year,
                )
                : [];

            days.push(
                <div
                    key={day}
                    onClick={() => navigate(`/calendar`)}
                    className={`${classDay}
                        ${isToday ? 'bg-gray-100 flex items-center' : ''}
                    `}
                >
                    <p
                        className={`${isToday
                            ? 'bg-violet-500 w-6 rounded-full text-foreground-50'
                            : ''
                            }`}
                    >
                        {day}
                    </p>
                    {eventsForDay.slice(0, 1).map((event) => (
                        <p key={event.eventID} className="text-xs text-center">
                            <span
                                className={`inline-block mb-2 w-1 h-1 rounded-full ${event.endDate < today
                                        ? 'bg-red-500'
                                        : event.startDate > today
                                            ? 'bg-yellow-500'
                                            : 'bg-green-500'
                                    }`}
                            ></span>
                        </p>
                    ))}
                </div>,
            );
        }
        return days;
    };

    const handlePrevMonth = () => {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - 1);
        setCurrentDate(date);
    };

    const handleNextMonth = () => {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() + 1);
        setCurrentDate(date);
    };

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    return (

        <div className="w-fit border rounded-2xl shadow-md bg-gradient-to-b from-primary via-primary to-white pt-1">
            <div className="flex justify-between items-center ">
                <motion.div
                    className="cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevMonth}
                >
                    <IoMdArrowDropleft
                        size={25}
                        className="text-white ml-3 mt-2"
                    />
                </motion.div>
                <p className="font-medium text-white pt-2">
                    {monthNames[currentDate.getMonth()]}{' '}
                    {currentDate.getFullYear()}
                </p>
                <motion.div
                    className="cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextMonth}
                >

                    <IoMdArrowDropright
                        size={25}
                        className="text-white mr-3 mt-2"
                    />
                </motion.div>
            </div>
            <div className="grid grid-cols-7 px-3">
                <div className={calendarDayName}>S</div>
                <div className={calendarDayName}>M</div>
                <div className={calendarDayName}>T</div>
                <div className={calendarDayName}>W</div>
                <div className={calendarDayName}>T</div>
                <div className={calendarDayName}>F</div>
                <div className={calendarDayName}>S</div>
            </div>
            <div className="grid grid-cols-7 grid-rows-6 bg-white pt-2 px-3 border rounded-b-2xl shadow-md pb-1">{renderDays()}</div>


        </div>
    );
}
