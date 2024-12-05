import type { PostEventProps, formAnswer } from '@/types/index';

import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    DatePicker,
    Input,
    Modal,
    Select,
    SelectItem,
    useDisclosure,
} from '@nextui-org/react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';

import FormResult from './sumForm';

import ConfirmSubmitModal from '@/components/post/confirmSubmitModal';
import { axiosAPIInstance } from '@/api/axios-config';
import { AuthContext } from '@/context/AuthContext';
import SubmittedFormImage from '@/images/SubmittedForm.png';
import TimeUpImage from '@/images/Noi.png';

export default function FormDetail() {
    const navigate = useNavigate();
    const { postid } = useParams();
    const { user, access } = useContext(AuthContext); // Combined `access` here.
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [timeLeft, setTimeLeft] = useState('');
    const [answers, setAnswers] = useState<formAnswer>({
        postID: postid as string,
        studentID: user as string,
        answerList: [],
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(`v1/posts/${postid}`);

        return response.data.data;
    };

    const { data: posts } = useQuery<PostEventProps>({
        queryKey: ['posts', postid],
        queryFn: fetchPosts,
    });

    const { data: submittedAnswers } = useQuery<formAnswer>({
        queryKey: ['answers', postid],
        queryFn: async () => {
            const response = await axiosAPIInstance.get(
                `v1/posts/answer/${postid}/${user}`,
            );

            return response.data.data;
        },
    });

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

    useEffect(() => {
        if (submittedAnswers) {
            setIsSubmitted(true);
        }
    }, [submittedAnswers]);

    const [ResultPage, setResultPage] = useState(false);

    async function onSubmit() {
        try {
            await axiosAPIInstance.post('/v1/posts/submit', answers);
            window.location.reload();
        } catch (_) {}
    }

    useEffect(() => {
        if (posts?.formQuestions) {
            const initialAnswers = posts.formQuestions.map(
                (question, index) => ({
                    questionIndex: index,
                    answers: [],
                    inputType: question.inputType,
                }),
            );

            setAnswers((prevAnswers) => ({
                ...prevAnswers,
                answerList: initialAnswers,
            }));
        }
    }, [posts]);

    function editOption() {
        setAnswers((prevAnswers) => {
            const newAnswerList = prevAnswers.answerList.map((item) => {
                if (item.inputType === 'option' && item.answers.includes('')) {
                    return {
                        ...item,
                        answers: item.answers.filter((answer) => answer !== ''),
                    };
                }

                return item;
            });

            return {
                ...prevAnswers,
                answerList: newAnswerList,
            };
        });
    }

    return (
        <>
            {ResultPage ? (
                <FormResult setResultPage={setResultPage} />
            ) : (
                <>
                    <div className="mb-4">
                        <Button isIconOnly onClick={() => navigate(-1)}>
                            <IoMdArrowRoundBack />
                        </Button>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onOpen(); // Added `onOpen()` on form submit.
                        }}
                    >
                        <Card className="flex py-4">
                            <CardHeader className="pt-2 px-4 flex-col items-start m-5">
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
                                <p className="text-l text-default-500 p-2">
                                    {posts?.description}
                                </p>
                                <div className="flex flex-row w-full">
                                    <small className="text-default-500 mt-3">
                                        Author: {posts?.author}
                                    </small>
                                    <div className="flex justify-end w-1/2 ml-auto">
                                        {parseInt(access) === 3 || posts?.author === user && (
                                            <Button
                                                className="w-2/5 flex mr-8 text-white font-bold"
                                                color="danger"
                                                onClick={() =>
                                                    setResultPage(true)
                                                }
                                            >
                                                View result
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            {posts?.timeUp && !submittedAnswers ? (
                                <>
                                    <CardBody className="flex justify-center flex-col mx-auto">
                                        <h1 className="flex justify-center font-bold text-zinc-600">
                                            This form is already closed !
                                        </h1>
                                        <img
                                            alt="No Votes"
                                            className="mx-auto"
                                            src={TimeUpImage}
                                            style={{
                                                maxWidth: '350px',
                                                height: 'auto',
                                            }}
                                        />
                                    </CardBody>
                                </>
                            ) : !isSubmitted ? (
                                <>
                                    <CardBody className="flex flex-col px-10 pt-2">
                                        <Card className="w-2/3 mx-auto my-3 py-3">
                                            {posts?.formQuestions?.map(
                                                (qt, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-full px-10"
                                                    >
                                                        <div className="py-3 text-zinc-600">
                                                            {qt.question}
                                                        </div>
                                                        {qt.inputType ===
                                                        'option' ? (
                                                            <Select
                                                                isMultiline
                                                                isRequired
                                                                className="pb-2 w-2/3"
                                                                disabledKeys={
                                                                    parseInt(
                                                                        qt.maxSel ||
                                                                            '0',
                                                                    ) ===
                                                                    (answers
                                                                        .answerList[
                                                                        index
                                                                    ]?.answers
                                                                        .length ||
                                                                        0)
                                                                        ? qt.options?.filter(
                                                                              (
                                                                                  opt,
                                                                              ) =>
                                                                                  !answers.answerList[
                                                                                      index
                                                                                  ]?.answers.includes(
                                                                                      opt,
                                                                                  ),
                                                                          ) ||
                                                                          []
                                                                        : []
                                                                }
                                                                label={`Select up to ${qt.maxSel} choice`}
                                                                selectionMode="multiple"
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    setAnswers(
                                                                        (
                                                                            prevAnswers,
                                                                        ) => {
                                                                            const newAnswerList =
                                                                                [
                                                                                    ...prevAnswers.answerList,
                                                                                ];

                                                                            newAnswerList[
                                                                                index
                                                                            ].answers =
                                                                                [
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ];

                                                                            return {
                                                                                ...prevAnswers,
                                                                                answerList:
                                                                                    newAnswerList,
                                                                            };
                                                                        },
                                                                    );
                                                                    editOption();
                                                                }}
                                                            >
                                                                {qt.options?.map(
                                                                    (opt) => (
                                                                        <SelectItem
                                                                            key={
                                                                                opt
                                                                            }
                                                                            value={
                                                                                opt
                                                                            }
                                                                        >
                                                                            {
                                                                                opt
                                                                            }
                                                                        </SelectItem>
                                                                    ),
                                                                ) || []}
                                                            </Select>
                                                        ) : qt.inputType ===
                                                          'date' ? (
                                                            <DatePicker
                                                                isRequired
                                                                showMonthAndYearPickers
                                                                className="pb-2 w-1/2"
                                                                label={
                                                                    qt.question
                                                                }
                                                                validationBehavior="native"
                                                                onChange={(
                                                                    date,
                                                                ) => {
                                                                    setAnswers(
                                                                        (
                                                                            prevAnswers,
                                                                        ) => {
                                                                            const newAnswerList =
                                                                                [
                                                                                    ...prevAnswers.answerList,
                                                                                ];
                                                                            const nativeDate =
                                                                                new Date(
                                                                                    date.year,
                                                                                    date.month -
                                                                                        1,
                                                                                    date.day,
                                                                                );

                                                                            nativeDate.setUTCHours(
                                                                                0,
                                                                                0,
                                                                                0,
                                                                                0,
                                                                            );
                                                                            const formattedDate =
                                                                                nativeDate.toISOString();

                                                                            newAnswerList[
                                                                                index
                                                                            ].answers =
                                                                                [
                                                                                    formattedDate,
                                                                                ];

                                                                            return {
                                                                                ...prevAnswers,
                                                                                answerList:
                                                                                    newAnswerList,
                                                                            };
                                                                        },
                                                                    );
                                                                }}
                                                            />
                                                        ) : (
                                                            <Input
                                                                isRequired
                                                                className="pb-2"
                                                                label={
                                                                    qt.question
                                                                }
                                                                type={
                                                                    qt.inputType
                                                                }
                                                                validationBehavior="native"
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    setAnswers(
                                                                        (
                                                                            prevAnswers,
                                                                        ) => {
                                                                            const newAnswerList =
                                                                                [
                                                                                    ...prevAnswers.answerList,
                                                                                ];

                                                                            newAnswerList[
                                                                                index
                                                                            ].answers =
                                                                                [
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                ];

                                                                            return {
                                                                                ...prevAnswers,
                                                                                answerList:
                                                                                    newAnswerList,
                                                                            };
                                                                        },
                                                                    );
                                                                    editOption();
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ),
                                            )}
                                        </Card>
                                    </CardBody>
                                    <CardFooter className="flex justify-center mt-3">
                                        <Button
                                            className="bg-violet-700 text-white text-lg w-1/6"
                                            onPress={onOpen}
                                        >
                                            Submit
                                        </Button>
                                    </CardFooter>
                                </>
                            ) : (
                                <>
                                    <CardBody className="flex justify-center flex-col mx-auto">
                                        <h1 className="flex justify-center font-bold text-zinc-600">
                                            You already submitted the form !
                                        </h1>
                                        <img
                                            alt="No Votes"
                                            className="mx-auto"
                                            src={SubmittedFormImage}
                                            style={{
                                                maxWidth: '350px',
                                                height: 'auto',
                                            }}
                                        />
                                    </CardBody>
                                </>
                            )}
                        </Card>
                    </form>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ConfirmSubmitModal onSubmit={onSubmit} />
                    </Modal>
                </>
            )}
        </>
    );
}
