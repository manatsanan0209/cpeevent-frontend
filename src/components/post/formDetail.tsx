import { Button, Card, CardBody, CardHeader, Image } from '@nextui-org/react';
import React from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export default function FormDetail() {
    const navigate = useNavigate();

    return (
        <div className="">
            <div className="mb-4">
                <Button isIconOnly onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </Button>
            </div>
            <div className="">
                <Card className="py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <p className="text-tiny uppercase font-bold">
                            Daily Mix
                        </p>
                        <small className="text-default-500">12 Tracks</small>
                        <h4 className="font-bold text-large">Frontend Radio</h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                        <Image
                            alt="Card background"
                            className="object-cover rounded-xl"
                            src="https://nextui.org/images/hero-card-complete.jpeg"
                            width={270}
                        />
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
