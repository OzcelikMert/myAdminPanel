import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../modules/services/api/result";
import ServerInfoDocument from "../modules/services/serverInfo";

export default {
    get(): ServiceResultDocument<ServerInfoDocument[]> {
        return Api.get({
            url: [ServicePages.serverInfo]
        });
    },
}