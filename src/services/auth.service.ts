import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../modules/services/api/result";
import UserDocument from "../modules/services/user";
import {AuthLoginParamDocument, AuthGetSessionParamDocument} from "../modules/services/auth";

export default {
    getSession(params: AuthGetSessionParamDocument): ServiceResultDocument<UserDocument[]> {
        return Api.get({
            url: [ServicePages.auth],
            data: params,
        });
    },
    login(params: AuthLoginParamDocument) {
        return Api.post({
            url: [ServicePages.auth],
            data: params,
        });
    },
    logOut() {
        return Api.delete({
            url: [ServicePages.auth],
        });
    },
}