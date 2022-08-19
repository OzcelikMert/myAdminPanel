import Api from "./api";
import {ServicePages} from "../public/ajax";
import ServiceResultDocument from "../modules/services/api/result";
import {
    ViewAddParamDocument,
    ViewNumberDocument,
    ViewStatisticsDocument
} from "../modules/services/view";

export default {
    getNumber(): Promise<ServiceResultDocument<ViewNumberDocument>> {
        return Api.get({
            url: [ServicePages.view, "number"]
        });
    },
    getStatistics(): ServiceResultDocument<ViewStatisticsDocument> {
        return Api.getSync({
            url: [ServicePages.view, "statistics"]
        });
    },
    add(params: ViewAddParamDocument) {
        return Api.getSync({
            url: [ServicePages.view],
            data: params,
        });
    }
}