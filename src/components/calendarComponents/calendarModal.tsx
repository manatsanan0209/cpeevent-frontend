import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Accordion,
    AccordionItem,
} from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';

type Events = {
    eventID: string;
    eventName: string;
    startDate: Date;
    endDate: Date;
}[];

type Posts = {
    title: string;
    postDate: Date;
    endDate: Date;
}[];

interface CalendarModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    date: Date;
    events?: Events;
    posts?: Posts;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
    isOpen,
    onOpenChange,
    date,
    events = [],
}) => {
    const navigate = useNavigate();
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>{date.toDateString()}</ModalHeader>
                <ModalBody>
                    {events && events.length === 0 ? (
                        <p>No events</p>
                    ) : (
                        events.map((event) => (
                            <Accordion key={event.eventID} variant="splitted">
                                <AccordionItem
                                    title={
                                        <p className="font-semibold">
                                            {event.eventName}
                                        </p>
                                    }
                                >
                                    <div className="flex flex-row justify-between items-center">
                                        <p className="font-light text-foreground-500">
                                            {event.startDate.toLocaleDateString(
                                                'en-GB',
                                            )}{' '}
                                            -{' '}
                                            {event.endDate.toLocaleDateString(
                                                'en-GB',
                                            )}
                                        </p>
                                        <Button
                                            color="primary"
                                            onClick={() => {
                                                navigate(`/events`, {
                                                    state: {
                                                        targetID: event.eventID,
                                                    },
                                                });
                                            }}
                                        >
                                            จิ้ม😘
                                        </Button>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        ))
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() => {
                            // setSelectedEvent(null);
                            onOpenChange();
                        }}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
