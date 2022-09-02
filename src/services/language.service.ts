import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../types/services/api/result";
import LanguageDocument, {LanguageGetParamDocument} from "../types/services/language";

export default {
    get(params: LanguageGetParamDocument): ServiceResultDocument<LanguageDocument[]> {
        return Api.getSync({
            url: [ServicePages.language],
            data: params
        });
    },
}