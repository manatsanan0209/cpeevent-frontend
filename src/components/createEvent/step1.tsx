import { Input, Button, Textarea, Select, SelectItem } from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { HiChevronDoubleRight, HiOutlineX } from 'react-icons/hi';
import { GrUploadOption } from 'react-icons/gr';
import { toast, ToastContainer } from 'react-toastify';

import { useEventContext } from '@/context/EventContext'; // Adjust the import path as necessary

const schema = z.object({
    eventName: z.string().min(1, 'Event name is required'),
    eventDescription: z.string().min(1, 'Event description is required'),
    eventCategory: z.string().min(1, 'Event category is required'),
});

const Categories = [
    { key: 'camp', value: 'Camp' },
    { key: 'conference', value: 'Conference' },
    { key: 'concert', value: 'Concert' },
    { key: 'festival', value: 'Festival' },
    { key: 'fundraiser', value: 'Fundraiser' },
    { key: 'gala', value: 'Gala' },
    { key: 'game', value: 'Game' },
    { key: 'meeting', value: 'Meeting' },
    { key: 'party', value: 'Party' },
];

const Step1 = () => {
    const { eventData, setEventData, currentStep, setCurrentStep } =
        useEventContext();

    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            eventName: eventData.eventName,
            eventDescription: eventData.eventDescription,
            eventCategory: eventData.eventCategory,
        },
    });

    const onSubmit = (data: {
        eventName: string;
        eventDescription: string;
        eventCategory: string;
    }) => {
        setEventData({
            ...eventData,
            eventName: data.eventName,
            eventDescription: data.eventDescription,
            eventCategory: data.eventCategory,
        });
        setCurrentStep(currentStep + 1);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 border p-4 rounded-md">
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Event Name
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <Controller
                                control={control}
                                name="eventName"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        isRequired
                                        errorMessage={errors.eventName?.message}
                                        isInvalid={!!errors.eventName}
                                        placeholder="Enter your event name"
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Event Description
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <Controller
                                control={control}
                                name="eventDescription"
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        isRequired
                                        errorMessage={
                                            errors.eventDescription?.message
                                        }
                                        isInvalid={!!errors.eventDescription}
                                        placeholder="Enter your event description"
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Event Category
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <Controller
                                control={control}
                                defaultValue=""
                                name="eventCategory"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        errorMessage={
                                            errors.eventCategory?.message
                                        }
                                        isInvalid={!!errors.eventCategory}
                                        label="Select event category"
                                        selectedKeys={[field.value]}
                                    >
                                        {Categories.map((category) => (
                                            <SelectItem
                                                key={category.key}
                                                value={category.key}
                                            >
                                                {category.value}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 border p-4 rounded-md">
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Event Image
                        </h4>
                        <div className="flex gap-2 mt-4 justify-between">
                            <button
                                className="border-2 border-dashed border-gray-300 p-5 text-center flex flex-col items-center justify-center h-52 w-72 mx-auto cursor-pointer bg-foreground-100"
                                type="button"
                                onClick={() => {
                                    toast('🦄Feature coming soon');
                                }}
                            >
                                <GrUploadOption size={50} />
                                <p className="mt-2 text-gray-600">
                                    Upload Icon
                                </p>
                            </button>
                            <button
                                className="border-2 border-dashed border-gray-300 p-5 text-center flex flex-col items-center justify-center h-52 w-72 mx-auto cursor-pointer bg-foreground-100"
                                type="button"
                                onClick={() => {
                                    toast('🦄Feature coming soon');
                                }}
                            >
                                <GrUploadOption size={50} />
                                <p className="mt-2 text-gray-600">
                                    Upload Poster
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex flex-row gap-2 justify-end">
                <Button
                    color="primary"
                    startContent={<HiOutlineX />}
                    type="button"
                    variant="bordered"
                    onClick={() => {
                        navigate('/events');
                    }}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    endContent={<HiChevronDoubleRight />}
                    type="submit"
                >
                    Next Step
                </Button>
            </div>
            <ToastContainer position="top-right" />
        </form>
    );
};

export default Step1;
