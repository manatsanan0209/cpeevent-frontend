import type { PostEventProps } from '@/types';
import type { Event } from '@/types';

import {
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Checkbox,
    DatePicker,
} from '@nextui-org/react';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLocalTimeZone, now } from '@internationalized/date';

import { AuthContext } from '@/context/AuthContext';

export default function CreatePostModal() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const { event } = location.state as { event: Event };
    const [disableEndDate, setDisableEndDate] = useState<boolean>(false);
    const [markdown, setMarkdown] = useState<string>('');
    const [voteQuestions, setVoteQuestions] = useState<
        { question: string; maxSel: string; options: string[] }[]
    >([]);
    const [formQuestions, setFormQuestions] = useState<
        { question: string; inputType: string; options: string[] }[]
    >([]);

    const [newPost, setNewPost] = useState<PostEventProps>({
        kind: '',
        assignTo: '',
        title: '',
        description: '',
        postDate: new Date().toISOString(),
        endDate: null,
        author: user as string,
    });

    useEffect(() => {
        console.log(voteQuestions);
    }, [voteQuestions]);

    useEffect(() => {
        console.log(formQuestions);
    }, [formQuestions]);

    useEffect(() => {
        if (!event.role.includes('everyone')) {
            event.role.push('everyone');
        }
    }, []);

    useEffect(() => {
        console.log(markdown);
    }, [markdown]);

    useEffect(() => {
        console.log(newPost);
    }, [newPost]);

    function checkDateValidation(startDate: string, endDate: string) {
        if (new Date(endDate) < new Date(startDate)) {
            console.log('Invalid Date');

            return true;
        }
        console.log('Valid Date');

        return false;
    }

    function addQuestion() {
        if (newPost.kind === 'vote') {
            setVoteQuestions([
                ...voteQuestions,
                { question: '', maxSel: '1', options: [] },
            ]);
        } else if (newPost.kind === 'form') {
            setFormQuestions([
                ...formQuestions,
                { question: '', inputType: 'text', options: [] },
            ]);
        }
    }

    function deleteQuestion(index: number) {
        if (newPost.kind === 'vote') {
            const updatedQuestions = voteQuestions.filter(
                (_, i) => i !== index,
            );

            setVoteQuestions(updatedQuestions);
        } else if (newPost.kind === 'form') {
            const updatedQuestions = formQuestions.filter(
                (_, i) => i !== index,
            );

            setFormQuestions(updatedQuestions);
        }
    }

    function updateQuestion(
        index: number,
        key: 'question' | 'maxSel' | 'inputType',
        value: string,
    ) {
        if (newPost.kind === 'vote') {
            const updatedQuestions = [...voteQuestions];

            if (key in updatedQuestions[index]) {
                (updatedQuestions[index] as any)[key] = value;
            }
            setVoteQuestions(updatedQuestions);
        } else if (newPost.kind === 'form') {
            const updatedQuestions = [...formQuestions];

            if (key === 'inputType' && value !== 'option') {
                updatedQuestions[index].options = [];
            }

            if (key in updatedQuestions[index]) {
                (updatedQuestions[index] as any)[key] = value;
            }
            setFormQuestions(updatedQuestions);
        }
    }

    function addOption(questionIndex: number) {
        if (newPost.kind === 'vote') {
            const updatedQuestions = [...voteQuestions];

            updatedQuestions[questionIndex].options.push('');
            setVoteQuestions(updatedQuestions);
        } else if (newPost.kind === 'form') {
            const updatedQuestions = [...formQuestions];

            updatedQuestions[questionIndex].options.push('');
            setFormQuestions(updatedQuestions);
        }
    }

    function deleteOption(questionIndex: number, optionIndex: number) {
        if (newPost.kind === 'vote') {
            const updatedQuestions = [...voteQuestions];

            updatedQuestions[questionIndex].options = updatedQuestions[
                questionIndex
            ].options.filter((_, i) => i !== optionIndex);
            setVoteQuestions(updatedQuestions);
        } else if (newPost.kind === 'form') {
            const updatedQuestions = [...formQuestions];

            updatedQuestions[questionIndex].options = updatedQuestions[
                questionIndex
            ].options.filter((_, i) => i !== optionIndex);
            setFormQuestions(updatedQuestions);
        }
    }

    function updateOption(
        questionIndex: number,
        optionIndex: number,
        value: string,
    ) {
        if (newPost.kind === 'vote') {
            const updatedQuestions = [...voteQuestions];

            updatedQuestions[questionIndex].options[optionIndex] = value;
            setVoteQuestions(updatedQuestions);
        } else if (newPost.kind === 'form') {
            const updatedQuestions = [...formQuestions];

            updatedQuestions[questionIndex].options[optionIndex] = value;
            setFormQuestions(updatedQuestions);
        }
    }

    function completePost(kind: string) {
        if (kind === 'post') {
            setNewPost({
                ...newPost,
                postDate: new Date().toISOString(),
                markdown,
            });
        } else if (kind === 'vote') {
            setNewPost({
                ...newPost,
                postDate: new Date().toISOString(),
                questions: voteQuestions,
            });
        } else if (kind === 'form') {
            setNewPost({
                ...newPost,
                postDate: new Date().toISOString(),
                questions: formQuestions,
            });
        }
        console.log(newPost);
        console.log('Complete !');
    }

    return (
        <>
            <ModalContent>
                {(onClose) => (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            completePost(newPost.kind);
                        }}
                    >
                        <ModalHeader className="flex flex-col gap-1">
                            Create New Post
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                isRequired
                                required
                                className="pr-1"
                                label="Post Name"
                                type="Text"
                                onChange={(e) =>
                                    setNewPost({
                                        ...newPost,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <Input
                                isRequired
                                required
                                label="Post Description"
                                type="text"
                                onChange={(e) =>
                                    setNewPost({
                                        ...newPost,
                                        description: e.target.value,
                                    })
                                }
                            />
                            <div className="flex flex-row">
                                <Select
                                    isRequired
                                    required
                                    className="pr-1"
                                    label="Post Kind"
                                    onChange={(e) =>
                                        setNewPost({
                                            ...newPost,
                                            kind: e.target.value,
                                        })
                                    }
                                >
                                    <SelectItem key="form" value="form">
                                        Form
                                    </SelectItem>
                                    <SelectItem key="post" value="post">
                                        Post
                                    </SelectItem>
                                    <SelectItem key="vote" value="vote">
                                        Vote
                                    </SelectItem>
                                </Select>
                                <Select
                                    isRequired
                                    required
                                    className="pl-1"
                                    label="Assign To"
                                    onChange={(e) =>
                                        setNewPost({
                                            ...newPost,
                                            assignTo: e.target.value,
                                        })
                                    }
                                >
                                    {event.role.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>

                            {newPost.kind === 'form' ? (
                                <>
                                    {formQuestions.map(
                                        (question, questionIndex) => (
                                            <div
                                                key={questionIndex}
                                                className="mb-3"
                                            >
                                                <div className="pl-3 mb-2">
                                                    Question {questionIndex + 1}
                                                </div>
                                                <Input
                                                    label="Question"
                                                    value={question.question}
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            questionIndex,
                                                            'question',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <Select
                                                    className="my-2"
                                                    label="Input Type"
                                                    value={question.inputType}
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            questionIndex,
                                                            'inputType',
                                                            e.target.value,
                                                        )
                                                    }
                                                >
                                                    <SelectItem
                                                        key="text"
                                                        value="text"
                                                    >
                                                        Text
                                                    </SelectItem>
                                                    <SelectItem
                                                        key="option"
                                                        value="option"
                                                    >
                                                        Option
                                                    </SelectItem>
                                                    <SelectItem
                                                        key="number"
                                                        value="number"
                                                    >
                                                        Number
                                                    </SelectItem>
                                                    <SelectItem
                                                        key="date"
                                                        value="date"
                                                    >
                                                        Date
                                                    </SelectItem>
                                                </Select>
                                                {question.inputType ===
                                                    'option' && (
                                                    <>
                                                        {question.options.map(
                                                            (
                                                                option,
                                                                optionIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        optionIndex
                                                                    }
                                                                    className="flex items-center mb-2"
                                                                >
                                                                    <Input
                                                                        className="w-2/3"
                                                                        label={`Option ${optionIndex + 1}`}
                                                                        value={
                                                                            option
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateOption(
                                                                                questionIndex,
                                                                                optionIndex,
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                    <Button
                                                                        className="ml-2 bg-red-500"
                                                                        onPress={() =>
                                                                            deleteOption(
                                                                                questionIndex,
                                                                                optionIndex,
                                                                            )
                                                                        }
                                                                    >
                                                                        Delete
                                                                        Option
                                                                    </Button>
                                                                </div>
                                                            ),
                                                        )}
                                                        <Button
                                                            className="my-2"
                                                            onPress={() =>
                                                                addOption(
                                                                    questionIndex,
                                                                )
                                                            }
                                                        >
                                                            Add Option
                                                        </Button>
                                                    </>
                                                )}
                                                <br />
                                                <Button
                                                    className="bg-red-500"
                                                    onPress={() =>
                                                        deleteQuestion(
                                                            questionIndex,
                                                        )
                                                    }
                                                >
                                                    Delete Question
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                    <div className="flex justify-center">
                                        <Button
                                            className="w-1/3"
                                            onPress={addQuestion}
                                        >
                                            Add Question
                                        </Button>
                                    </div>
                                </>
                            ) : null}

                            {newPost.kind === 'post' ? (
                                <Input
                                    label="Markdown"
                                    placeholder="Enter Markdown Detail"
                                    type="text"
                                    onChange={(e) =>
                                        setMarkdown(e.target.value)
                                    }
                                />
                            ) : null}

                            {newPost.kind === 'vote' ? (
                                <>
                                    {voteQuestions.map(
                                        (question, questionIndex) => (
                                            <div
                                                key={questionIndex}
                                                className="mb-3"
                                            >
                                                <div className="pl-3 mb-2">
                                                    Question {questionIndex + 1}
                                                </div>
                                                <Input
                                                    label="Question"
                                                    value={question.question}
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            questionIndex,
                                                            'question',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                <Input
                                                    className="my-2 w-1/3"
                                                    label="Max Select"
                                                    type="number"
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            questionIndex,
                                                            'maxSel',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                                {question.options.map(
                                                    (option, optionIndex) => (
                                                        <div
                                                            key={optionIndex}
                                                            className="flex items-center mb-2"
                                                        >
                                                            <Input
                                                                className="w-2/3"
                                                                label={`Option ${optionIndex + 1}`}
                                                                value={option}
                                                                onChange={(e) =>
                                                                    updateOption(
                                                                        questionIndex,
                                                                        optionIndex,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                            />
                                                            <Button
                                                                className="ml-2 bg-red-500"
                                                                onPress={() =>
                                                                    deleteOption(
                                                                        questionIndex,
                                                                        optionIndex,
                                                                    )
                                                                }
                                                            >
                                                                Delete Option
                                                            </Button>
                                                        </div>
                                                    ),
                                                )}
                                                <Button
                                                    className="my-2"
                                                    onPress={() =>
                                                        addOption(questionIndex)
                                                    }
                                                >
                                                    Add Option
                                                </Button>
                                                <br />
                                                <Button
                                                    className="bg-red-500"
                                                    onPress={() =>
                                                        deleteQuestion(
                                                            questionIndex,
                                                        )
                                                    }
                                                >
                                                    Delete Question
                                                </Button>
                                            </div>
                                        ),
                                    )}
                                    <div className="flex justify-center">
                                        <Button
                                            className="w-1/3"
                                            onPress={addQuestion}
                                        >
                                            Add Question
                                        </Button>
                                    </div>
                                </>
                            ) : null}
                            <DatePicker
                                hideTimeZone
                                className="pr-1"
                                defaultValue={now(getLocalTimeZone())}
                                errorMessage={'Date is invalid'}
                                hourCycle={24}
                                isDisabled={!disableEndDate}
                                isInvalid={
                                    newPost.endDate &&
                                    checkDateValidation(
                                        newPost.postDate,
                                        newPost.endDate,
                                    )
                                        ? true
                                        : false
                                }
                                label="End Date"
                                onChange={(date) => {
                                    let isoDate = null;

                                    if (date && date.toDate) {
                                        const jsDate = date.toDate();

                                        if (!isNaN(jsDate.getTime())) {
                                            isoDate = jsDate.toISOString();
                                        }
                                    }
                                    setNewPost({
                                        ...newPost,
                                        endDate: isoDate,
                                    });
                                }}
                            />
                            <Checkbox
                                defaultSelected
                                className="pl-4 h-4"
                                size="sm"
                                onChange={() => {
                                    setDisableEndDate(!disableEndDate);
                                    if (!disableEndDate) {
                                        setNewPost({
                                            ...newPost,
                                            endDate: new Date().toISOString(),
                                        });
                                    } else {
                                        setNewPost({
                                            ...newPost,
                                            endDate: null,
                                        });
                                    }
                                }}
                            >
                                Disable End Date
                            </Checkbox>
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
                                color="primary"
                                type="submit"
                                // onPress={() => {
                                //     completePost(newPost.kind);
                                // }}
                            >
                                Create Post
                            </Button>
                        </ModalFooter>
                    </form>
                )}
            </ModalContent>
        </>
    );
}
