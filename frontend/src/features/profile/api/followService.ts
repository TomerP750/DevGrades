import axios from 'axios';
import { baseApiUrl } from '../../../shared/utils/baseApi';

class FollowService {

    async follow(followedId: string) {
        return (await axios.post(`${baseApiUrl}/follows/follow/${followedId}`)).data;
    }

    async unfollow(followedId: string) {
        return (await axios.delete(`${baseApiUrl}/follows/unfollow/${followedId}`)).data;
    }

    async getFollowers(userId: string) {
        return (await axios.get(`${baseApiUrl}/follows/followers/${userId}`)).data;
    }

    async getFollowings(userId: string) {
        return (await axios.get(`${baseApiUrl}/follows/followings/${userId}`)).data;
    }

    async isFollowing(followedId: string) {
        return (await axios.get(`${baseApiUrl}/follows/is-following/${followedId}`)).data;
    }

}

const followService = new FollowService();
export default followService;