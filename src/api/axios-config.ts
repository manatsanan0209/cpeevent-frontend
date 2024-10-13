import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
