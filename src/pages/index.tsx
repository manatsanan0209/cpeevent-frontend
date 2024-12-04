import DefaultLayout from '@/layouts/default';
import EventHome from '@/components/index/eventHome';
import CarouselComponent from '@/components/index/carousel';
import MiniCalendar from '@/components/index/miniCalendar';

export default function IndexPage() {
    return (
        <DefaultLayout>
            <div className="grid grid-cols-3">
                <div className="col-span-2 ">
                    <CarouselComponent />
                </div>
                <div className="col-span-1 flex justify-center items-center">
                    <MiniCalendar />
                </div>
                <div className="col-span-3">
                    <EventHome />
                </div>
            </div>
        </DefaultLayout>
    );
}
