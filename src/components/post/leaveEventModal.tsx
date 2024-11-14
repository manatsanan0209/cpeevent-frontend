import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { axiosAPIInstance } from '@/api/axios-config.ts';

interface LeaveEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    backdrop: 'opaque' | 'transparent' | 'blur';
    eventID: string;
}

interface LeaveEventRequest {
    eventID: string;
}

const LeaveEventModal: React.FC<LeaveEventModalProps> = ({
    isOpen,
    onClose,
    backdrop,
    eventID,
}) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const leaveEvent = async (data: LeaveEventRequest) => {
        const response = await axiosAPIInstance.patch(`v1/event/leave`, data);

        return response.data;
    };

    const { mutate, isError, isPending, isSuccess } = useMutation({
        mutationFn: leaveEvent,
    });

    const onLeave = () => {
        mutate(
            { eventID },
            {
                onSuccess: () => {
                    navigate(`/events`);
                },
                onError: (error: any) => {
                    if (error.response?.status === 404) {
                        setErrorMessage('You have already left this event.');
                    } else {
                        setErrorMessage('An error occurred. Please try again.');
                    }
                },
            },
        );
    };

    return (
        <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <>
                    <ModalHeader className="flex flex-col gap-1">
                        Leave Event Confirmation
                    </ModalHeader>
                    <ModalBody className="flex flex-row">
                        Do you want to leave event?
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            color={
                                isError
                                    ? 'danger'
                                    : isSuccess
                                    ? 'success'
                                    : 'primary'
                            }
                            isDisabled={isError || isSuccess}
                            isLoading={isPending}
                            onPress={onLeave}
                        >
                            {errorMessage ? errorMessage : 'Confirm'}
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
};

export default LeaveEventModal;
