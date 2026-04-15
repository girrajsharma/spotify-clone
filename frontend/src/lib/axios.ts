import axios from "axios";

export const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
});

// Token refresh interceptor
let tokenRefreshPromise: Promise<string | null> | null = null;

export const setupAxiosInterceptors = (getToken: () => Promise<string | null>) => {
	// Request interceptor to add token
	axiosInstance.interceptors.request.use(
		async (config) => {
			try {
				const token = await getToken();
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			} catch (error) {
				console.error("Error getting token:", error);
			}
			return config;
		},
		(error) => Promise.reject(error)
	);

	// Response interceptor to handle 401
	axiosInstance.interceptors.response.use(
		(response) => response,
		async (error) => {
			if (error.response?.status === 401) {
				console.warn("Received 401 - token may have expired");
				// Don't retry, let the component handle the auth error
				return Promise.reject(error);
			}
			return Promise.reject(error);
		}
	);
};
