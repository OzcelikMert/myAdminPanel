import Api from "./api";
import {ServicePages} from "../constants";
import ServiceResultDocument from "../types/services/api/result";
import ServerInfoDocument from "../types/services/serverInfo";

export default {
    get(): ServiceResultDocument<ServerInfoDocument> {
        return Api.getSync({
            url: [ServicePages.serverInfo]
        });
    },
}