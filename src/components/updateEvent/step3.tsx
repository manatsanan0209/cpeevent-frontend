import {
    Input,
    Textarea,
    Select,
    SelectItem,
    DateRangePicker,
    Switch,
    Slider,
    Button,
    Divider,
} from '@nextui-org/react';
import { parseDate } from '@internationalized/date';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { HiChevronDoubleUp, HiChevronDoubleLeft } from 'react-icons/hi';
import { TiTick, TiTimes } from 'react-icons/ti';

import { useEventContext } from '@/context/EventContext';
import { axiosAPIInstance } from '@/api/axios-config';

const Step3 = () => {
    const { eventData, currentStep, setCurrentStep } = useEventContext();
    const roles = eventData.roles.join(', ');

    const navigate = useNavigate();

    interface UpdateEventRequest {
        _id?: string;
        eventName: string;
        eventDescription: string;
        kind: string;
        startDate: Date;
        endDate: Date;
        nParticipant?: number;
        nStaff?: number;
        role: string[];
        president: string;
    }

    const payload: UpdateEventRequest = {
        _id: eventData._id,
        eventName: eventData.eventName,
        eventDescription: eventData.eventDescription,
        kind: eventData.eventCategory,
        startDate: new Date(eventData.eventStartDate),
        endDate: new Date(eventData.eventEndDate),
        nParticipant: eventData.isParticipantsEnabled
            ? eventData.nParticipants
            : 0,
        nStaff: eventData.isStaffsEnabled ? eventData.nStaff : 0,
        role: eventData.roles,
        president: eventData.coordinator,
    };

    const updateEvent = async (payload: UpdateEventRequest) => {
        const response = await axiosAPIInstance.put(
            'v1/event/updateEvent',
            payload,
        );

        return response.data;
    };

    const { mutate, isError, isPending, isSuccess } = useMutation({
        mutationFn: updateEvent,
    });

    const onUpdateEvent = () => {
        mutate(payload, {
            onSuccess: () => navigate('/events'),
        });
    };

    return (
        <>
            <div className="flex flex-col gap-4 border p-4 rounded-md">
                <p className="text-2xl font-bold text-foreground-600">
                    Event Summary
                </p>
                <Divider />
                <div className="flex flex-col gap-4 border p-4 rounded-md">
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Event Name
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <Input
                                isDisabled
                                placeholder="Enter your event name"
                                value={eventData.eventName}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Event Description
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <Textarea
                                isDisabled
                                placeholder="Enter your event description"
                                value={eventData.eventDescription}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Event Category
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <Select
                                isDisabled
                                aria-label="Event Category"
                                selectedKeys={[eventData.eventCategory]}
                            >
                                <SelectItem
                                    key={eventData.eventCategory}
                                    className="capitalize"
                                >
                                    {eventData.eventCategory
                                        .charAt(0)
                                        .toUpperCase() +
                                        eventData.eventCategory
                                            .slice(1)
                                            .toLowerCase()}
                                </SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 border p-4 rounded-md">
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Event Duration (Start and End Date)
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <DateRangePicker
                                isDisabled
                                aria-label="Event Date Range"
                                value={{
                                    start: parseDate(eventData.eventStartDate),
                                    end: parseDate(eventData.eventEndDate),
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Member Options
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <Switch
                                isDisabled
                                isSelected={eventData.isParticipantsEnabled}
                            >
                                Enable Participants
                            </Switch>
                            <Switch
                                isDisabled
                                isSelected={eventData.isStaffsEnabled}
                            >
                                Enable Staffs
                            </Switch>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Number of Participants
                        </h4>
                        <div className="flex flex-row gap-2 mt-4">
                            <Input
                                isDisabled
                                type="number"
                                value={eventData.nParticipants?.toString()}
                            />
                            <Slider
                                isDisabled
                                label="Number of Participants"
                                value={eventData.nParticipants}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Number of Staffs
                        </h4>
                        <div className="flex flex-row gap-2 mt-4">
                            <Input
                                isDisabled
                                type="number"
                                value={eventData.nStaff?.toString()}
                            />
                            <Slider
                                isDisabled
                                label="Number of Staffs"
                                value={eventData.nStaff}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Available Roles
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <Input
                                isDisabled
                                placeholder="Enter your event roles"
                                value={roles}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-foreground-600">
                            Event Coordinator
                        </h4>
                        <div className="flex flex-col gap-2 mt-4">
                            <Input
                                isDisabled
                                placeholder="Enter your event coordinator"
                                value={eventData.coordinator}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex flex-row gap-2 justify-end">
                <Button
                    color="primary"
                    startContent={<HiChevronDoubleLeft />}
                    type="button"
                    variant="bordered"
                    onClick={() => {
                        setCurrentStep(currentStep - 1);
                    }}
                >
                    Back
                </Button>
                <Button
                    color={
                        isError ? 'danger' : isSuccess ? 'success' : 'primary'
                    }
                    endContent={isPending ? <HiChevronDoubleUp /> : null}
                    isLoading={isPending}
                    startContent={
                        isError ? <TiTimes /> : isSuccess ? <TiTick /> : null
                    }
                    type="button"
                    onClick={onUpdateEvent}
                >
                    {isError
                        ? 'Error updating event, please try again later'
                        : isSuccess
                        ? 'Success'
                        : 'Edit Event'}
                </Button>
            </div>
        </>
    );
};

export default Step3;
