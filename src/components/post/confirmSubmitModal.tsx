import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';

interface ConfirmSubmitModalProps {
    onSubmit: () => Promise<void>;
}

export default function ConfirmSubmitModal({
    onSubmit,
}: ConfirmSubmitModalProps) {
    return (
        <>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Submit Form Confirmation
                        </ModalHeader>
                        <ModalBody>
                            <p>Are you sure to submit this form?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => onSubmit()}
                                onPress={() => onClose}
                            >
                                Submit
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </>
    );
}
