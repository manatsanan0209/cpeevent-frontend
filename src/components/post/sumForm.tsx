import { axiosAPIInstance } from '@/api/axios-config';
import { Button } from '@nextui-org/react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface FormQuestion {
    QuestionIndex: number;
    question: string;
}

interface Answer {
    answer: string[];
    studentID: string;
}

interface Result {
    answers: Answer[];
    questionIndex: number;
    type: string;
}

interface SummaryData {
    postID: string;
    formQuestion: FormQuestion[];
    results: Result[];
}

interface FormResultProps {
    setResultPage: (value: boolean) => void;
}

export default function FormResult({setResultPage}:FormResultProps) {
    const {postid: postID} = useParams<{postid: string}>();

        const fetchSummaryData = async () => {
            const response = await axiosAPIInstance.get(`/v1/posts/summary/${postID}`);
            return response.data.data;
        };

        const {data : summaryData, isLoading, error} = useQuery<SummaryData>({
            queryKey: ['summary', postID],
            queryFn: fetchSummaryData,
            enabled: !!postID,
        });
        console.log(summaryData);

        if (isLoading) {
            return <div>Loading...</div>;
        }
    
        if (error) {
            return <div>Error fetching data</div>;
        }
    
        if (!summaryData) {
            return <div>No data available</div>;
        }

        const hasAnswers = summaryData.results && summaryData.results.some(result => result.answers.length > 0);

    return (
        <>
            <Button isIconOnly onClick={() => setResultPage(false)}>
                <IoMdArrowRoundBack />
            </Button>
            <div
                className="flex justify-center mb-2 text-zinc-600 font-bold text-2xl mt-4">
                Summary submitted form
            </div>
            <div className="h-fit mx-20 rounded-xl shadow-md border border-gray-100 p-8">
            <table className="w-full table-auto border-collapse">
                <thead className="rounded-lg overflow-hidden">
                    <tr className="bg-purple-200 border-b-2 border-gray-300">
                        <th className="px-4 py-2 text-gray-700 rounded-tl-lg rounded-bl-lg">Question</th>
                        <th className="px-4 py-2 text-gray-700">StudentID</th>
                        <th className="px-4 py-2 text-gray-700 rounded-tr-lg rounded-br-lg">Answer</th>
                    </tr>
                </thead>
                    <tbody>
                    {hasAnswers ? (
                            summaryData.formQuestion.map((question, questionIndex) => {
                                const result = summaryData.results.find(
                                    (res) => res.questionIndex === questionIndex
                                );

                                return (
                                    <tr
                                        key={questionIndex}
                                        className="border-t border-gray-300 hover:bg-gray-100 transition-colors"
                                    >
                                        <td className="px-4 py-2 text-gray-700 flex justify-center">
                                            {question.question}
                                        </td>
                                        <td className="px-4 py-2 text-gray-700 text-center">
                                            {result && result.answers.length > 0 ? (
                                                result.answers.map((answer) => (
                                                    <div key={answer.studentID}>{answer.studentID}</div>
                                                ))
                                            ) : (
                                                <div>No data</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-gray-700 text-center">
                                            {result && result.answers.length > 0 ? (
                                                result.answers.map((answer) => (
                                                    <div key={answer.studentID}>{answer.answer.join(', ')}</div>
                                                ))
                                            ) : (
                                                <div>No data</div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-2 text-gray-700 text-center">
                                    No data
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

