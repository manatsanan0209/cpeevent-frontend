import type { UserAccountType } from '@/types/index';

import { Divider, Input, Button, Avatar, ButtonGroup } from '@nextui-org/react';
import { TbSignature } from 'react-icons/tb';
import { useForm, Controller, UseFormSetValue } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useRef, useState } from 'react';
import { TiTick, TiTimes } from 'react-icons/ti';

import { axiosAPIInstance } from '@/api/axios-config.ts';

interface InputFieldProps {
    placeholder: string;
    name: string;
    control: any;
    rules?: any;
    error?: string;
    type?: string;
    startContent?: React.ReactNode;
}

interface UserProfileUpdate {
    username: string;
}

type ProfileFromAPI = {
    username: string;
    imgProfile: string;
};

const InputField = ({
    placeholder,
    name,
    control,
    rules,
    error,
    type = 'text',
    startContent,
}: InputFieldProps) => (
    <div className="flex flex-col gap-2">
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <Input
                    {...field}
                    errorMessage={error}
                    isInvalid={!!error}
                    placeholder={placeholder}
                    startContent={startContent}
                    type={type}
                />
            )}
            rules={rules}
        />
    </div>
);

const ImgUpload = ({
    setImageSrc,
    setValue,
    fileInputRef, // Receive ref as a prop
}: {
    setImageSrc: (src: string | null) => void;
    setValue: UseFormSetValue<UserAccountType>;
    fileInputRef: React.RefObject<HTMLInputElement>; // Declare the prop type
}) => {
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // File validation
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImageSrc(result);
                setValue('imgProfile', result, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setImageSrc(null);
        setValue('imgProfile', '', { shouldDirty: true });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <>
            <Button onClick={handleUploadClick}>Upload</Button>
            <Input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            <Button className="bg-red-400" onClick={handleRemove}>
                Remove
            </Button>
        </>
    );
};

const schema = z.object({
    username: z.string().min(1, 'Username is required'),
    imgProfile: z.string().url('Invalid URL').optional(),
});

export default function Profile() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isDirty },
    } = useForm<UserAccountType>({
        resolver: zodResolver(schema),
        defaultValues: {
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
        },
    });

    const fetchProfile = async () => {
        const response = await axiosAPIInstance.get('v1/account/profile');

        return response.data.data;
    };

    const { data: userData } = useQuery<ProfileFromAPI>({
        queryKey: ['studentid'],
        queryFn: fetchProfile,
    });

    const base64ToImage = (base64: string) => {
        return `data:image/png;base64,${base64}`;
    }

    useEffect(() => {
        if (userData) {
            reset(userData);
        }
    }, [userData, setValue]);

    const updateProfile = async (data: UserProfileUpdate) => {
        const formData = new FormData();
        if (data.username) {
            formData.append('username', data.username);
        }
        if (fileInputRef.current?.files?.[0]) {
            formData.append('file', fileInputRef.current.files[0]);
        }

        const response = await axiosAPIInstance.patch(
            'v1/account/profile',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
        );

        return response.data;
    };

    const { mutate, isPending, isError, isSuccess } = useMutation({
        mutationFn: updateProfile,
    });

    const onSubmit = (data: UserAccountType) => {
        mutate(data, { onSuccess: () => reset(data) });
    };

    const [imageSrc, setImageSrc] = useState<string | null>(null);

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-2xl font-bold text-foreground-600">Profile</h3>
            <p className="text-foreground-400">Manage your profile settings.</p>
            <Divider className="my-3" />
            <div className="border p-4 rounded-md">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Profile Picture
                </h4>
                <div className="flex flex-col gap-2 mt-4">
                    <div className="flex flex-row items-center gap-4">
                        <Avatar
                            className="w-24 h-24"
                            src={imageSrc || (userData?.imgProfile ? base64ToImage(userData.imgProfile) : undefined)}
                        />
                        <ButtonGroup>
                            <ImgUpload
                                setImageSrc={setImageSrc}
                                setValue={setValue}
                                fileInputRef={fileInputRef}
                            />
                        </ButtonGroup>
                    </div>
                </div>
            </div>

            <div className="border p-4 rounded-md mt-6">
                <h4 className="text-xl font-semibold text-foreground-600">
                    Username
                </h4>
                <div className="flex flex-col gap-2 mt-4">
                    <InputField
                        control={control}
                        error={errors.username?.message}
                        name="username"
                        placeholder="Username"
                        startContent={<TbSignature />}
                        type="text"
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-row">
                <Button
                    className={`text-white ${
                        isError
                            ? 'bg-danger-500'
                            : isSuccess
                            ? 'bg-success-500'
                            : 'bg-primary'
                    }`}
                    isDisabled={!isDirty}
                    isLoading={isPending}
                    startContent={
                        isError ? <TiTimes /> : isSuccess ? <TiTick /> : null
                    }
                    type="submit"
                >
                    {isError
                        ? 'Error updating profile'
                        : isSuccess
                        ? 'Profile updated successfully'
                        : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
