import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../modules/services/api/result";
import PostTermDocument, {
    PostTermDeleteParamDocument,
    PostTermGetParamDocument,
    PostTermAddParamDocument,
    PostTermUpdateStatusParamDocument, PostTermUpdateParamDocument
} from "../modules/services/postTerm";

export default {
    get(params: PostTermGetParamDocument): ServiceResultDocument<PostTermDocument[]> {
        return Api.getSync({
            url: [ServicePages.postTerm, params.postTypeId.toString(), params.typeId.toString(), params.termId?.toString()],
            data: params
        });
    },
    add(params: PostTermAddParamDocument) {
        return Api.post({
            url: [ServicePages.postTerm, params.postTypeId.toString(), params.typeId.toString()],
            data: params
        });
    },
    update(params: PostTermUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.postTerm, params.postTypeId.toString(), params.typeId.toString(), params.termId.toString()],
            data: params
        });
    },
    updateStatus(params: PostTermUpdateStatusParamDocument) {
        return Api.put({
            url: [ServicePages.postTerm, params.postTypeId.toString(), params.typeId.toString()],
            data: params
        });
    },
    delete(params: PostTermDeleteParamDocument) {
        return Api.delete({
            url: [ServicePages.postTerm, params.postTypeId.toString(), params.typeId.toString()],
            data: params
        });
    },
}