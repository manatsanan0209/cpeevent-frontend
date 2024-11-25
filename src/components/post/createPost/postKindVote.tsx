import { Button, Input } from '@nextui-org/react';
import { useEffect } from 'react';

type VoteQuestions = {
    question: string;
    options: string[];
};

interface PostKindVoteProps {
    voteQuestions: VoteQuestions;
    setVoteQuestions: React.Dispatch<React.SetStateAction<VoteQuestions>>;
}

export default function PostKindVote({
    voteQuestions,
    setVoteQuestions,
}: PostKindVoteProps) {
    useEffect(() => {
        if (voteQuestions.options.length === 0) {
            setVoteQuestions({
                ...voteQuestions,
                options: [''],
            });
        }
    }, [voteQuestions, setVoteQuestions]);

    function addOption() {
        const updatedQuestion = { ...voteQuestions };

        updatedQuestion.options.push('');
        setVoteQuestions(updatedQuestion);
    }

    function deleteOption(optionIndex: number) {
        const updatedQuestion = { ...voteQuestions };

        updatedQuestion.options = updatedQuestion.options.filter(
            (_, i) => i !== optionIndex,
        );
        setVoteQuestions(updatedQuestion);
    }

    function updateOption(optionIndex: number, value: string) {
        const updatedQuestion = { ...voteQuestions };

        updatedQuestion.options[optionIndex] = value;
        setVoteQuestions(updatedQuestion);
    }

    function updateQuestion(field: keyof VoteQuestions, value: string) {
        const updatedQuestion = { ...voteQuestions, [field]: value };

        setVoteQuestions(updatedQuestion);
    }

    return (
        <div className="mb-3">
            <div className="pl-3 mb-2">Question</div>
            <Input
                isRequired
                errorMessage="This field is required"
                label="Question"
                validationBehavior="native"
                value={voteQuestions.question}
                onChange={(e) => updateQuestion('question', e.target.value)}
            />
            {voteQuestions.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center mb-2">
                    <Input
                        isRequired
                        className="w-2/3"
                        errorMessage="This field is required"
                        label={`Option ${optionIndex + 1}`}
                        validationBehavior="native"
                        value={option}
                        onChange={(e) =>
                            updateOption(optionIndex, e.target.value)
                        }
                    />
                    <Button
                        className="ml-2 bg-gray-200 text-red-500"
                        onPress={() => deleteOption(optionIndex)}
                    >
                        Delete Option
                    </Button>
                </div>
            ))}
            <Button className="my-2 bg-blue-500 text-white" onPress={addOption}>
                Add Option
            </Button>
        </div>
    );
}
