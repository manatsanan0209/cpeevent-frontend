import type { UserAccountType } from '@/types/index';

import { Divider, Input, Button } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { axiosAPIInstance } from '@/api/axios-config.ts';

interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
    label,
    placeholder,
    value,
    onChange,
    name,
}: InputFieldProps & { name: string }) => (
    <div className="flex flex-col gap-2">
        <p className="text-zinc-500">{label}</p>
        <Input
            name={name}
            placeholder={placeholder}
            type="text"
            value={value}
            onChange={onChange}
        />
    </div>
);

export default function Account() {
    // const { user } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState<UserAccountType>({
        studentID: '',
        firstName: '',
        lastName: '',
        year: 1,
        imgProfile: '',
        email: '',
        password: '',
        phoneNumber: '',
        username: '',
        created_at: new Date(),
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUserInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const fetchProfile = async () => {
        const response = await axiosAPIInstance.get('v1/account/info');

        return response.data.data;
    };

    const { data: userData } = useQuery<UserAccountType>({
        queryKey: ['studentid'],
        queryFn: fetchProfile,
    });

    useEffect(() => {
        if (userData) {
            setUserInfo(userData);
        }
    }, [userData]);

    return (
        <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-zinc-600">Account</h3>
            <p className="text-zinc-400">Update your account details.</p>
            <Divider className="my-3" />

            <div className="border p-4 rounded-md">
                <h4 className="text-xl font-semibold text-zinc-600">
                    Student ID
                </h4>
                <div className="flex flex-col gap-2 mt-4">
                    <Input
                        isDisabled
                        isReadOnly
                        description="You can't change your student ID."
                        placeholder="Student ID"
                        value={userInfo.studentID}
                    />
                </div>
            </div>

            <div className="border p-4 rounded-md mt-6">
                <h4 className="text-xl font-semibold text-zinc-600">
                    Personal Information
                </h4>
                <div className="w-full flex flex-row gap-2 gap-x-4 mt-4">
                    <div className="w-1/2">
                        <InputField
                            label="Name"
                            name="firstName"
                            placeholder="Name"
                            value={userInfo.firstName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="w-1/2">
                        <InputField
                            label="Surname"
                            name="lastName"
                            placeholder="Surname"
                            value={userInfo.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <InputField
                        label="Year"
                        name="year"
                        placeholder="Year"
                        value={userInfo.year.toString()}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mt-4">
                    <InputField
                        label="Email"
                        name="email"
                        placeholder="Email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mt-4">
                    <InputField
                        label="Phone Number"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={userInfo.phoneNumber}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="mt-6">
                <Button className="bg-violet-700 text-white">
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
