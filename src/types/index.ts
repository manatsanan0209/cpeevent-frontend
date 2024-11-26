import { SVGProps } from 'react';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export interface Event {
    _id: string;
    eventName: string;
    eventDescription: string;
    nParticipant: number;
    participants: string[];
    nStaff: number;
    startDate: string;
    endDate: string;
    president: string;
    kind: string;
    role: string[];
    icon: string | null;
    poster: string | null;
    postList: string[];
    staff: {
        stdID: string;
        role: string;
    }[];
}

export interface PostEventProps {
    _id?: string;
    kind: string;
    assignTo: string[];
    title: string;
    description: string;
    postDate: string;
    endDate: string | null;
    author: string;
    markdown?: string;
    public?: boolean;
    formQuestions?: {
        question: string;
        inputType: string;
        maxSel?: string;
        options?: string[];
    }[];
    voteQuestions?: {
        question: string;
        options: string[];
    };
}

export interface UserAccountType {
    studentID: string;
    firstName: string;
    lastName: string;
    year: number;
    imgProfile: string;
    email: string;
    password: string;
    phoneNumber: string;
    username: string;
    created_at: Date;
}

export interface formAnswer {
    _id?: string;
    postID: string;
    studentID: string;
    answerList: {
        questionIndex: number;
        answers: string[];
        inputType: string;
    }[];
}
