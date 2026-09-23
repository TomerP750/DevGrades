import { baseApiUrl } from "../../../shared/utils/baseApi";
import axios from "axios";

class ConversationService {

  async findOneByUserIdAndRecipientId(recipientId: string) {
    return (await axios.get(`${baseApiUrl}/conversations/${recipientId}`)).data;
  }

  async findById(conversationId: string) {
    return (await axios.get(`${baseApiUrl}/conversations/${conversationId}`)).data;
  }

  async findAllByForCurrentUser() {
    return (await axios.get(`${baseApiUrl}/conversations/user`)).data;
  }

}

const conversationService = new ConversationService();
export default conversationService;