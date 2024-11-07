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

import PostKindPost from './postKindPost';
import PostKindVote from './postKindVote';
import PostKindForm from './postKindForm';

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
                                className="pr-1"
                                errorMessage="This field is required"
                                label="Post Name"
                                type="Text"
                                validationBehavior="native"
                                onChange={(e) =>
                                    setNewPost({
                                        ...newPost,
                                        title: e.target.value,
                                    })
                                }
                            />
                            <Input
                                isRequired
                                errorMessage="This field is required"
                                label="Post Description"
                                type="text"
                                validationBehavior="native"
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
                                    className="pr-1"
                                    errorMessage="This field is required"
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
                                <PostKindForm
                                    formQuestions={formQuestions}
                                    setFormQuestions={setFormQuestions}
                                />
                            ) : null}

                            {newPost.kind === 'post' ? (
                                <>
                                    <PostKindPost
                                        markdown={markdown}
                                        setMarkdown={setMarkdown}
                                    />
                                </>
                            ) : null}

                            {newPost.kind === 'vote' ? (
                                <PostKindVote
                                    setVoteQuestions={setVoteQuestions}
                                    voteQuestions={voteQuestions}
                                />
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
                                className="bg-violet-700 text-white"
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
