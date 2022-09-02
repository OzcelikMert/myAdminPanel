import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../types/services/api/result";
import NavigateDocument, {
    NavigateDeleteParamDocument,
    NavigateGetParamDocument,
    NavigateAddParamDocument,
    NavigateUpdateStatusParamDocument, NavigateUpdateParamDocument
} from "../types/services/navigate";

export default {
    get(params: NavigateGetParamDocument): ServiceResultDocument<NavigateDocument[]> {
        return Api.getSync({
            url: [ServicePages.navigate, params.navigateId?.toString()],
            data: params
        });
    },
    add(params: NavigateAddParamDocument) {
        return Api.post({
            url: [ServicePages.navigate],
            data: params
        });
    },
    update(params: NavigateUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.navigate, params.navigateId.toString()],
            data: params
        });
    },
    updateStatus(params: NavigateUpdateStatusParamDocument) {
        return Api.put({
            url: [ServicePages.navigate],
            data: params
        });
    },
    delete(params: NavigateDeleteParamDocument) {
        return Api.delete({
            url: [ServicePages.navigate],
            data: params
        });
    },
}