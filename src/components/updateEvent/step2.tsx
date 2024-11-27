// src/components/createEvent/step2.tsx
import { useState, useMemo, useEffect } from 'react';
import {
    Button,
    DateRangePicker,
    Switch,
    Input,
    Slider,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Listbox,
    ListboxSection,
    ListboxItem,
} from '@nextui-org/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import 'react-toastify/dist/ReactToastify.css';
import { parseDate } from '@internationalized/date';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa6';
import {
    HiChevronDoubleRight,
    HiChevronDoubleLeft,
    HiChevronDoubleDown,
} from 'react-icons/hi';

import { useEventContext } from '@/context/EventContext'; // Adjust the import path as necessary

const schema = z.object({
    nParticipants: z.number(),
    nStaff: z.number(),
    coordinator: z
        .string()
        .min(1, 'Coordinator Student ID is required')
        .length(11, 'Coordinator Student ID must be 11 digits'),
});

const defaultRoles = [
    'Activity',
    'Academic',
    'Accounting',
    'Nursing',
    'Welfare',
    'Public Relation',
];

const Step2 = () => {
    const { eventData, setEventData, currentStep, setCurrentStep } =
        useEventContext();

    const [eventDateRange, setEventDateRange] = useState({
        start: parseDate(eventData.eventStartDate),
        end: parseDate(eventData.eventEndDate),
    });

    const handleParticipantsSwitch = (value: boolean) => {
        if (!value && !eventData.isStaffsEnabled) {
            toast.error(
                'At least one of Participants or Staffs must be enabled.',
            );

            return;
        }
        setEventData({
            ...eventData,
            isParticipantsEnabled: value,
        });
    };

    const [newRole, setNewRole] = useState('');

    useEffect(() => {
        if (eventData.roles.length === 0) {
            setEventData({
                ...eventData,
                roles: defaultRoles,
            });
        } else {
            setSelectedKeys(eventData.roles);
        }
    }, []);

    const addNewRole = () => {
        if (newRole.trim()) {
            const roleValue = newRole.trim();

            // Check for duplicate roles
            if (!eventData.roles.includes(roleValue)) {
                setEventData({
                    ...eventData,
                    roles: [...eventData.roles, roleValue],
                });
            }
            setNewRole('');
        }
    };

    const [selectedKeys, setSelectedKeys] = useState<string[]>(['Activity']);

    const selectedValue = useMemo(
        () =>
            selectedKeys
                .map((key) => key)
                .filter(Boolean)
                .join(', '),
        [selectedKeys],
    );

    const handleStaffsSwitch = (value: boolean) => {
        if (!value && !eventData.isParticipantsEnabled) {
            toast.error(
                'At least one of Participants or Staffs must be enabled.',
            );

            return;
        }
        setEventData({
            ...eventData,
            isStaffsEnabled: value,
        });
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            nParticipants: eventData.nParticipants,
            nStaff: eventData.nStaff,
            role: eventData.roles.join(', '),
            coordinator: eventData.coordinator,
        },
    });

    const onSubmit = (data: {
        nParticipants?: number;
        nStaff?: number;
        role: string;
        coordinator: string;
    }) => {
        if (!eventData.isParticipantsEnabled && !eventData.isStaffsEnabled) {
            toast.error('Event must have either participants or staff.');

            return;
        }

        if (
            eventData.isParticipantsEnabled &&
            (!data.nParticipants || data.nParticipants <= 0)
        ) {
            toast.error('Number of participants must be greater than 0.');

            return;
        }

        if (eventData.isStaffsEnabled && (!data.nStaff || data.nStaff <= 0)) {
            toast.error('Number of staff must be greater than 0.');

            return;
        }

        if (!eventData.isStaffsEnabled) {
            setEventData({
                ...eventData,
                roles: [],
            });
        }

        const updatedData = {
            ...data,
            eventDateRange,
            nParticipants: eventData.isParticipantsEnabled
                ? data.nParticipants
                : 0,
            nStaff: eventData.isStaffsEnabled ? data.nStaff : 0,
        };

        setEventData({
            ...eventData,
            eventStartDate: updatedData.eventDateRange.start.toString(),
            eventEndDate: updatedData.eventDateRange.end.toString(),
            nParticipants: updatedData.nParticipants,
            nStaff: updatedData.nStaff,
            roles: eventData.isStaffsEnabled
                ? selectedKeys
                      .map((role) => role)
                      .filter(Boolean)
                : [],
            coordinator: updatedData.coordinator,
        });
        setCurrentStep(currentStep + 1);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4 border p-4 rounded-md">
                <div>
                    <h4 className="text-xl font-semibold text-foreground-600">
                        Event Duration (Start and End Date)
                    </h4>
                    <div className="flex flex-col gap-2 mt-4">
                        <DateRangePicker
                            isRequired
                            aria-label="Event Date Range"
                            value={eventDateRange}
                            onChange={(range) => setEventDateRange(range)}
                        />
                    </div>
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-foreground-600">
                        Member Options
                    </h4>
                    <div className="flex flex-col gap-2 mt-4">
                        <Switch
                            isSelected={eventData.isParticipantsEnabled}
                            onValueChange={handleParticipantsSwitch}
                        >
                            Enable Participants
                        </Switch>
                        <Switch
                            isSelected={eventData.isStaffsEnabled}
                            onValueChange={handleStaffsSwitch}
                        >
                            Enable Staffs
                        </Switch>
                        <div className="flex flex-row gap-2 mt-4">
                            <Controller
                                control={control}
                                name="nParticipants"
                                render={({ field }) => (
                                    <>
                                        <Input
                                            {...field}
                                            className="w-20"
                                            errorMessage={
                                                errors.nParticipants?.message
                                            }
                                            isDisabled={
                                                !eventData.isParticipantsEnabled
                                            }
                                            isInvalid={!!errors.nParticipants}
                                            type="number"
                                            value={field.value?.toString()}
                                            onChange={(e) => {
                                                field.onChange(
                                                    parseInt(
                                                        e.target.value,
                                                        10,
                                                    ),
                                                );
                                            }}
                                        />
                                        <Slider
                                            {...field}
                                            hideValue
                                            showTooltip
                                            formatOptions={{ style: 'decimal' }}
                                            isDisabled={
                                                !eventData.isParticipantsEnabled
                                            }
                                            label="Number of Participants"
                                            value={field.value}
                                            onChange={(value) =>
                                                field.onChange(value)
                                            }
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex flex-row gap-2 mt-4">
                            <Controller
                                control={control}
                                name="nStaff"
                                render={({ field }) => (
                                    <>
                                        <Input
                                            {...field}
                                            className="w-20"
                                            errorMessage={errors.nStaff?.message}
                                            isDisabled={!eventData.isStaffsEnabled}
                                            isInvalid={!!errors.nStaff}
                                            type="number"
                                            value={field.value?.toString()}
                                            onChange={(e) =>
                                                field.onChange(
                                                    parseInt(
                                                        e.target.value,
                                                        10,
                                                    ),
                                                )
                                            }
                                        />
                                        <Slider
                                            {...field}
                                            hideValue
                                            showTooltip
                                            formatOptions={{
                                                style: 'decimal',
                                            }}
                                            isDisabled={!eventData.isStaffsEnabled}
                                            label="Number of Staffs"
                                            value={field.value}
                                            onChange={(value) =>
                                                field.onChange(value)
                                            }
                                        />
                                    </>
                                )}
                            />
                        </div>
                        <p className="ml-auto text-sm text-foreground-400">
                            You can use input box if number of participants or
                            staff exceed 100.
                        </p>
                    </div>
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-foreground-600">
                        Available Roles
                    </h4>
                    <div className="flex flex-col gap-2 mt-4">
                        <Popover>
                            <PopoverTrigger>
                                <Button
                                    endContent={<HiChevronDoubleDown />}
                                    isDisabled={!eventData.isStaffsEnabled}
                                >
                                    {selectedValue || 'Select Role'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Listbox
                                    disallowEmptySelection
                                    aria-label="Select roles"
                                    selectedKeys={new Set(selectedKeys)}
                                    selectionMode="multiple"
                                    onSelectionChange={(keys) =>
                                        setSelectedKeys(
                                            Array.from(keys as Set<string>),
                                        )
                                    }
                                >
                                    <ListboxSection
                                        showDivider
                                        title="Roles Selection"
                                    >
                                        {eventData.roles.map((role) => (
                                            <ListboxItem key={role}>
                                                {role}
                                            </ListboxItem>
                                        ))}
                                    </ListboxSection>
                                </Listbox>
                                <div className="flex flex-row mb-2">
                                    <Input
                                        placeholder="Enter new role"
                                        value={newRole}
                                        onChange={(e) =>
                                            setNewRole(e.target.value)
                                        }
                                    />
                                    <Button
                                        isIconOnly
                                        aria-label="Add New Role"
                                        className=""
                                        color="primary"
                                        onClick={addNewRole}
                                    >
                                        <FaPlus />
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div>
                    <h4 className="text-xl font-semibold text-foreground-600">
                        Event Coordinator
                    </h4>
                    <div className="flex flex-col gap-2 mt-4">
                        <Controller
                            control={control}
                            name="coordinator"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    isRequired
                                    errorMessage={errors.coordinator?.message}
                                    isInvalid={!!errors.coordinator}
                                    placeholder="Enter Coordinator Student ID"
                                />
                            )}
                        />
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
                    color="primary"
                    endContent={<HiChevronDoubleRight />}
                    type="submit"
                >
                    Next Step
                </Button>
            </div>
        </form>
    );
};

export default Step2;