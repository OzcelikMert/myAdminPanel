import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../modules/services/api/result";
import PostDocument, {
    PostDeleteParamDocument,
    PostGetParamDocument,
    PostAddParamDocument,
    PostUpdateParamDocument, PostUpdateStatusParamDocument
} from "../modules/services/post";

export default {
    get(params: PostGetParamDocument): ServiceResultDocument<PostDocument[]> {
        let url = Array.isArray(params.typeId) ? [] : [params.typeId?.toString(), params.postId?.toString()]
        return Api.getSync({
            url: [ServicePages.post, ...url],
            data: params
        });
    },
    add(params: PostAddParamDocument) {
        return Api.post({
            url: [ServicePages.post, params.typeId.toString()],
            data: params
        });
    },
    update(params: PostUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.post, params.typeId.toString(), params.postId.toString()],
            data: params
        });
    },
    updateStatus(params: PostUpdateStatusParamDocument) {
        return Api.put({
            url: [ServicePages.post, params.typeId.toString()],
            data: params
        });
    },
    delete(params: PostDeleteParamDocument) {
        return Api.delete({
            url: [ServicePages.post, params.typeId.toString()],
            data: params
        });
    },
}