import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../modules/services/api/result";
import {GalleryDeleteParamDocument, GalleryAddParamDocument} from "../modules/services/gallery";

export default {
    get(): ServiceResultDocument<string[]> {
        return Api.get({
            url: [ServicePages.gallery],
        });
    },
    add(params: GalleryAddParamDocument) {
        return Api.post({
            url: [ServicePages.gallery],
            data: params,
            contentType: false,
            processData: false
        });
    },
    delete(params: GalleryDeleteParamDocument) {
        return Api.delete({
            url: [ServicePages.gallery],
            data: params
        });
    },
}