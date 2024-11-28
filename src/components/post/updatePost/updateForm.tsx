import { Button, Input, Select, SelectItem } from '@nextui-org/react';
// import React, { useEffect } from 'react';

type FormQuestion = {
    question: string;
    inputType: string;
    options?: string[];
};

interface PostKindFormProps {
    formQuestions?: FormQuestion[];
    setFormQuestions: React.Dispatch<React.SetStateAction<FormQuestion[]>>;
}

export default function updateForm({
    formQuestions = [],
    setFormQuestions,
}: PostKindFormProps) {


    function addQuestion() {
        // console.log(formQuestions); 
        // const updatedQuest = [...formQuestions];
        // console.log(updatedQuest);  
        // updatedQuest.push({ question: '', inputType: 'text', options: [] });
        // console.log(updatedQuest);
        // setFormQuestions(updatedQuest);
        const updatedQuestions = [...formQuestions];
        updatedQuestions.push({ question: '', inputType: 'text', options: [] });
        setFormQuestions(updatedQuestions);
    }
    // function updateQuestion(field: keyof VoteQuestions, value: string) {
    //     const updatedQuestion = { ...voteQuestions, [field]: value };

    //     setVoteQuestions(updatedQuestion);
    // }

    function deleteQuestion(index: number) {
        if (formQuestions.length > 1) {
            console.log(formQuestions);
            const updateQues = formQuestions.filter((_, i) => i !== index,);
            setFormQuestions(updateQues);
            console.log(updateQues);
            console.log(formQuestions);
        }
    }

    function updateQuestion(
        questionIndex: number,
        key: 'question' | 'inputType',
        value: string
    ) {
        const updatedQuestions = [...formQuestions];
        updatedQuestions[questionIndex][key] = value;
        if (key === 'inputType' && value !== 'option') {
            updatedQuestions[questionIndex].options = [];
        }
        setFormQuestions(updatedQuestions);
    }
    //     index: number,
    //     key: 'question' | 'inputType',
    //     value: string,
    // ) {
    //     const updatedQuestion = [...formQuestions];

    //     if (key === 'inputType') {
    //         if (value === 'option') {
    //             updatedQuestion[index].options = [''];
    //         } else {
    //             updatedQuestion[index].options = [];
    //         }
    //     }
    //     updatedQuestion[index][key] = value;
    //     setFormQuestions(updatedQuestion);

    //add Question


    function addOption(questionIndex: number) {
        const updatedQuestions = [...formQuestions];
        if (!updatedQuestions[questionIndex].options) {
            updatedQuestions[questionIndex].options = [];
        }
        updatedQuestions[questionIndex].options.push('');
        setFormQuestions(updatedQuestions);
    }

    function deleteOption(questionIndex: number, optionIndex: number) {
        const updatedQuestions = [...formQuestions];
        if (updatedQuestions[questionIndex].options) {
            updatedQuestions[questionIndex].options = updatedQuestions[
                questionIndex
            ].options.filter((_, i) => i !== optionIndex);
        }
        setFormQuestions(updatedQuestions);
    }

    function updateOption(
        questionIndex: number,
        optionIndex: number,
        value: string
    ) {
        const updatedQuestions = [...formQuestions];
        if (updatedQuestions[questionIndex].options) {
            updatedQuestions[questionIndex].options[optionIndex] = value;
        }
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
                                e.target.value
                            )
                        }
                    />
                    <Select
                        isRequired
                        className="my-2"
                        errorMessage="This field is required"
                        label="Input Type"
                        selectedKeys={[question.inputType]}
                        value={question.inputType}
                        onChange={(e) =>
                            updateQuestion(
                                questionIndex,
                                'inputType',
                                e.target.value
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
                            {question.options?.map((option, optionIndex) => (
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
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Button
                                        className="ml-2 bg-gray-200 text-red-500"
                                        onPress={() =>
                                            deleteOption(
                                                questionIndex,
                                                optionIndex
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
