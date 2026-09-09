import axios, { type InternalAxiosRequestConfig } from "axios";
import { accessTokenStore } from "../contexts/accessTokenStore";
import { refreshSession } from "./refreshSession";

type RetriableRequestConfig = InternalAxiosRequestConfig & {
    hasBeenRetried?: boolean;
};

export function registerAuthInterceptor(onSessionExpired: () => void) {

    const interceptorId = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const failedRequest = error.config as RetriableRequestConfig | undefined;
            const isUnauthorized = axios.isAxiosError(error) && error.response?.status === 401;
            const isAuthEndpoint = failedRequest?.url?.includes("/api/auth/") ?? false;

            if (!isUnauthorized || !failedRequest || failedRequest.hasBeenRetried || isAuthEndpoint) {
                return Promise.reject(error);
            }

            failedRequest.hasBeenRetried = true;

            try {
                const { accessToken } = await refreshSession();
                failedRequest.headers.Authorization = `Bearer ${accessToken}`;
                // send the failed request again
                return await axios(failedRequest);
            } catch (refreshError) {
                const sessionRejected =
                    axios.isAxiosError(refreshError) && refreshError.response?.status === 401;
            
                if (sessionRejected) {
                    accessTokenStore.remove();
                    onSessionExpired();
                }
            
                return Promise.reject(error);
            }
        }
    );

    return () => axios.interceptors.response.eject(interceptorId);
}


