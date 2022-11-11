import Api from "./api";
import {ServicePages} from "../constants";
import ServiceResultDocument from "../types/services/api/result";
import SettingDocument, {
    SettingGetParamDocument,
    SettingGeneralUpdateParamDocument,
    SettingSeoUpdateParamDocument,
    SettingContactFormUpdateParamDocument,
    SettingStaticLanguageUpdateParamDocument,
} from "../types/services/setting";

export default {
    get(params: SettingGetParamDocument): ServiceResultDocument<SettingDocument[]> {
        return Api.getSync({
            url: [ServicePages.setting],
            data: params,
        });
    },
    updateGeneral(params: SettingGeneralUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.setting, "general"],
            data: params,
        });
    },
    updateSeo(params: SettingSeoUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.setting, "seo"],
            data: params,
        });
    },
    updateContactForm(params: SettingContactFormUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.setting, "contactForm"],
            data: params,
        });
    },
    updateStaticLanguage(params: SettingStaticLanguageUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.setting, "staticLanguage"],
            data: params,
        });
    }
}