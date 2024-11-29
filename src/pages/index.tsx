import DefaultLayout from '@/layouts/default';
import EventHome from '@/components/eventHome.tsx';

export default function IndexPage() {
    return (
        <DefaultLayout>
            <div />
            <div>
                <EventHome />
            </div>
        </DefaultLayout>
    );
}
