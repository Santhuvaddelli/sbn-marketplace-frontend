import axios from 'axios';

const api = axios.create({
    baseURL: 'http://51.21.190.186:80',
});

//Attach AccessToken to every request after login
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

//Handle Expire Token Automatically
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const res = await api.post(`${api.baseURL}/api/refresh`, { refreshToken });
            const newAccessToken = res.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
        }
        catch (error) {
            localStorage.clear();
            window.location.href = "/login";
        }
    }
    return Promise.reject(error);
})
export default api;
