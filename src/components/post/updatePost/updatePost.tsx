import { Textarea } from '@nextui-org/react';
import React from 'react';

interface PostKindPostProps {
    markdown?: string; 
    setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}

export default function updatePost({
    markdown,
    setMarkdown,
}: PostKindPostProps) {
    return (
        <Textarea
            defaultValue={markdown} 
            errorMessage="This field is required"
            label="Markdown"
            placeholder="Enter Markdown Detail"
            type="text"
            validationBehavior="native"
            onChange={(e) => setMarkdown(e.target.value)}
        />
    );
}
