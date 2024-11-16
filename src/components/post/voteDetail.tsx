import React, { useEffect, useState } from 'react';
import { Button, cn, Card, CardHeader, CardBody } from '@nextui-org/react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { axiosAPIInstance } from '@/api/axios-config';
import { PostEventProps } from '@/types';

const CountdownTimer = ({ endDate }: { endDate: string }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (endDate) {
            const end = new Date(endDate).getTime() - 7 * 60 * 60 * 1000;
            const updateCountdown = () => {
                const now = new Date();

                now.setHours(now.getHours());
                const difference = end - now.getTime();

                if (difference <= 0) {
                    setTimeLeft('Time up!');
                } else if (difference <= 24 * 60 * 60 * 1000) {
                    const hours = Math.floor(difference / (1000 * 60 * 60));
                    const minutes = Math.floor(
                        (difference % (1000 * 60 * 60)) / (1000 * 60),
                    );
                    const seconds = Math.floor(
                        (difference % (1000 * 60)) / 1000,
                    );

                    let timeString = '';

                    if (hours > 0) {
                        timeString += `${hours} hrs `;
                    }
                    if (minutes > 0) {
                        timeString += `${minutes} mins `;
                    }
                    if (hours === 0) {
                        timeString += `${seconds} secs `;
                    }

                    setTimeLeft(timeString.trim());
                } else if (difference <= 48 * 60 * 60 * 1000) {
                    setTimeLeft('Tomorrow');
                } else {
                    setTimeLeft(
                        new Date(end).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        }),
                    );
                }
            };

            updateCountdown();
            const intervalId = setInterval(updateCountdown, 1000);

            return () => clearInterval(intervalId);
        }
    }, [endDate]);

    return (
        <p
            className={
                timeLeft === 'Time up!' ? 'text-red-500' : 'text-blue-500'
            }
        >
            {timeLeft}
        </p>
    );
};

export default function VoteDetail() {
    const { postid } = useParams();
    const navigate = useNavigate();
    const [selected, setSelected] = useState<{ [key: number]: string }>({});

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(`v1/posts/${postid}`);

        return response.data.data;
    };

    const { data: posts } = useQuery<PostEventProps>({
        queryKey: ['posts', postid],
        queryFn: fetchPosts,
    });

    const handleValueChange = (index: number, value: string) => {
        setSelected((prevSelected) => ({
            ...prevSelected,
            [index]: prevSelected[index] === value ? '' : value,
        }));
    };

    return (
        <>
            <div className="mb-4">
                <Button isIconOnly onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </Button>
            </div>
            <Card className="py-4">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start m-5">
                    <div className="flex justify-between w-full">
                        <h1 className="flex font-bold text-5xl mb-2">
                            {posts?.title}
                        </h1>
                        {posts?.endDate && (
                            <div className="flex flex-row justify-end items-center text-md text-zinc-600 font-bold ml-auto mr-10">
                                <span className="flex mr-1">End Date:</span>
                                <span className="flex">
                                    <CountdownTimer endDate={posts.endDate} />
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-default-500 p-2">{posts?.description}</p>
                    <small className="text-default-500 mt-3">
                        Author : {posts?.author}
                    </small>
                </CardHeader>

                {/* <Divider /> */}
                <CardBody className="overflow-visible py-2 m-5">
                    <Card className="w-4/6 mx-auto my-3 py-3 ">
                        <div className="flex flex-col gap-1 w-full prose px-10 py-3">
                            {posts?.questions?.map((question, index) => (
                                <React.Fragment key={index}>
                                    <p className="text-medium font-semibold text-zinc-700 py-3">
                                        {question.question}
                                    </p>
                                    <div className="flex flex-row flex-wrap justify-center gap-4">
                                        {question.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                aria-pressed={
                                                    selected[index] === option
                                                }
                                                className={cn(
                                                    'w-5/12 px-8 py-3 mr-5 mt-8 text-sm font-medium transition-all duration-200 ease-in-out',
                                                    'bg-neutral-100 text-violet-700 shadow-sm font-bold',
                                                    'hover:bg-violet-100 hover:text-violet-500 hover:shadow-md hover:scale-105',
                                                    'active:scale-95 active:shadow-sm',
                                                    'rounded-xl',
                                                    selected[index] === option
                                                        ? 'bg-purple-200 border-2 border-violet-500 ring-1 ring-violet-300'
                                                        : 'border-transparent',
                                                )}
                                                onClick={() =>
                                                    handleValueChange(
                                                        index,
                                                        option,
                                                    )
                                                }
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="mt-4 ml-1 text-gray-600">
                                        Selected: {selected[index]}
                                    </p>
                                </React.Fragment>
                            ))}
                        </div>
                    </Card>
                </CardBody>
            </Card>
        </>
    );
}
