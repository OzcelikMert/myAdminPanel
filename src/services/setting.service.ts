import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../types/services/api/result";
import SettingsDocument, {
    SettingGetParamDocument,
    SettingUpdateParamDocument
} from "../types/services/setting";

export default {
    get(params: SettingGetParamDocument): ServiceResultDocument<SettingsDocument[]> {
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