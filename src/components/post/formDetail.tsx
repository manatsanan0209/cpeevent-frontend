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

import ConfirmSubmitModal from '@/components/post/confirmSubmitModal';
import { axiosAPIInstance } from '@/api/axios-config';
import { AuthContext } from '@/context/AuthContext';

export default function FormDetail() {
    const navigate = useNavigate();
    const { postid } = useParams();
    const { user } = useContext(AuthContext);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [answers, setAnswers] = useState<formAnswer>({
        postID: postid as string,
        studentID: user as string,
        answerList: [],
    });

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(`v1/posts/${postid}`);

        return response.data.data;
    };

    const { data: posts } = useQuery<PostEventProps>({
        queryKey: ['posts', postid],
        queryFn: fetchPosts,
    });

    async function onSubmit() {
        try {
            await axiosAPIInstance.post('/v1/posts/submit', answers);
            navigate(-1);
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
            <div className="mb-4">
                <Button isIconOnly onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </Button>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <Card className="flex py-4">
                    <CardHeader className="pt-2 px-4 flex-col items-start m-5">
                        <h1 className="font-bold text-5xl mb-2">
                            {posts?.title}
                        </h1>
                        <p className="text-l text-default-500 p-2">
                            {posts?.description}
                        </p>
                        <small className="text-default-500 mt-3">
                            Author : {posts?.author}
                        </small>
                    </CardHeader>
                    <CardBody className="flex flex-col px-10 pt-2">
                        <Card className="w-2/3 mx-auto my-3 py-3">
                            {posts?.formQuestions?.map((qt, index) => (
                                <div key={index} className="w-full px-10">
                                    <div className="py-3 text-zinc-600">
                                        {qt.question}
                                    </div>
                                    {qt.inputType === 'option' ? (
                                        <Select
                                            isMultiline
                                            isRequired
                                            className="pb-2 w-2/3"
                                            disabledKeys={
                                                parseInt(qt.maxSel || '0') ===
                                                (answers.answerList[index]
                                                    ?.answers.length || 0)
                                                    ? qt.options?.filter(
                                                          (opt) =>
                                                              !answers.answerList[
                                                                  index
                                                              ]?.answers.includes(
                                                                  opt,
                                                              ),
                                                      ) || []
                                                    : []
                                            }
                                            label={`Select up to ${qt.maxSel} choice`}
                                            selectionMode="multiple"
                                            onChange={(e) => {
                                                setAnswers((prevAnswers) => {
                                                    const newAnswerList = [
                                                        ...prevAnswers.answerList,
                                                    ];

                                                    newAnswerList[
                                                        index
                                                    ].answers = Array.isArray(
                                                        e.target.value,
                                                    )
                                                        ? e.target.value
                                                        : e.target.value
                                                              .split(',')
                                                              .map((value) =>
                                                                  value.trim(),
                                                              );

                                                    return {
                                                        ...prevAnswers,
                                                        answerList:
                                                            newAnswerList,
                                                    };
                                                });
                                                editOption();
                                            }}
                                        >
                                            {qt.options !== undefined
                                                ? qt.options.map((opt) => (
                                                      <SelectItem
                                                          key={opt}
                                                          value={opt}
                                                      >
                                                          {opt}
                                                      </SelectItem>
                                                  ))
                                                : []}
                                        </Select>
                                    ) : qt.inputType === 'date' ? (
                                        <DatePicker
                                            isRequired
                                            showMonthAndYearPickers
                                            className="pb-2 w-1/2"
                                            label={qt.question}
                                            validationBehavior="native"
                                            onChange={(date) => {
                                                setAnswers((prevAnswers) => {
                                                    const newAnswerList = [
                                                        ...prevAnswers.answerList,
                                                    ];

                                                    // Manually create a JavaScript Date from the DateValue object
                                                    const nativeDate = new Date(
                                                        date.year,
                                                        date.month - 1,
                                                        date.day,
                                                    ); // `month` is 0-based in JavaScript

                                                    // Set time to 17:00:00 UTC
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
                                                    ].answers = [formattedDate];

                                                    return {
                                                        ...prevAnswers,
                                                        answerList:
                                                            newAnswerList,
                                                    };
                                                });
                                            }}
                                        />
                                    ) : (
                                        <Input
                                            isRequired
                                            className="pb-2"
                                            label={qt.question}
                                            type={qt.inputType}
                                            validationBehavior="native"
                                            onChange={(e) => {
                                                setAnswers((prevAnswers) => {
                                                    const newAnswerList = [
                                                        ...prevAnswers.answerList,
                                                    ];

                                                    newAnswerList[
                                                        index
                                                    ].answers = [
                                                        e.target.value,
                                                    ];

                                                    return {
                                                        ...prevAnswers,
                                                        answerList:
                                                            newAnswerList,
                                                    };
                                                });
                                                editOption();
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </Card>
                    </CardBody>
                    <CardFooter className="flex justify-center mt-3">
                        <Button
                            className="bg-violet-700 text-white text-lg w-1/6"
                            // type="submit"
                            onPress={onOpen}
                        >
                            Submit
                        </Button>
                    </CardFooter>
                </Card>
            </form>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ConfirmSubmitModal onSubmit={onSubmit} />
            </Modal>
        </>
    );
}
