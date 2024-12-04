import DefaultLayout from '@/layouts/default';
import EventHome from '@/components/eventHome.tsx';
import CarouselComponent from '@/components/carousel.tsx';

export default function IndexPage() {
    return (
        <DefaultLayout>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <CarouselComponent />
                </div>
                <div className="col-span-3">
                    <EventHome />
                </div>
            </div>
        </DefaultLayout>
    );
}
