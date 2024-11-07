import { Button, Input } from '@nextui-org/react';
import React, { useEffect } from 'react';

type VoteQuestion = {
    question: string;
    maxSel: string;
    options: string[];
};

interface PostKindVoteProps {
    voteQuestions: VoteQuestion[];
    setVoteQuestions: React.Dispatch<React.SetStateAction<VoteQuestion[]>>;
}

export default function PostKindVote({
    voteQuestions,
    setVoteQuestions,
}: PostKindVoteProps) {
    // Ensure the component has at least one question on initial render
    useEffect(() => {
        if (voteQuestions.length === 0) {
            setVoteQuestions([{ question: '', maxSel: '1', options: [] }]);
        }
    }, [voteQuestions, setVoteQuestions]);

    function addQuestion() {
        setVoteQuestions([
            ...voteQuestions,
            { question: '', maxSel: '1', options: [] },
        ]);
    }

    function deleteQuestion(index: number) {
        // Prevent deletion if there is only one question left
        if (voteQuestions.length > 1) {
            const updatedQuestions = voteQuestions.filter(
                (_, i) => i !== index,
            );

            setVoteQuestions(updatedQuestions);
        }
    }

    function updateQuestion(
        index: number,
        key: 'question' | 'maxSel',
        value: string,
    ) {
        const updatedQuestions = [...voteQuestions];

        updatedQuestions[index][key] = value;
        setVoteQuestions(updatedQuestions);
    }

    function addOption(questionIndex: number) {
        const updatedQuestions = [...voteQuestions];

        updatedQuestions[questionIndex].options.push('');
        setVoteQuestions(updatedQuestions);
    }

    function deleteOption(questionIndex: number, optionIndex: number) {
        const updatedQuestions = [...voteQuestions];

        updatedQuestions[questionIndex].options = updatedQuestions[
            questionIndex
        ].options.filter((_, i) => i !== optionIndex);
        setVoteQuestions(updatedQuestions);
    }

    function updateOption(
        questionIndex: number,
        optionIndex: number,
        value: string,
    ) {
        const updatedQuestions = [...voteQuestions];

        updatedQuestions[questionIndex].options[optionIndex] = value;
        setVoteQuestions(updatedQuestions);
    }

    console.log('vote question : ', voteQuestions);

    return (
        <>
            {voteQuestions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-3">
                    <div className="pl-3 mb-2">
                        Question {questionIndex + 1}
                    </div>
                    <Input
                        isRequired
                        errorMessage="This field is required"
                        label="Question"
                        validationBehavior="native"
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
                        isRequired
                        className="my-2 w-1/3"
                        errorMessage="This field is required"
                        label="Max Select"
                        type="number"
                        validationBehavior="native"
                        value={question.maxSel}
                        onChange={(e) =>
                            updateQuestion(
                                questionIndex,
                                'maxSel',
                                e.target.value,
                            )
                        }
                    />
                    {question.options.map((option, optionIndex) => (
                        <div
                            key={optionIndex}
                            className="flex items-center mb-2"
                        >
                            <Input
                                isRequired
                                className="w-2/3"
                                errorMessage="This field is required"
                                label={`Option ${optionIndex + 1}`}
                                validationBehavior="native"
                                value={option}
                                onChange={(e) =>
                                    updateOption(
                                        questionIndex,
                                        optionIndex,
                                        e.target.value,
                                    )
                                }
                            />
                            <Button
                                className="ml-2 bg-gray-200 text-red-500"
                                onPress={() =>
                                    deleteOption(questionIndex, optionIndex)
                                }
                            >
                                Delete Option
                            </Button>
                        </div>
                    ))}
                    <Button
                        className="my-2 bg-blue-500 text-white"
                        onPress={() => addOption(questionIndex)}
                    >
                        Add Option
                    </Button>
                    <br />
                    {voteQuestions.length > 1 && (
                        <Button
                            className="bg-red-500 text-white"
                            onPress={() => deleteQuestion(questionIndex)}
                        >
                            Delete Question
                        </Button>
                    )}
                </div>
            ))}
            <div className="flex justify-center">
                <Button className="w-1/3 bg-green-400" onPress={addQuestion}>
                    Add Question
                </Button>
            </div>
        </>
    );
}
