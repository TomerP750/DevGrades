import axios from "axios";
import { baseApiUrl } from "../../../shared/utils/baseApi";

class ProfileService {

    async getProfile(id: string) {
        return (await axios.get(`${baseApiUrl}/api/profile/${id}`)).data;
    }
}

const profileService = new ProfileService();
export default profileService;