let accessToken: string | null = null;

export const accessTokenStore = {
    get: () => accessToken,
    set: (incomingAccessToken: string) => { accessToken = incomingAccessToken; },
    remove: () => { accessToken = null; },
}