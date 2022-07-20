import Api from "./api";
import {ServicePages} from "../public/ajax";
import {ProfileChangePasswordParamDocument, ProfileUpdateParamDocument} from "../modules/services/profile";

export default {
    update(params: ProfileUpdateParamDocument) {
        return Api.post({
            url: [ServicePages.profile],
            data: params,
        });
    },
    changePassword(params: ProfileChangePasswordParamDocument) {
        return Api.post({
            url: [ServicePages.profile],
            data: params,
        });
    },
}