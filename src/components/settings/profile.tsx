import { Avatar, Button, ButtonGroup, Divider, Input } from '@nextui-org/react';
import { TbSignature } from 'react-icons/tb';

export default function Profile() {
    return (
        <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-zinc-600">Profile</h3>
            <p className="text-zinc-400">Manage your profile settings.</p>
            <Divider className="my-3" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <p className="text-zinc-500">Profile Picture </p>
                    <div className="flex flex-row">
                        <Avatar
                            className="w-24 h-24"
                            src="https://i.pravatar.cc/300"
                        />
                        <ButtonGroup className="ml-16">
                            <Button>Upload</Button>
                            <Button>Remove</Button>
                        </ButtonGroup>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-zinc-500">Username</p>
                    <Input
                        placeholder="Username"
                        startContent={<TbSignature />}
                    />
                </div>
            </div>
            <div className="mt-6">
                <Button>Save Changes</Button>
            </div>
        </div>
    );
}
