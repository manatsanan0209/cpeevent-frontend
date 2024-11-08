import { Textarea } from '@nextui-org/react';
import React, { useEffect } from 'react';

interface PostKindPostProps {
    setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}

export default function PostKindPost({ setMarkdown }: PostKindPostProps) {

    return (
        <>
            <Textarea
                isRequired
                errorMessage="This field is required"
                label="Markdown"
                placeholder="Enter Markdown Detail"
                type="text"
                validationBehavior="native"
                onChange={(e) => setMarkdown(e.target.value)}
            />
        </>
    );
}
