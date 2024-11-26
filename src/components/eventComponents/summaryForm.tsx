import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface QuestionAnswer {
    question: string;
    answer: string;
}

export default function SummaryForm() {
    const [data, setData] = useState<QuestionAnswer[]>([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/questions-answers'); // Adjust the API endpoint accordingly
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Summary of Questions and Answers</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 border-b">Question</th>
                        <th className="px-4 py-2 border-b">Answer</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 border-b">{item.question}</td>
                            <td className="px-4 py-2 border-b">{item.answer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}