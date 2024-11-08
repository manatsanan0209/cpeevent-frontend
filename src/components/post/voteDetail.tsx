import React from 'react';
import { Button, RadioGroup, Radio, cn } from '@nextui-org/react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

export default function VoteDetail() {
    const navigate = useNavigate();
    const [selected, setSelected] = React.useState<string>('');

    const options = [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
        { id: '3', label: 'Option 3' },
    ];

    return (
        <div>
            <div className="mb-4">
                <Button isIconOnly onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </Button>
            </div>
            <div>
                <p className="text-2xl font-bold text-zinc-600">Title</p>
                <p className="text-gray-500 text-tiny">Description</p>
            </div>
            <div className="flex flex-col gap-1 w-full">
                <RadioGroup
                    classNames={{
                        base: 'w-full',
                    }}
                    label="Select your favorite thing"
                    value={selected}
                    onValueChange={setSelected}
                >
                    {options.map((option) => (
                        <Radio
                            key={option.id}
                            classNames={{
                                base: cn(
                                    'inline-flex w-full max-w-md bg-content1',
                                    'hover:bg-content2 items-center justify-start',
                                    'cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent',
                                    'data-[selected=true]:border-primary',
                                ),
                                label: 'w-full',
                            }}
                            value={option.id}
                        >
                            <p>{option.label}</p>
                        </Radio>
                    ))}
                </RadioGroup>
                <p className="mt-4 ml-1 text-default-500">
                    Selected: {selected}
                </p>
            </div>
        </div>
    );
}