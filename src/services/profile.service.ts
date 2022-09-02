import Api from "./api";
import {ServicePages} from "../public/ajax";
import {ProfileChangePasswordParamDocument, ProfileUpdateParamDocument} from "../types/services/profile";

export default {
    update(params: ProfileUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.profile],
            data: params,
        });
    },
    changePassword(params: ProfileChangePasswordParamDocument) {
        return Api.put({
            url: [ServicePages.profile, "changePassword"],
            data: params,
        });
    },
}