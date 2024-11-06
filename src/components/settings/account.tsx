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
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-zinc-500">Student ID</p>
                    <Input
                        isDisabled
                        isReadOnly
                        description="You can't change your student ID."
                        placeholder="Student ID"
                    />
                </div>
                <div className="w-full flex flex-row gap-2 gap-x-4">
                    <div className="w-1/2">
                        <InputField label="Name" placeholder="Name" />
                    </div>
                    <div className="w-1/2">
                        <InputField label="Surname" placeholder="Surname" />
                    </div>
                </div>
                <InputField label="Year" placeholder="Year" />
                <InputField label="Email" placeholder="Email" />
                <InputField label="Phone Number" placeholder="Phone Number" />
            </div>
            <div className="mt-6">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
