import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../modules/services/api/result";
import SettingsDocument, {
    SettingGetParamDocument,
    SettingUpdateParamDocument
} from "../modules/services/setting";

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