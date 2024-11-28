import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EventData {
    _id?: string;
    eventName: string;
    eventDescription: string;
    eventCategory: string;
    eventStartDate: string;
    eventEndDate: string;
    isParticipantsEnabled: boolean;
    nParticipants?: number;
    isStaffsEnabled: boolean;
    nStaff?: number;
    roles: string[];
    coordinator: string;
}

interface EventDataFromAPI {
    _id: string;
    eventName: string;
    eventDescription: string;
    kind: string;
    startDate: string;
    endDate: string;
    nParticipant?: number;
    nStaff?: number;
    role: string[];
    president: string;
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

export const EventProvider: React.FC<{
    children: ReactNode;
    content?: EventDataFromAPI;
}> = ({ children, content }) => {
    const [eventData, setEventData] = useState<EventData>(
        content
            ? {
                  _id: content._id,
                  eventName: content.eventName,
                  eventDescription: content.eventDescription,
                  eventCategory: content.kind,
                  eventStartDate: content.startDate.split('T')[0],
                  eventEndDate: content.endDate.split('T')[0],
                  isParticipantsEnabled: Boolean(content.nParticipant),
                  nParticipants: content.nParticipant,
                  isStaffsEnabled: Boolean(content.nStaff),
                  nStaff: content.nStaff,
                  roles: content.role || [],
                  coordinator: content.president,
              }
            : {
                  eventName: '',
                  eventDescription: '',
                  eventCategory: '',
                  eventStartDate: new Date().toISOString().split('T')[0],
                  eventEndDate: new Date().toISOString().split('T')[0],
                  isParticipantsEnabled: false,
                  nParticipants: 0,
                  isStaffsEnabled: true,
                  nStaff: 0,
                  roles: [],
                  coordinator: '',
              },
    );

    const [currentStep, setCurrentStep] = useState(0);

    console.log('eventData', content);

    return (
        <EventContext.Provider
            value={{ eventData, setEventData, currentStep, setCurrentStep }}
        >
            {children}
        </EventContext.Provider>
    );
};
