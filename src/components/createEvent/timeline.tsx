import { motion } from 'framer-motion';

interface TimelineProps {
    steps: {
        step: string;
        description: string;
    }[];
    currentStep: number;
}

const Timeline: React.FC<TimelineProps> = ({ steps, currentStep }) => (
    <ol className="relative border-s border-foreground-200">
        {steps.map((stepObj, index) => (
            <li key={index} className="mb-10 ms-6">
                <motion.span
                    animate={index <= currentStep ? { scale: [1, 1.1, 1] } : {}}
                    className={`absolute flex items-center justify-center w-6 h-6 rounded-full -start-3 ring-4 ${
                        index <= currentStep
                            ? 'bg-violet-700 ring-violet-400'
                            : 'bg-white ring-highlight-400'
                    }`}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <h3 className="flex items-center mb-1 text-xl font-semibold text-foreground-600 ">
                    {stepObj.step}
                </h3>
                <time className="block mb-2 text-md font-normal leading-none text-foreground-400 dark:text-gray-500">
                    {stepObj?.description}
                </time>
            </li>
        ))}
    </ol>
);

export default Timeline;
