/*
Descrives the scripts numeric result
*/
export enum RefreshTokenRotationResult {
    Invalid = 0,
    Rotated = 1,
    ReuseDetected = 2,
}

/*
Describes an active token value
*/
export interface StoredRefreshToken {
    userId: string;
    familyId: string;
}

/*
Describes the refresh token family
*/
export interface RefreshTokenFamily {
    userId: string;
    currentTokenHash: string;
    expiresAt: number;
}

/*
Describes the result of a refresh token rotation
*/
export interface RotatedRefreshToken {
    refreshToken: string;
    userId: string;
}

export interface RefreshTokenRotation {
    result: RefreshTokenRotationResult;
    userId?: string;
}