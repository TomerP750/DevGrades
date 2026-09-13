import axios from "axios";
import { baseApiUrl } from "../../../shared/utils/baseApi";
import type { UpdateUserDto } from "../models/UpdateUserDto";
import type { ChangePasswordDto } from "../models/ChangePasswordDto";

class UserService {

    // empty functions 
    async updateUser(dto: UpdateUserDto) {
        return (await axios.put(`${baseApiUrl}/api/users/update`, dto)).data;
    }

    async deleteUser() {
        return (await axios.delete(`${baseApiUrl}/api/users/delete`)).data;
    }

    async changePassword(dto: ChangePasswordDto) {
        return (await axios.put(`${baseApiUrl}/api/users/change-password`, dto)).data;
    }

}

const userService = new UserService();
export default userService;