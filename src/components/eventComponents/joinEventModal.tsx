import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { axiosAPIInstance } from '@/api/axios-config.ts';

interface JoinEventModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    eventID: string;
}

interface JoinEventRequest {
    eventID: string;
    role: string;
}

const JoinEventModal: React.FC<JoinEventModalProps> = ({
    isOpen,
    onOpenChange,
    eventID,
}) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState('staff');
    const isParticipantDisabled = true;
    const joinEvent = async (data: JoinEventRequest) => {
        const response = await axiosAPIInstance.patch(`v1/event/join`, data);

        return response.data;
    };

    const { mutate, isError, isPending } = useMutation({
        mutationFn: joinEvent,
    });

    const onJoin = () => {
        mutate(
            { eventID, role: selectedRole },
            {
                onSuccess: () => navigate(`/workspace/${eventID}`),
                onError: (error: any) => {
                    if (error.response?.status === 409) {
                        setErrorMessage('You have already joined this event.');
                    } else {
                        setErrorMessage('An error occurred. Please try again.');
                    }
                },
            },
        );
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Join Workspace Confirmation
                        </ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want to join the workspace?</p>
                            <motion.div
                                className={`border p-4 rounded-md cursor-pointer ${
                                    selectedRole === 'participant'
                                        ? 'border-primary'
                                        : 'border-gray-300'
                                } ${
                                    isParticipantDisabled
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                                whileHover={{
                                    scale: isParticipantDisabled ? 1 : 1.1,
                                }}
                                whileTap={{
                                    scale: isParticipantDisabled ? 1 : 0.9,
                                }}
                                onClick={() =>
                                    !isParticipantDisabled &&
                                    handleRoleChange('participant')
                                }
                            >
                                <h5 className="text-lg font-semibold text-foreground-600">
                                    Participant
                                </h5>
                                <p className="text-foreground-400">
                                    Engaging as a participant.
                                </p>
                            </motion.div>
                            <motion.div
                                className={`border p-4 rounded-md cursor-pointer ${
                                    selectedRole === 'staff'
                                        ? 'border-primary'
                                        : 'border-foreground-300'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleRoleChange('staff')}
                            >
                                <h5 className="text-lg font-semibold text-foreground-600">
                                    Staff
                                </h5>
                                <p className="text-foreground-400">
                                    Contributing as staff.
                                </p>
                            </motion.div>
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
                                color={isError ? 'danger' : 'primary'}
                                isDisabled={isError}
                                isLoading={isPending}
                                onPress={onJoin}
                            >
                                {errorMessage ? errorMessage : 'Confirm'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default JoinEventModal;
