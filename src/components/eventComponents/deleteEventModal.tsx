import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';
import { useState } from 'react';
import { toast } from 'react-toastify';


import { axiosAPIInstance } from '@/api/axios-config';

interface DeleteEventModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    eventID: string;
}

const fetchDeleteEvent = async (eventID: string) => {
    try {
        const response = await axiosAPIInstance.delete(
            `v1/event/deleteEvent/${eventID}`,
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw new Error('Failed to delete event');
    }
};

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
    isOpen,
    onOpenChange,
    eventID,
}) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleDelete = async () => {
        setLoading(true);
        setErrorMessage(null);
        try {
            await fetchDeleteEvent(eventID);
            onOpenChange(); // Close the modal after successful deletion
            toast.success('Event deleted successfully');
            window.location.reload();
        } catch (error) {
            toast.error('Error submitting vote');
            setErrorMessage(
                'Failed to delete the event. Please try again later.',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Delete Event</ModalHeader>
                <ModalBody>
                    <p>Are you sure you want to delete this event?</p>
                    {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        variant="light"
                        onClick={onOpenChange}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        disabled={loading}
                        onClick={handleDelete}
                    >
                        {loading ? 'Deleting...' : 'Confirm'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DeleteEventModal;
