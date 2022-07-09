import Api from "./api";
import {ServicePages} from "../public/ajax";
import {UsersGetParamDocument} from "../modules/services/get/user";
import {PostTermGetParamDocument} from "../modules/services/get/postTerm";
import {PostGetParamDocument} from "../modules/services/get/post";
import {
    LanguageDocument, NavigateDocument,
    PostDocument,
    PostTermDocument,
    SeoDocument,
    SettingsDocument,
    UserDocument
} from "../modules/ajax/result/data";
import {ResultDocument} from "../modules/ajax/result";
import {GalleryDocument} from "../modules/ajax/result/data/gallery";
import {SeoGetParamDocument} from "../modules/services/get/seo";
import {SettingGetParamDocument} from "../modules/services/get/setting";
import {LanguageGetParamDocument} from "../modules/services/get/language";
import {NavigateGetParamDocument} from "../modules/services/get/navigate";

const Get = {
    users(params: UsersGetParamDocument): ResultDocument<UserDocument[]> {
        return Api.get(ServicePages.user, params);
    },
    postTerms(params: PostTermGetParamDocument): ResultDocument<PostTermDocument[]> {
        return Api.get(ServicePages.postTerm, params);
    },
    posts(params: PostGetParamDocument): ResultDocument<PostDocument[]> {
        return Api.get(ServicePages.post, params);
    },
    gallery(): ResultDocument<GalleryDocument> {
        return Api.get(ServicePages.gallery);
    },
    seo(params: SeoGetParamDocument): ResultDocument<SeoDocument[]> {
        return Api.get(ServicePages.seo, params);
    },
    settings(params: SettingGetParamDocument): ResultDocument<SettingsDocument[]> {
        return Api.get(ServicePages.setting, params);
    },
    languages(params: LanguageGetParamDocument): ResultDocument<LanguageDocument[]> {
        return Api.get(ServicePages.language, params);
    },
    navigate(params: NavigateGetParamDocument): ResultDocument<NavigateDocument[]> {
        return Api.get(ServicePages.navigate, params);
    }
}

export default Get;

