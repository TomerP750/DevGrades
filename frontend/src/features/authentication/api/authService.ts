import axios from "axios";
import { baseApiUrl } from "../../../shared/utils/baseApi";
import type { AuthResponseDto } from "../models/AuthResponseDto";
import type { SignInRequestDto } from "../models/SignInRequestDto";
import type { SignUpRequestDto } from "../models/SignUpRequestDto";


class AuthService {

    async login(signInRequestDto: SignInRequestDto): Promise<AuthResponseDto> {
        return (await axios.post(`${baseApiUrl}/api/auth/login`, signInRequestDto)).data;
        
    }

    async signUp(signUpRequestDto: SignUpRequestDto): Promise<AuthResponseDto> {
        return (await axios.post(`${baseApiUrl}/api/auth/signup`, signUpRequestDto)).data;
    }

    async logout(): Promise<void> {
        await axios.post(`${baseApiUrl}/api/auth/logout`);
    }

    async refreshToken(): Promise<AuthResponseDto> {
        return (await axios.post(`${baseApiUrl}/api/auth/refresh-token`)).data;
    }

}

const authService = new AuthService();
export default authService;