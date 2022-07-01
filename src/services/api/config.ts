import {ApiRequestConfigDocument} from "../../modules/services/api/config";
import {GlobalPaths} from "../../config/global";

let ApiRequestConfig: ApiRequestConfigDocument = {
    mainUrl: `${GlobalPaths.api}ajax/`
}

export default ApiRequestConfig;