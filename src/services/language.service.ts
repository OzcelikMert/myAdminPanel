import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../modules/services/api/result";
import LanguageDocument, {LanguageGetParamDocument} from "../modules/services/language";

export default {
    get(params: LanguageGetParamDocument): ServiceResultDocument<LanguageDocument[]> {
        return Api.getSync({
            url: [ServicePages.language],
            data: params
        });
    },
}