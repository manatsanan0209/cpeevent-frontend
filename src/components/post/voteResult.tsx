import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Label,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useContext } from 'react';

import { axiosAPIInstance } from '@/api/axios-config';
import { AuthContext } from '@/context/AuthContext';

export default function VoteResult() {
    const { postid } = useParams();
    const { user } = useContext(AuthContext);

    const fetchPostSummary = async () => {
        const response = await axiosAPIInstance.get(
            `v1/posts/summary/${postid}`,
        );

        return response.data.data;
    };
    const { data: summaryData } = useQuery({
        queryKey: ['postSummary', postid],
        queryFn: fetchPostSummary,
        refetchInterval: 300,
    });
    const transformedData =
        summaryData?.totalVotes === 0
            ? []
            : summaryData?.results.map(
                  (item: { option: string; count: number }) => ({
                      name: item.option,
                      votes: item.count,
                  }),
              ) || [];

    const fetchTransaction = async () => {
        const response = await axiosAPIInstance.get(
            `v1/posts/answer/${postid}/${user}`,
        );

        return response.data.data;
    };
    const { data: transactionData } = useQuery({
        queryKey: ['transaction', postid, user],
        queryFn: fetchTransaction,
    });

    return (
        <>
            <div className=" mx-auto py-3 w-9/12 ">
                <h1 className="text-center font-bold text-2xl mb-4 text-zinc-600">
                    Voting Results
                </h1>
                <div className="flex flex-row w-full">
                    <div className="flex justify-center w-3/5 ">
                        {transactionData?.answer ? (
                            <div className=" text-red-500 font-bold text-base">
                                Your answer : &quot; {transactionData?.answer}{' '}
                                &quot;
                            </div>
                        ) : (
                            <div className=" text-red-500 font-bold text-base">
                                You haven&apos;t voted yet
                            </div>
                        )}
                    </div>
                    <div className="flex mb-3 ml-auto text-blue-500 font-bold text-base w-2/5 justify-center">
                        Total votes : {summaryData?.totalVotes}
                    </div>
                </div>
                <div className="flex justify-center w-full">
                    <BarChart
                        barSize={50}
                        className="flex justify-center w-full"
                        data={transformedData}
                        height={340}
                        width={800}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            className="text-md overflow-hidden"
                            dataKey="name"
                            tickFormatter={(tick) =>
                                tick.length > 10
                                    ? `${tick.slice(0, 10)}...`
                                    : tick
                            }
                        />
                        <Tooltip formatter={(value) => value} />

                        <YAxis />
                        <Label
                            angle={-90}
                            position="insideLeft"
                            value="Number"
                        />

                        <Legend />
                        <Bar
                            dataKey="votes"
                            fill="#7045DE"
                            style={{
                                filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3))',
                            }}
                        />
                    </BarChart>
                </div>
            </div>
        </>
    );
}
