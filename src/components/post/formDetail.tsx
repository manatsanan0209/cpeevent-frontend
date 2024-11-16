import type { PostEventProps } from '@/types/index';

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

import { axiosAPIInstance } from '@/api/axios-config';

export default function FormDetail() {
    const navigate = useNavigate();

    const { postid } = useParams();

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(`v1/posts/${postid}`);

        return response.data.data;
    };

    const { data: posts } = useQuery<PostEventProps>({
        queryKey: ['posts', postid],
        queryFn: fetchPosts,
    });

    console.log(posts);

    function onSubmit() {
        console.log('submitted');
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
                    {/* <Divider /> */}
                    <CardBody className="flex flex-col px-10 pt-2">
                        <Card className="w-2/3 mx-auto my-3 py-3">
                            {posts?.questions?.map((qt, index) => (
                                <div key={index} className="w-full px-10">
                                    <div className="py-3 text-zinc-600">
                                        {qt.question}
                                    </div>
                                    {qt.inputType === 'option' ? (
                                        <Select
                                            isRequired
                                            className="pb-2 w-2/3"
                                            label={qt.question}
                                        >
                                            {qt.options?.map((opt, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={opt}
                                                >
                                                    {opt}
                                                </SelectItem>
                                            ))}
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
                    {/* <Divider /> */}
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
