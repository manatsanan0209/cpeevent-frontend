import type { Event, PostEventProps } from '@/types/index';

import { useState } from 'react';
import { useDisclosure } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useTheme } from '@/hooks/use-theme';

import {
    IoIosArrowDropleftCircle,
    IoIosArrowDroprightCircle,
} from 'react-icons/io';

import { CalendarModal } from '@/components/calendarComponents/calendarModal';

const emptyDay = 'border border-violet-100 rounded-lg bg-foreground-100';
const calendarDayName = 'text-center font-bold p-2 bg-primary text-white mb-1 ';

export const FullCalendar = ({
    events,
    posts,
    onTabChange,
}: {
    events?: Event[];
    posts?: PostEventProps[];
    onTabChange?: (key: string) => void;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [eventsToModal, setEventsToModal] = useState<typeof EventList | null>(null);
    const [postsToModal, setPostsToModal] = useState<typeof PostList | null>(null);
    const [date, setDate] = useState(new Date());

    const EventList = events?.map((event) => {
        return {
            eventID: event._id,
            eventName: event.eventName,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
        };
    });

    const PostList = posts?.map((posts) => {
        return {
            postID: posts._id,
            title: posts.title,
            postDate: new Date(new Date(posts.postDate).getTime() - 7 * 60 * 60 * 1000),
            endDate: posts.endDate ? new Date(new Date(posts.endDate).getTime() - 7 * 60 * 60 * 1000) : null,
            kind: posts.kind,
        };
    });

    const { theme } = useTheme();

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
            days.push(<div key={`empty-${i}`} className={emptyDay}></div>);
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
            const postsForDay = PostList
                ? PostList.filter(
                      (post) => {
                          const postDate = post.endDate ? post.endDate : post.postDate;
                          return (
                              postDate.getDate() === day &&
                              postDate.getMonth() === month &&
                              postDate.getFullYear() === year
                          );
                      }
                  )
                : [];
    
            days.push(
                <motion.div
                    key={day}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDayClick(eventsForDay, postsForDay, new Date(year, month, day))}
                    className={`flex flex-col gap-0.5 p-4 h-28 border border-violet-100 rounded-lg cursor-pointer
                        ${theme === 'light' ? 'bg-white' : 'bg-default'}
                        ${isToday ? 'bg-violet-50' : ''}
                    `}
                >
                    <p
                        className={`${
                            isToday
                                ? 'bg-violet-500 rounded-full w-7 px-1 text-center text-foreground-50'
                                : ''
                        }`}
                    >
                        {day}
                    </p>
                    {eventsForDay.slice(0, 1).map((event) => (
                        <p
                            key={event.eventName}
                            className={`pl-1 ${
                                event.endDate < today
                                    ? 'text-red-500 bg-red-200 border-l-2 border-red-500 rounded-md'
                                    : event.startDate > today
                                    ? 'bg-yellow-200 border-l-2 border-yellow-500 rounded-md'
                                    : 'bg-green-200 border-l-2 border-green-500 rounded-md'
                            }`}
                        >
                            {event.eventName.length > 14
                                ? `${event.eventName.substring(0, 14)}...`
                                : event.eventName}
                        </p>
                    ))}
                    {postsForDay.slice(0, 1).map((post) => (
                        <p
                            key={post.title}
                            className={`pl-1 ${
                                post.kind === 'post'
                                    ? 'bg-purple-200 border-l-2 border-purple-500'
                                    : post.kind === 'vote'
                                    ? 'bg-yellow-200 border-l-2 border-yellow-500'
                                    : 'bg-blue-200 border-l-2 border-blue-500'
                            } rounded-md`}
                        >
                            {post.title.length > 14
                                ? `${post.title.substring(0, 14)}...`
                                : post.title}
                        </p>
                    ))}
                    {eventsForDay.length > 1 && (
                        <p className="text-blue-500 hover:underline">
                            +{eventsForDay.length - 1} more...
                        </p>
                    )}
                    {postsForDay.length > 1 && (
                        <p className="text-blue-500 hover:underline">
                            +{postsForDay.length - 1} more...
                        </p>
                    )}
                </motion.div>,
            );
        }
    
        const remainingDays = 7 - (days.length % 7);
        for (let i = 0; i < remainingDays; i++) {
            days.push(<div key={`empty-end-${i}`} className={emptyDay}></div>);
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

    const handleDayClick = (events: typeof EventList, posts: typeof PostList, date: Date) => {
        if (events) setEventsToModal(events);
        if (posts) setPostsToModal(posts);
        setDate(date);
        onOpen();
    };
    return (
        <div className="w-full border rounded-2xl shadow-md p-4">
            <div className="flex justify-between items-center mb-4 py-4">
                <motion.div
                    className="ml-3 cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevMonth}
                >
                    <IoIosArrowDropleftCircle
                        size={54}
                        className="text-violet-500 hover:text-violet-400"
                    />
                </motion.div>
                <p className="font-bold text-lg text-violet-600">
                    {monthNames[currentDate.getMonth()]}{' '}
                    {currentDate.getFullYear()}
                </p>
                <motion.div
                    className="mr-3 cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextMonth}
                >
                    <IoIosArrowDroprightCircle
                        size={54}
                        className="text-violet-500 hover:text-violet-400"
                    />
                </motion.div>
            </div>
            <div className="grid grid-cols-7">
                <div className={` ${calendarDayName} rounded-l-lg`}>Sun</div>
                <div className={calendarDayName}>Mon</div>
                <div className={calendarDayName}>Tue</div>
                <div className={calendarDayName}>Wed</div>
                <div className={calendarDayName}>Thu</div>
                <div className={calendarDayName}>Fri</div>
                <div className={` ${calendarDayName} rounded-r-lg`}>Sat</div>
                {renderDays()}
            </div>
            <CalendarModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onTabChange={onTabChange}
                events={eventsToModal || []}
                posts={postsToModal || []}
                date={date}
            />
        </div>
    );
};
