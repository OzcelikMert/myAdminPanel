import Api from "./api";
import {ServicePages} from "constants/index";
import ServiceResultDocument from "types/services/api/result";
import ServerInfoDocument from "types/services/serverInfo";

export default {
    get(): ServiceResultDocument<ServerInfoDocument> {
        return Api.getSync({
            url: [ServicePages.serverInfo]
        });
    },
}