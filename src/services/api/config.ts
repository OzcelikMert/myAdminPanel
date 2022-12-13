import {ApiRequestConfigDocument} from "types/services/api/config";
import pathUtil from "utils/path.util";

let ApiRequestConfig: ApiRequestConfigDocument = {
    mainUrl: pathUtil.api
}

export default ApiRequestConfig;