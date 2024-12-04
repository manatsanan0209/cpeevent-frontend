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
import { useNavigate, useParams } from 'react-router-dom';


type Events = {
    eventID: string;
    eventName: string;
    startDate: Date;
    endDate: Date;
}[];

type Posts = {
    postID?: string;
    title: string;
    postDate: Date;
    endDate: Date | null;
    kind: string;
}[];

interface CalendarModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    onTabChange?: (key: string) => void;
    date: Date;
    events?: Events;
    posts?: Posts;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
    isOpen,
    onOpenChange,
    onTabChange,
    date,
    events = [],
    posts = [],
}) => {
    const navigate = useNavigate();
    const { eventid } = useParams<{ eventid: string }>();
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>{date.toDateString()}</ModalHeader>
                <ModalBody>
                    {events && events.length > 0 ? (
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
                                            View More
                                        </Button>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        ))
                    ) : posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <Accordion key={post.title} variant="splitted">
                                <AccordionItem
                                    title={
                                        <p className="font-semibold">
                                            {post.title}
                                        </p>
                                    }
                                >
                                    <div className="flex flex-row justify-between items-center">
                                        <p className="font-light text-foreground-500">
                                            {post.postDate.toLocaleDateString(
                                                'en-GB',
                                            )}{' '}
                                            {post.endDate &&
                                                `- ${post.endDate.toLocaleDateString(
                                                    'en-GB',
                                                )}`}
                                        </p>
                                        <Button
                                            color="primary"
                                            onClick={() => {
                                                onOpenChange();
                                                onTabChange && onTabChange('Post');
                                                post.kind === 'post'
                                                    ? navigate(
                                                          `/workspace/${eventid}/post/${post.postID}`,
                                                      )
                                                    : post.kind === 'vote'
                                                      ? navigate(
                                                            `/workspace/${eventid}/vote/${post.postID}`,
                                                        )
                                                      : navigate(
                                                            `/workspace/${eventid}/form/${post.postID}`,
                                                        );
                                            }}
                                        >
                                            View More
                                        </Button>
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        ))
                    ) : window.location.pathname.includes('workspace') ? (
                        <p>No posts</p>
                    ) : (
                        <p>No events</p>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() => {
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
