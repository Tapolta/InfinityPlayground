import axios from "axios";

export const baseApiUrl = '127.0.0.1:8000/';
export const localStorageData = {
    "accessToken": "InfinityPlaygroundAccessToken",
    "refreshToken": "InfinityPlaygroundRefreshToken",
    "currentGame": "InfinityPlaygroundCurrentGame",
    "sectionScroll": "InfinityPlaygroundSectionScroll"
}

const api = axios.create({
    baseURL: `http://${baseApiUrl}`,
    headers: { Authorization: `Bearer ${localStorage.getItem(localStorageData.accessToken)}`, 'Content-Type': 'multipart/form-data', },
});

api.interceptors.response.use(
    response => response, 
    async (error) => {
        if (error.response && error.response.status === 401) { 
            try {
                const newAccessToken = await refreshAccessToken();
                 localStorage.setItem(`${localStorageData.accessToken}`, newAccessToken);
                error.config.headers['Authorization'] = `Bearer ${localStorage.getItem(localStorageData.accessToken)}`;
                return axios(error.config); 
            } catch (refreshError) {
                localStorage.removeItem(`${localStorageData.accessToken}`);
                localStorage.removeItem(`${localStorageData.refreshToken}`);
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem(`${localStorageData.refreshToken}`);
        const response = await axios.post(`http://${baseApiUrl}api/token/refresh/`, {
            refresh: refreshToken,
        });
        
        window.location.reload();
        return response.data.access;
    } catch (error) {
        console.error("Error saat post refresh token: ", error.response?.data || error.message);
        window.location.href = '/login'; 
        throw error; 
    }
};

export default api;