import { Textarea } from '@nextui-org/react';
import React from 'react';

interface PostKindPostProps {
    markdown?: string; // Optional prop for pre-filling in edit mode
    setMarkdown: React.Dispatch<React.SetStateAction<string>>;
}



export default function updatePost({markdown, setMarkdown}: PostKindPostProps) {
    return (
        <Textarea
            errorMessage="This field is required"
            label="Markdown"
            placeholder="Enter Markdown Detail"
            type="text"
            validationBehavior="native"
            defaultValue={markdown} // Pre-fill if editing
            onChange={(e) => setMarkdown(e.target.value)}
        />
    );
}
