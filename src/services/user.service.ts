import Api from "./api";
import {ServicePages} from "../constants";
import ServiceResultDocument from "../types/services/api/result";
import UserDocument, {
    UserDeleteParamDocument,
    UserAddParamDocument,
    UserUpdateParamDocument,
    UsersGetParamDocument
} from "../types/services/user";

export default {
    get(params: UsersGetParamDocument): ServiceResultDocument<UserDocument[]> {
        return Api.getSync({
            url: [ServicePages.user, params.userId?.toString()],
            data: params,
        });
    },
    add(params: UserAddParamDocument) {
        return Api.post({
            url: [ServicePages.user],
            data: params,
        });
    },
    update(params: UserUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.user, params.userId.toString()],
            data: params,
        });
    },
    delete(params: UserDeleteParamDocument) {
        return Api.delete({
            url: [ServicePages.user, params.userId.toString()],
            data: params,
        });
    },
}