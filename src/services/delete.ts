import Api from "./api";
import {ErrorCodes, ServicePages} from "../public/ajax";
import {PostTermDeleteParamDocument} from "../modules/services/delete/postTerm";
import {PostDeleteParamDocument} from "../modules/services/delete/post";
import {UserDeleteParamDocument} from "../modules/services/delete/user";
import {GalleryDeleteParamDocument} from "../modules/services/delete/gallery";

const Delete = {
    postTerm(params: PostTermDeleteParamDocument) {
        return Api.delete(ServicePages.postTerm, params);
    },
    post(params: PostDeleteParamDocument) {
        return Api.delete(ServicePages.post, params);
    },
    user(params: UserDeleteParamDocument) {
        return Api.delete(ServicePages.user, params);
    },
    gallery(params: GalleryDeleteParamDocument) {
        return Api.delete(ServicePages.gallery, params);
    }
}

export default Delete;

