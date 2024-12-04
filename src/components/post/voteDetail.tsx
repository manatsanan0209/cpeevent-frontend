import { useContext, useEffect, useState } from 'react';
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
import { toast } from 'react-toastify';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import VoteResult from './voteResult';

import { axiosAPIInstance } from '@/api/axios-config';
import { PostEventProps, voteAnswer } from '@/types';
import { AuthContext } from '@/context/AuthContext';
import noVoteImage from '@/images/Noi.png';

const calculateTimeLeft = (endDate: string): string => {
    const end = new Date(endDate).getTime() - 7 * 60 * 60 * 1000;
    const now = new Date();
    const difference = end - now.getTime();

    if (difference <= 0) {
        return 'Time up!';
    } else if (difference <= 24 * 60 * 60 * 1000) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

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

        return timeString.trim();
    } else if (difference <= 48 * 60 * 60 * 1000) {
        return 'Tomorrow';
    } else {
        return new Date(end).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }
};

export default function VoteDetail() {
    const { postid } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selected, setSelected] = useState<{ [key: number]: string }>({});
    const [errors, setErrors] = useState<{ [key: number]: string }>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
    const [answers, setAnswers] = useState<voteAnswer>({
        postID: postid as string,
        studentID: user as string,
        answer: '',
    });
    const [timeLeft, setTimeLeft] = useState('');
    const [hasVoted, setHasVoted] = useState(false);
    const [voteCompleted, setVoteCompleted] = useState(false);

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(`v1/posts/${postid}`);

        return response.data.data;
    };

    const { data: posts } = useQuery<PostEventProps>({
        queryKey: ['posts', postid],
        queryFn: fetchPosts,
    });

    const fetchPostSummary = async () => {
        const response = await axiosAPIInstance.get(
            `v1/posts/summary/${postid}`,
        );

        return response.data.data;
    };
    const { data: summaryData } = useQuery({
        queryKey: ['postSummary', postid],
        queryFn: fetchPostSummary,
    });

    const fetchTransaction = async () => {
        const response = await axiosAPIInstance.get(
            `v1/posts/answer/${postid}/${user}`,
        );

        return response.data.data;
    };
    const { data: transactionData } = useQuery({
        queryKey: ['transaction', postid, user],
        queryFn: fetchTransaction,
    });

    useEffect(() => {
        if (posts?.endDate) {
            const updateCountdown = () => {
                if (posts.endDate) {
                    setTimeLeft(calculateTimeLeft(posts.endDate));
                }
            };

            updateCountdown();
            const intervalId = setInterval(updateCountdown, 1000);

            return () => clearInterval(intervalId);
        }
    }, [posts?.endDate]);

    useEffect(() => {
        if (posts?.timeUp === false && timeLeft === 'Time up!') {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [timeLeft, posts?.timeUp]);

    const handleValueChange = (index: number, value: string) => {
        setSelected({ [index]: value });
    };

    async function submitVote() {
        try {
            const response = await axiosAPIInstance.post(
                'v1/posts/submit',
                answers,
            );
            setVoteCompleted(true);
            console.log(response);
        } catch (error) {
            console.error('Error:', error);
        }
    }

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

        setAnswers({ ...answers, answer: Object.values(selected)[0] });
    };
    const handleConfirm = async () => {
        try {
            await submitVote();
            toast.success('Vote submitted successfully!');
            setIsModalVisible(false);
            setVoteCompleted(true);
        } catch (error) {
            toast.error('Error submitting vote');
        }
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };
    const filteredSelected = Object.values(selected)[0] || '';

    useEffect(() => {
        setAnswers({ ...answers, answer: filteredSelected });
    }, [filteredSelected]);

    const transformedData =
        summaryData?.totalVotes === 0
            ? []
            : summaryData?.results.map(
                  (item: { answer: string; count: number }) => ({
                      name: item.answer,
                      votes: item.count,
                  }),
              ) || [];

    useEffect(() => {
        if (transactionData?.answer) {
            setHasVoted(true);
        }
    }, [transactionData]);

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
                                <span className="flex mr-1 text-bl">
                                    End Date:
                                </span>
                                <span
                                    className={`flex ${timeLeft === 'Time up!' ? 'text-rose-500' : 'text-blue-500'}`}
                                >
                                    {timeLeft}
                                </span>
                            </div>
                        )}
                    </div>
                    <p className="text-default-500 p-2">{posts?.description}</p>
                    <div className="flex flex-row w-full">
                        <small className="text-default-500 mt-3">
                            Author : {posts?.author}
                        </small>
                    </div>
                </CardHeader>

                <CardBody className="overflow-visible py-2 m-5">
                    {hasVoted ? (
                        <VoteResult />
                    ) : posts?.timeUp && transformedData.length > 0 ? (
                        <VoteResult />
                    ) : posts?.timeUp && transformedData.length === 0 ? (
                        <div className="flex justify-center flex-col mx-auto">
                            <h1 className="flex justify-center font-bold text-zinc-600">
                                No results available!
                            </h1>
                            <img
                                alt="No Votes"
                                src={noVoteImage}
                                style={{
                                    maxWidth: '350px',
                                    height: 'auto',
                                }}
                            />
                        </div>
                    ) : (
                        <>
                            <Card className="w-4/6 mx-auto my-3 py-3 ">
                                <div className="flex flex-col gap-1 w-full prose px-10 py-3">
                                    <div className="flex flex-row">
                                        <p className="flex text-medium font-semibold text-zinc-700 py-3 mr-3">
                                            {posts?.voteQuestions?.question}
                                        </p>
                                        <span className="flex items-center">
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
                                                        voteCompleted ||
                                                            hasVoted
                                                            ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                                                            : '',
                                                        Object.values(
                                                            selected,
                                                        )[0] === option
                                                            ? 'bg-purple-200 border-2 border-violet-500 ring-1 ring-violet-300'
                                                            : 'border-transparent',
                                                    )}
                                                    disabled={voteCompleted}
                                                    onClick={() =>
                                                        voteCompleted ||
                                                        hasVoted
                                                            ? null
                                                            : handleValueChange(
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
                                        Selected: {filteredSelected}
                                    </p>
                                </div>
                            </Card>
                            <p className="flex justify-center">
                                <Button
                                    className={cn(
                                        'flex justify-center mx-12 my-5 w-2/12 bg-violet-700',
                                        hasVoted ||
                                            posts?.timeUp ||
                                            voteCompleted
                                            ? 'bg-gray-200 cursor-not-allowed text-violet-700'
                                            : 'bg-violet-700 text-white',
                                    )}
                                    isDisabled={
                                        hasVoted ||
                                        posts?.timeUp ||
                                        voteCompleted
                                    }
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    <strong>
                                        {voteCompleted ? 'Submitted' : 'Submit'}
                                    </strong>
                                </Button>
                            </p>
                        </>
                    )}
                </CardBody>
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
                        <Button color="secondary" onPress={handleConfirm}>
                            Confirm
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
