import Api from "./api";
import {ErrorCodes, ServicePages} from "../public/ajax";
import {PostTermPutParamDocument} from "../modules/services/put/postTerm";
import {PostPutParamDocument} from "../modules/services/put/post";
import {UserPutParamDocument} from "../modules/services/put/user";
import {SettingPutParamDocument} from "../modules/services/put/setting";

const Put = {
    postTerm(params: PostTermPutParamDocument) {
        return Api.put(ServicePages.postTerm, params);
    },
    post(params: PostPutParamDocument) {
        return Api.put(ServicePages.post, params);
    },
    user(params: UserPutParamDocument) {
        return Api.put(ServicePages.user, params);
    },
    setting(params: SettingPutParamDocument) {
        return Api.put(ServicePages.setting, params);
    }
}

export default Put;

