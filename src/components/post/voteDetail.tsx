import React from 'react';
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

export default function VoteDetail() {
    const { postid } = useParams();
    const navigate = useNavigate();
    const [selected, setSelected] = React.useState<{ [key: number]: string }>(
        {},
    );

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(`v1/posts/${postid}`);

        return response.data.data;
    };

    const { data: posts } = useQuery<PostEventProps>({
        queryKey: ['posts', postid],
        queryFn: fetchPosts,
    });

    console.log(posts);

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
                    <h1 className="font-bold text-5xl mb-2">{posts?.title}</h1>
                    <p className="text-gray-500 text-default-500 p-2">
                        {posts?.description}
                    </p>
                    <small className="text-default-500 mt-3">
                        Author : {posts?.author}
                    </small>
                </CardHeader>
                <Divider />
                <Card>
                    <CardBody className="overflow-visible py-2 m-5">
                        <div className="flex flex-col gap-1 w-full prose">
                            {posts?.questions?.map((question, index) => (
                                <>
                                    <RadioGroup
                                        key={index}
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
                                </>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            </Card>
        </>
    );
}
