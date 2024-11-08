import { Button, Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import ReactMarkdown from 'react-markdown';
import { axiosAPIInstance } from '@/api/axios-config';
import { useQuery } from '@tanstack/react-query';
import { PostEventProps } from '@/types';

export default function PostDetail() {
    const { eventid, postid } = useParams();
    const markdown1 =
        '# Practice M1.3: Pyramid Time!! \n## Introduction \n\nLorem ipsum dolor sit amet consectetur adipisicing elit. In voluptatum, maxime reprehenderit repudiandae rerum facilis, reiciendis molestias at voluptate dolorum nobis quidem, iste velit ea quo provident obcaecati. Autem, quod. \n\n## Problem \n\nLorem ipsum dolor sit amet consectetur adipisicing elit. In voluptatum, maxime reprehenderit repudiandae rerum facilis, reiciendis molestias at voluptate dolorum nobis quidem, iste velit ea quo provident obcaecati. Autem, quod. \n\n## Solution \n\nLorem ipsum dolor sit amet consectetur adipisicing elit. In voluptatum, maxime reprehenderit repudiandae rerum facilis, reiciendis molestias at voluptate dolorum nobis quidem, iste velit ea quo provident obcaecati. Autem, quod. \n\n## Conclusion \n\nLorem ipsum dolor sit amet consectetur adipisicing elit. In voluptatum, maxime reprehenderit repudiandae rerum facilis, reiciendis molestias at voluptate dolorum nobis quidem, iste velit ea quo provident obcaecati. Autem, quod. \n\n## Reference \n\n';
    const navigate = useNavigate();

    const fetchPosts = async () => {
        const response = await axiosAPIInstance.get(`v1/posts/${postid}`);

        return response.data.data;
    };

    const { data: posts } = useQuery<PostEventProps>({
        queryKey: ['posts', postid],
        queryFn: fetchPosts,
    });
    console.log(posts?.markdown);

    return (
        <div className="">
            <div className="mb-4">
                <Button isIconOnly onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </Button>
            </div>
            <div className="">
                <Card className="py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start m-5">
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
                    <Divider />
                    <CardBody className="overflow-visible py-2 m-5">
                        <div className="prose">
                            <ReactMarkdown>{posts?.markdown}</ReactMarkdown>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
