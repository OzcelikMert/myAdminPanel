import Api from "./api";
import {ServicePages} from "../constants";
import ServiceResultDocument from "../types/services/api/result";
import UserDocument from "../types/services/user";
import {AuthLoginParamDocument, AuthGetSessionParamDocument} from "../types/services/auth";

export default {
    getSession(params: AuthGetSessionParamDocument): ServiceResultDocument<UserDocument[]> {
        return Api.getSync({
            url: [ServicePages.auth],
            data: params,
        });
    },
    login(params: AuthLoginParamDocument): Promise<ServiceResultDocument<UserDocument[]>> {
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