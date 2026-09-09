import { accessTokenStore } from "../contexts/accessTokenStore";
import type { AuthResponseDto } from "../models/AuthResponseDto";
import authService from "./authService";

let refreshInFlight: Promise<AuthResponseDto> | null = null;

export function refreshSession(): Promise<AuthResponseDto> {
    if (refreshInFlight) {
        return refreshInFlight;
    }

    const request: Promise<AuthResponseDto> = authService
        .refreshToken()
        .then((response) => {
            if (refreshInFlight === request) {
                accessTokenStore.set(response.accessToken);
            }
            return response;
        })
        .finally(() => {
            if (refreshInFlight === request) {
                refreshInFlight = null;
            }
        });

    refreshInFlight = request;
    return request;
}

export function discardRefreshSession() {
    refreshInFlight = null;
}