import type { PostEventProps, formAnswer } from '@/types/index';

import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    DatePicker,
    Input,
    Select,
    SelectItem,
} from '@nextui-org/react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';

import { axiosAPIInstance } from '@/api/axios-config';
import { AuthContext } from '@/context/AuthContext';

export default function FormDetail() {
    const navigate = useNavigate();
    const { postid } = useParams();
    const { user } = useContext(AuthContext);
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

    function onSubmit() {
        console.log('submitted');
    }

    useEffect(() => {
        console.log(answers);
    }, [answers]);

    //initialize answers array
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
                    onSubmit();
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
                                            label={qt.question}
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
                                        />
                                    ) : (
                                        <Input
                                            isRequired
                                            className="pb-2"
                                            label={qt.question}
                                            type={qt.inputType}
                                            validationBehavior="native"
                                        />
                                    )}
                                </div>
                            ))}
                        </Card>
                    </CardBody>
                    <CardFooter className="flex justify-center mt-3">
                        <Button
                            className="bg-violet-700 text-white text-lg w-1/6"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </>
    );
}
