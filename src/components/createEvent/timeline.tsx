import React from 'react';

interface TimelineProps {
    steps: string[];
    currentStep: number;
}

const Timeline: React.FC<TimelineProps> = ({ steps, currentStep }) => {
    return (
        <div className="flex flex-col gap-4 p-4 bg-white shadow-lg rounded-lg">
            {steps.map((step, index) => (
                <div key={index} className="relative flex items-center">
                    <div
                        className={`ml-4 p-4 border-l-4 transition-all duration-300 ease-in-out ${
                            index <= currentStep
                                ? 'border-blue-500 bg-blue-100 text-blue-900'
                                : 'border-gray-300 bg-gray-100 text-gray-700'
                        } rounded-md flex-1`}
                    >
                        {step}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
