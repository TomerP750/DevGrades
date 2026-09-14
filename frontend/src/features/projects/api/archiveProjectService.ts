import axios from "axios";
import { baseApiUrl } from "../../../shared/utils/baseApi";


class ArchiveProjectService {

    async toggleArchive(projectId: string) {
        return (await axios.post(`${baseApiUrl}/api/archived-projects/toggle/${projectId}`)).data;
    }

    async isArchived(projectId: string) {
        return (await axios.get(`${baseApiUrl}/api/archived-projects/is-archived/${projectId}`)).data;
    }
}

const archiveProjectService = new ArchiveProjectService();
export default archiveProjectService;