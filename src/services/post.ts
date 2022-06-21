import Api from "./api";
import {ServicePages} from "../public/ajax";
import {PostTermPostParamDocument} from "../modules/services/post/postTerm";
import {PostPostParamDocument} from "../modules/services/post/post";
import {UserPostParamDocument} from "../modules/services/post/user";
import {SeoPostParamDocument} from "../modules/services/post/seo";

const Post = {
    postTerm(params: PostTermPostParamDocument) {
        return Api.post(ServicePages.postTerm, params);
    },
    post(params: PostPostParamDocument) {
        return Api.post(ServicePages.post, params);
    },
    user(params: UserPostParamDocument) {
        return Api.post(ServicePages.user, params);
    },
    gallery(params: FormData) {
        return Api.post(ServicePages.gallery, params, false, false);
    },
    seo(params: SeoPostParamDocument) {
        return Api.post(ServicePages.seo, params);
    }
}

export default Post;

