import { FaFlag } from 'react-icons/fa';
import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
export function Custom404() {
    const navigate = useNavigate();
    return (
        <div className="h-screen mx-auto grid place-items-center text-center px-8">
            <div>
                <FaFlag className="w-20 h-20 mx-auto" />
                <p
                    color="blue-gray"
                    className="mt-10 !text-3xl !leading-snug md:!text-4xl"
                >
                    Error 404 <br /> It looks like something went wrong.
                </p>
                <p className="mt-8 mb-14 text-[18px] font-normal text-gray-500 mx-auto md:max-w-sm">
                    Don&apos;t worry, our team is already on it.Please try
                    refreshing the page or come back later.
                </p>
                <Button
                    color="warning"
                    className="w-full px-4 md:w-[8rem]"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </Button>
            </div>
        </div>
    );
}

export default Custom404;
