import Api from "./api";
import {ServicePages} from "../constants";
import ServiceResultDocument from "../types/services/api/result";
import SettingDocument, {
    SettingGetParamDocument,
    SettingUpdateParamDocument
} from "../types/services/setting";

export default {
    get(params: SettingGetParamDocument): ServiceResultDocument<SettingDocument[]> {
        return Api.getSync({
            url: [ServicePages.setting],
            data: params,
        });
    },
    update(params: SettingUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.setting],
            data: params,
        });
    }
}