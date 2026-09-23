
import { baseApiUrl } from "../utils/baseApi";
import axios from "axios";

class UserService {

    async searchUsers(query: string) {
        const response = await axios.get(`${baseApiUrl}/users/search?query=${query}`);
        return response.data;
    }
}

const userService = new UserService();
export default userService;