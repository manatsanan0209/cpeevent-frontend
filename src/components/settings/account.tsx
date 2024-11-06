import { Divider, Input, Button } from '@nextui-org/react';

interface InputFieldProps {
    label: string;
    placeholder: string;
}

const InputField = ({ label, placeholder }: InputFieldProps) => (
    <div className="flex flex-col gap-2">
        <p className="text-zinc-500">{label}</p>
        <Input placeholder={placeholder} />
    </div>
);

export default function Account() {
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
                    />
                </div>
            </div>

            <div className="border p-4 rounded-md mt-6">
                <h4 className="text-xl font-semibold text-zinc-600">
                    Personal Information
                </h4>
                <div className="w-full flex flex-row gap-2 gap-x-4 mt-4">
                    <div className="w-1/2">
                        <InputField label="Name" placeholder="Name" />
                    </div>
                    <div className="w-1/2">
                        <InputField label="Surname" placeholder="Surname" />
                    </div>
                </div>
                <div className="mt-4">
                    <InputField label="Year" placeholder="Year" />
                </div>
                <div className="mt-4">
                    <InputField label="Email" placeholder="Email" />
                </div>
                <div className="mt-4">
                    <InputField
                        label="Phone Number"
                        placeholder="Phone Number"
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
