import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../types/services/api/result";
import SeoDocument, {SeoGetParamDocument, SeoUpdateParamDocument} from "../types/services/seo";

export default {
    get(params: SeoGetParamDocument): ServiceResultDocument<SeoDocument[]> {
        return Api.getSync({
            url: [ServicePages.seo],
            data: params,
        });
    },
    update(params: SeoUpdateParamDocument) {
        return Api.put({
            url: [ServicePages.seo],
            data: params,
        });
    }
}