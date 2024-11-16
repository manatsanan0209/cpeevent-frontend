import React, { useEffect, useState } from 'react';
import {
    Button,
    RadioGroup,
    Radio,
    cn,
    Card,
    CardHeader,
    Divider,
    CardBody,
} from '@nextui-org/react';
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
            const end = new Date(endDate);
            const updateCountdown = () => {
                const now = new Date().getTime() + 7 * 60 * 60 * 1000;
                const difference = end.getTime() - now;

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

                    setTimeLeft(
                        `${hours} hrs. ${minutes} mint. ${seconds} sec.`,
                    );
                } else {
                    setTimeLeft(end.toLocaleString());
                }
            };

            updateCountdown();
            const intervalId = setInterval(updateCountdown, 1000);

            return () => clearInterval(intervalId);
        }
    }, [endDate]);

    return <p>{timeLeft}</p>;
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
                    <div>
                        <h1 className="font-bold text-5xl mb-2">
                            {posts?.title}
                        </h1>
                        <CountdownTimer endDate={posts?.endDate || ''} />
                    </div>
                    <p className="text-gray-500 text-default-500 p-2">
                        {posts?.description}
                    </p>
                    <small className="text-default-500 mt-3">
                        Author : {posts?.author}
                    </small>
                </CardHeader>
                <Divider />
                <CardBody className="overflow-visible py-2 m-5">
                    <Card className="w-2/3 mx-auto my-3 py-3">
                        <div className="flex flex-col gap-1 w-full prose">
                            {posts?.questions?.map((question, index) => (
                                <React.Fragment key={index}>
                                    <RadioGroup
                                        label={
                                            <p className="text-medium font-bold text-zinc-600">
                                                {question.question}
                                            </p>
                                        }
                                        value={selected[index] || ''}
                                        onValueChange={(value) =>
                                            handleValueChange(index, value)
                                        }
                                    >
                                        <div className="flex flex-row">
                                            {question.options.map(
                                                (option, idx) => (
                                                    <Radio
                                                        key={idx}
                                                        classNames={{
                                                            base: cn(
                                                                'inline-flex w-1/4 mx-4 max-w-md bg-content1',
                                                                'hover:bg-content2 items-center',
                                                                'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                                                                'data-[selected=true]:border-primary',
                                                                'bg-[selected=false]:bg-content1',
                                                            ),
                                                            label: 'w-full',
                                                        }}
                                                        value={option}
                                                    >
                                                        <p>{option}</p>
                                                    </Radio>
                                                ),
                                            )}
                                        </div>
                                    </RadioGroup>
                                    <p className="mt-4 ml-1 text-default-500">
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
