import { createContext, useContext, useMemo, useCallback, useState, useEffect } from "react";
import type { UserDto } from "../../../shared/models/UserDto";
import type { SignInRequestDto } from "../models/SignInRequestDto";
import type { SignUpRequestDto } from "../models/SignUpRequestDto";
import type { AuthResponseDto } from "../models/AuthResponseDto";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "../api/authService";
import sessionHintStore from "./sessionHint";
import { accessTokenStore } from "./accessTokenStore";
import sessionHint from "./sessionHint";
import axios from "axios";
import { refreshSession } from "../api/refreshSession";
import { messagesSocket } from "../../messages/api/messagesSocket";

const USER_QUERY_KEY = ["auth", "user"];

type AuthState = {
    user: UserDto | null;
    isLoading: boolean;
}

type AuthContextValues = AuthState & {
    signIn: (signInRequestDto: SignInRequestDto) => Promise<void>;
    signUp: (signUpRequestDto: SignUpRequestDto) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValues | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

    const queryClient = useQueryClient();

    const [hasSessionHint] = useState(sessionHintStore.exists);

    const { data: user = null, isLoading } = useQuery<UserDto | null>({
        queryKey: USER_QUERY_KEY,
        queryFn: async () => {
            try {
                const { user } = await refreshSession();
                return user;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    sessionHint.clear();
                    return null;
                }
                throw error;
            }
        },
        enabled: hasSessionHint,
        retry: false,
        staleTime: Infinity,
    });

    
    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (!user) {
            messagesSocket.disconnect();
            return;
        }
        messagesSocket.connect();

        return () => {
            messagesSocket.disconnect();
        };
    }, [user, isLoading]);

    const applyAuthResponse = useCallback(({ accessToken, user }: AuthResponseDto) => {
        accessTokenStore.set(accessToken);
        sessionHintStore.set();
        queryClient.setQueryData(USER_QUERY_KEY, user);
    }, [queryClient]);

    const signIn = useCallback(async (dto: SignInRequestDto) => {
        const { accessToken, user } = await authService.login(dto);
        applyAuthResponse({ accessToken, user });
    }, [applyAuthResponse]);

    const signUp = useCallback(async (dto: SignUpRequestDto) => {
        const { accessToken, user } = await authService.signUp(dto);
        applyAuthResponse({ accessToken, user });
    }, [applyAuthResponse]);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error(error);
        } finally {
            accessTokenStore.remove();
            sessionHintStore.clear();
            queryClient.clear();
        }
    }, [queryClient]);

    const ctx = useMemo<AuthContextValues>(
        () => ({ user, isLoading, signIn, signUp, logout }),
        [user, isLoading, signIn, signUp, logout],
    );

    return (
        <AuthContext.Provider value={ctx}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}