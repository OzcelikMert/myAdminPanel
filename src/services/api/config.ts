import {ApiRequestConfigDocument} from "../../modules/services/api/config";
import pathUtil from "../../utils/path.util";

let ApiRequestConfig: ApiRequestConfigDocument = {
    mainUrl: `${pathUtil.api}ajax/`
}

export default ApiRequestConfig;