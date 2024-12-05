import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';
import { UseMutationResult } from '@tanstack/react-query';

interface ConfirmSubmitModalProps {
    onSubmit: UseMutationResult<void, Error, void, unknown>;
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
                                onClick={() => {
                                    onSubmit.mutate();
                                    onClose();
                                }}
                                // onPress={() => onClose}
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
