// import { useState } from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { RiArrowLeftWideLine,RiArrowRightWideLine } from "react-icons/ri";
import comcampImage from '@/images/comcamp.png';
import comcamp34Image from '@/images/comcamp34.jpg';
import ophImage from '@/images/oph.jpg';

const CustomLeftArrow = ({ onClick }: { onClick?: () => void }) => (
    <button onClick={onClick} className="absolute left-2 top-1/2 transform -translate-y-1/2  text-white p-2 ">
        <RiArrowLeftWideLine  size={72} />
    </button>
);

const CustomRightArrow = ({ onClick }: { onClick?: () => void }) => (
    <button onClick={onClick} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white p-2 ">
        <RiArrowRightWideLine size={72} />
    </button>
);

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const CarouselComponent = () => {
    return (
        <div className="max-w-2xl mr-auto ">
            <Carousel
                responsive={responsive}
                customLeftArrow={<CustomLeftArrow />}
                customRightArrow={<CustomRightArrow />}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={3000}
            >
                <div className="p-4">
                    <img src={comcampImage} alt="Item 1" className="w-full h-75 object-contain rounded-lg" />
                </div>
                <div className="p-4">
                    <img src={comcamp34Image} alt="Item 2" className="w-full h-75 object-contain rounded-lg" />
                </div>
                <div className="p-4">
                    <img src={ophImage} alt="Item 3" className="w-full h-75 object-contain rounded-lg" />
                </div>
            </Carousel>
        </div>
    );
};

export default CarouselComponent;