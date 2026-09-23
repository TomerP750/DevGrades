
// import { io, type Socket } from "socket.io-client";
// import { accessTokenStore } from "../../authentication/contexts/accessTokenStore";
// import { baseApiUrl } from "../../../shared/utils/baseApi";

// export const messagesSocket: Socket = io(`${baseApiUrl}/messages`, {
//   autoConnect: false,
//   withCredentials: true,
//   auth: (callback) => {
//     callback({ token: accessTokenStore.get() });
//   },
// });