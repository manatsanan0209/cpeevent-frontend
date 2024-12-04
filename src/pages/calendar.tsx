import { title } from '@/components/primitives';
import DefaultLayout from '@/layouts/default';
import { FullCalendar } from '@/components/calendarComponents/fullCalendar';

import { useQuery } from '@tanstack/react-query';
import { axiosAPIInstance } from '@/api/axios-config.ts';
import { Skeleton } from '@nextui-org/react';

export default function CalendarPage() {
    const fetchEvents = async () => {
        const response = await axiosAPIInstance.get('v1/events');

        return response.data.data;
    };

    const {
        data: allEventData = [],
        error,
        isLoading,
    } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 pt-8 md:pt-10">
                <div className="inline-block max-w-lg text-center justify-center">
                    <h1 className={title()}>Calendar</h1>
                </div>
                {error ? (
                    <div>Error loading events: {error.message}</div>
                ) : (
                    <Skeleton isLoaded={!isLoading} className='w-full'>
                        <FullCalendar events={allEventData} />
                    </Skeleton>
                )}
            </section>
        </DefaultLayout>
    );
}
