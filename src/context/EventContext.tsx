import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EventData {
    eventName: string;
    eventDescription: string;
    eventCategory: string;
    eventStartDate: string;
    eventEndDate: string;
    isParticipantsEnabled: boolean;
    nParticipants?: number;
    isStaffsEnabled: boolean;
    nStaff?: number;
    roles: { key: string; label: string }[];
    coordinator: string;
}

interface EventContextProps {
    eventData: EventData;
    setEventData: React.Dispatch<React.SetStateAction<EventData>>;
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const useEventContext = () => {
    const context = useContext(EventContext);

    if (!context) {
        throw new Error('useEventContext must be used within an EventProvider');
    }

    return context;
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [eventData, setEventData] = useState<EventData>({
        eventName: '',
        eventDescription: '',
        eventCategory: '',
        eventStartDate: new Date().toISOString().split('T')[0],
        eventEndDate: new Date().toISOString().split('T')[0],
        nParticipants: 0,
        isParticipantsEnabled: false,
        nStaff: 0,
        isStaffsEnabled: true,
        roles: [],
        coordinator: '',
    });
    const [currentStep, setCurrentStep] = useState(0);

    return (
        <EventContext.Provider
            value={{ eventData, setEventData, currentStep, setCurrentStep }}
        >
            {children}
        </EventContext.Provider>
    );
};
