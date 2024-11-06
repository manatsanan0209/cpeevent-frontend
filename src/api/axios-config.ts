import axios from 'axios';

const baseURL = `${import.meta.env.VITE_API_BASE_URL || ''}/api`;

axios.defaults.baseURL = baseURL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const axiosAPIInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosAPIInstance.interceptors.request.use(
    (request) => {
        const token = localStorage.getItem('token');

        if (token) {
            request.headers['Authorization'] = `Bearer ${token}`;
        }

        return request;
    },
    (error) => {
        console.error('Request error:', error);

        return Promise.reject(error);
    },
);

axiosAPIInstance.interceptors.response.use(
    (response) => response, // Directly return successful responses.
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
            try {
                const token = localStorage.getItem('token'); // Retrieve the stored access token.
                const refresh_token = localStorage.getItem('refresh_token'); // Retrieve the stored refresh token.
                // Make a request to your auth server to refresh the token.
                const response = await axios.post('v1/user/refresh', {
                    token,
                    refresh_token,
                });
                const { token: newToken, refresh_token: newRefreshToken } =
                    response.data;

                console.log('Token refreshed:', newToken);

                // Store the new access and refresh tokens.
                localStorage.setItem('token', newToken);
                localStorage.setItem('refresh_token', newRefreshToken);
                // Update the authorization header with the new access token.
                axiosAPIInstance.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${newToken}`;

                return axiosAPIInstance(originalRequest); // Retry the original request with the new access token.
            } catch (refreshError) {
                // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('user');
                localStorage.removeItem('access');
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error); // For all other errors, return the error as is.
    },
);

export default axios;
export { axiosAPIInstance };
