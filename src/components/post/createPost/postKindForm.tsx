import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import React, { useEffect } from 'react';

type FormQuestion = {
    question: string;
    inputType: string;
    options: string[];
};

interface PostKindFormProps {
    formQuestions: FormQuestion[];
    setFormQuestions: React.Dispatch<React.SetStateAction<FormQuestion[]>>;
}

export default function PostKindForm({
    formQuestions,
    setFormQuestions,
}: PostKindFormProps) {
    useEffect(() => {
        if (formQuestions.length === 0) {
            setFormQuestions([
                { question: '', inputType: 'text', options: [] },
            ]);
        }
    }, [formQuestions, setFormQuestions]);

    function addQuestion() {
        setFormQuestions([
            ...formQuestions,
            { question: '', inputType: 'text', options: [] },
        ]);
    }

    function deleteQuestion(index: number) {
        if (formQuestions.length > 1) {
            const updatedQuestions = formQuestions.filter(
                (_, i) => i !== index,
            );

            setFormQuestions(updatedQuestions);
        }
    }

    function updateQuestion(
        index: number,
        key: 'question' | 'inputType',
        value: string,
    ) {
        const updatedQuestions = [...formQuestions];

        if (key === 'inputType' && value !== 'option') {
            updatedQuestions[index].options = [];
        }

        updatedQuestions[index][key] = value;
        setFormQuestions(updatedQuestions);
    }

    function addOption(questionIndex: number) {
        const updatedQuestions = [...formQuestions];

        updatedQuestions[questionIndex].options.push('');
        setFormQuestions(updatedQuestions);
    }

    function deleteOption(questionIndex: number, optionIndex: number) {
        const updatedQuestions = [...formQuestions];

        updatedQuestions[questionIndex].options = updatedQuestions[
            questionIndex
        ].options.filter((_, i) => i !== optionIndex);
        setFormQuestions(updatedQuestions);
    }

    function updateOption(
        questionIndex: number,
        optionIndex: number,
        value: string,
    ) {
        const updatedQuestions = [...formQuestions];

        updatedQuestions[questionIndex].options[optionIndex] = value;
        setFormQuestions(updatedQuestions);
    }

    return (
        <>
            {formQuestions.map((question, questionIndex) => (
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
                    <Select
                        isRequired
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
                        <SelectItem key="text" value="text">
                            Text
                        </SelectItem>
                        <SelectItem key="option" value="option">
                            Option
                        </SelectItem>
                        <SelectItem key="number" value="number">
                            Number
                        </SelectItem>
                        <SelectItem key="date" value="date">
                            Date
                        </SelectItem>
                    </Select>
                    {question.inputType === 'option' && (
                        <>
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
                                            deleteOption(
                                                questionIndex,
                                                optionIndex,
                                            )
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
                        </>
                    )}
                    <br />
                    {formQuestions.length > 1 && (
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
