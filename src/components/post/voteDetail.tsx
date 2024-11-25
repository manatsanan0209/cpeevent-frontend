import { useEffect, useState } from 'react';
import {
    Button,
    cn,
    Card,
    CardHeader,
    CardBody,
    Modal,
    ModalBody,
    ModalHeader,
    ModalContent,
    ModalFooter,
} from '@nextui-org/react';
import { BarChart, CartesianGrid } from 'recharts';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { axiosAPIInstance } from '@/api/axios-config';
import { PostEventProps } from '@/types';

const CountdownTimer = ({
    endDate,
    onTimeup,
}: {
    endDate: string;
    onTimeup: () => void;
}) => {
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
                    onTimeup();
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
    const [errors, setErrors] = useState<{ [key: number]: string }>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [timeUp, setTimeUp] = useState(false); // Added timeUp state

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(`v1/posts/${postid}`);

        return response.data.data;
    };

    const { data: posts } = useQuery<PostEventProps>({
        queryKey: ['posts', postid],
        queryFn: fetchPosts,
    });

    const handleValueChange = (index: number, value: string) => {
        setSelected({ [index]: value });
    };

    const handleSubmit = () => {
        let isValid = true;
        const newErrors: { [key: number]: string } = {};

        if (Object.keys(selected).length === 0 || !Object.values(selected)[0]) {
            isValid = false;
            newErrors[0] = '( You must select an option. )';
        }

        if (!isValid) {
            setErrors(newErrors);
        } else {
            setSelectedAnswers(Object.values(selected));
            setIsModalVisible(true);
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    const data = [
        { name: 'Option 1', votes: 400 },
        { name: 'Option 2', votes: 300 },
        { name: 'Option 3', votes: 200 },
        { name: 'Option 4', votes: 278 },
        { name: 'Option 5', votes: 189 },
    ];

    return (
        <>
            <div className="mb-4">
                <Button isIconOnly onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </Button>
            </div>
            <Card className="py-2">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start m-5">
                    <div className="flex justify-between w-full">
                        <h1 className="flex font-bold text-5xl mb-2">
                            {posts?.title}
                        </h1>
                        {posts?.endDate && (
                            <div className="flex flex-row justify-end items-center text-md text-zinc-600 font-bold ml-auto mr-12">
                                <span className="flex mr-1">End Date:</span>
                                <span className="flex">
                                    <CountdownTimer
                                        endDate={posts.endDate}
                                        onTimeup={() => setTimeUp(true)}
                                    />
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-default-500 p-2">{posts?.description}</p>
                    <small className="text-default-500 mt-3">
                        Author : {posts?.author}
                    </small>
                </CardHeader>

                {timeUp ? (
                    <div className="w-4/6 mx-auto py-3">
                        <h2 className="text-center font-bold text-xl mb-4">
                            Voting Results
                        </h2>
                        <BarChart
                            data={data}
                            height={300}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            width={500}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            {/* <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="votes" fill="#8884d8" /> */}
                        </BarChart>
                    </div>
                ) : (
                    <CardBody className="overflow-visible py-2 m-5">
                        <Card className="w-4/6 mx-auto my-3 py-3 ">
                            <div className="flex flex-col gap-1 w-full prose px-10 py-3">
                                <div className="flex flex-row">
                                    <p className="flex text-medium font-semibold text-zinc-700 py-3 mr-3">
                                        {posts?.voteQuestions?.question}
                                    </p>
                                    <span className="flex items-center">
                                        {posts?.voteQuestions?.maxSel && (
                                            <div className="text-zinc-600 text-sm">
                                                Choose up to{' '}
                                                {posts.voteQuestions.maxSel}{' '}
                                                options
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            </div>
                                        )}
                                        {errors[0] && (
                                            <div className="text-red-500 text-sm items-center ml-2">
                                                {errors[0]}
                                            </div>
                                        )}
                                    </span>
                                </div>
                                <div className="flex flex-row flex-wrap justify-center gap-4">
                                    {posts?.voteQuestions?.options.map(
                                        (option, idx) => (
                                            <button
                                                key={idx}
                                                aria-pressed={
                                                    selected[idx] === option
                                                }
                                                className={cn(
                                                    'w-5/12 px-8 py-3 mr-5 mt-8 text-sm font-medium transition-all duration-200 ease-in-out',
                                                    'bg-neutral-100 text-violet-700 shadow-sm font-bold',
                                                    'hover:bg-violet-100 hover:text-violet-500 hover:shadow-md hover:scale-105',
                                                    'active:scale-95 active:shadow-sm',
                                                    'rounded-xl',
                                                    Object.values(
                                                        selected,
                                                    )[0] === option
                                                        ? 'bg-purple-200 border-2 border-violet-500 ring-1 ring-violet-300'
                                                        : 'border-transparent',
                                                )}
                                                onClick={() =>
                                                    handleValueChange(
                                                        idx,
                                                        option,
                                                    )
                                                }
                                            >
                                                {option}
                                            </button>
                                        ),
                                    )}
                                </div>

                                <p className="mt-4 ml-1 text-gray-600">
                                    Selected:{' '}
                                    {Object.values(selected)
                                        .filter((v) => v !== '')
                                        .join(', ')}
                                </p>
                            </div>
                        </Card>
                        <p className="flex justify-center">
                            <Button
                                className="flex justify-center mx-12 my-5 w-2/12 bg-violet-700"
                                type="submit"
                                onClick={handleSubmit}
                            >
                                <strong className="text-white">Submit</strong>
                            </Button>
                        </p>
                    </CardBody>
                )}
            </Card>

            <Modal isOpen={isModalVisible} onClose={handleModalClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Are you sure you want to submit your answers?
                    </ModalHeader>
                    <ModalBody className="flex flex-row">
                        <ModalBody className="flex flex-row">
                            Your answer is {selectedAnswers[0]}
                        </ModalBody>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={handleModalClose}
                        >
                            Cancel
                        </Button>
                        <Button color="secondary" onPress={handleModalClose}>
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
