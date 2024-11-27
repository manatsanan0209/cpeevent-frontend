import { Divider } from '@nextui-org/react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import DefaultLayout from '@/layouts/default';
import Timeline from '@/components/updateEvent/timeline';
import Step1 from '@/components/updateEvent/step1';
import Step2 from '@/components/updateEvent/step2';
import Step3 from '@/components/updateEvent/step3';
import { EventProvider, useEventContext } from '@/context/EventContext'; // Adjust the import path as necessary
import { axiosAPIInstance } from '@/api/axios-config';

const UpdateEventPageContent: React.FC<{ eventContent: any }> = () => {
    const { currentStep } = useEventContext();

    const steps = [
        { step: 'Step 1', description: 'Event Details' },
        { step: 'Step 2', description: 'Participants' },
        { step: 'Step 3', description: 'Summary' },
    ];

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <Step1 />;
            case 1:
                return <Step2 />;
            case 2:
                return <Step3 />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <DefaultLayout>
            <div className="flex flex-col mb-4 text-left gap-1">
                <h2 className="text-4xl font-bold text-foreground-600 capitalize">
                    Edit Event
                </h2>
                <p className="text-foreground-400">
                    Fill out event details to create a new event
                </p>
            </div>
            <Divider />
            <div className="flex flex-row gap-6 mt-4">
                {/* Sidebar */}
                <div className="w-1/5">
                    <div className="p-3 flex justify-center">
                        <Timeline currentStep={currentStep} steps={steps} />
                    </div>
                </div>
                {/* Main Content */}
                <div className="w-4/5">{renderStepContent()}</div>
            </div>
        </DefaultLayout>
    );
};

const UpdateEventPage: React.FC = () => {
    const { eventid } = useParams<{ eventid: string }>();

    interface EventContent {
        data: any;
    }

    const [eventContent, setEventContent] = useState<EventContent | null>(null);

    useEffect(() => {
        axiosAPIInstance
            .get(`v1/event/getEvent/${eventid}`)
            .then((response) => {
                setEventContent(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [eventid]);

    if (!eventContent) {
        return <div>Loading...</div>;
    }

    return (
        <EventProvider content={eventContent.data}>
            <UpdateEventPageContent eventContent={eventContent} />
        </EventProvider>
    );
};

export default UpdateEventPage;
