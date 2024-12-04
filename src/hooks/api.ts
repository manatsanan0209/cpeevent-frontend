import { axiosAPIInstance } from '../api/axios-config';

export const fetchEvents = async () => {
    const response = await axiosAPIInstance.get('v1/events');

    return response.data.data;
};
