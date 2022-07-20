import $ from "jquery";
import {ErrorCodes, Timeouts} from "../../public/ajax";
import {ApiRequestParamDocument} from "../../modules/services/api";
import ApiRequestConfig from "./config";
import ServiceResultDocument from "../../modules/services/api/result";

class ApiRequest {
    constructor(params: ApiRequestParamDocument) {
        this.params = params;
        this.result = {
            data: [],
            customData: null,
            status: true,
            message: "",
            errorCode: ErrorCodes.success,
            statusCode: 200,
            source: ""
        };
    }

    private params: ApiRequestParamDocument;
    private result: ServiceResultDocument<any>;

    private getApiUrl(): string {
        let apiUrl = ApiRequestConfig.mainUrl;
        this.params.url.forEach(url => {
            if(url) {
                apiUrl += url + "/";
            }
        })
        return apiUrl.removeLastChar();
    }

    init() : Promise<ServiceResultDocument<any>> {
        let self = this;
        return new Promise( resolve => {
            let isRequestFailed = false;
            $.ajax({
                url: this.getApiUrl(),
                data: this.params.data,
                method: this.params.method,
                async: this.params.async,
                contentType: this.params.contentType,
                processData: this.params.processData,
                timeout: Timeouts.verySlow,
                xhrFields: {
                    withCredentials: true,
                },
                xhr(): XMLHttpRequest {
                    let xhr = new XMLHttpRequest();

                    xhr.upload.onprogress = function(e) {
                        if (e.lengthComputable) {
                            let percentComplete = e.loaded / e.total;
                            percentComplete = Number.parseInt((percentComplete * 100).toString());
                            if (typeof ApiRequestConfig.onUploadProgress !== "undefined") {
                                ApiRequestConfig.onUploadProgress(this, e, percentComplete);
                            }
                        }
                    };

                    return xhr;
                },
                beforeSend: function () {
                    //if (typeof ApiRequestConfig.beforeSend !== "undefined") ApiRequestConfig.beforeSend(ApiRequestConfig.mainUrl + url, method);
                },
                complete: function () {
                    //if (typeof ApiRequestConfig.complete !== "undefined") ApiRequestConfig.complete(ApiRequestConfig.mainUrl + url, method, result, isRequestFailed);
                    resolve(self.result)
                },
                success: (resData) => {
                    this.result = resData;
                },
                error: (xhr, ets) => {
                    this.result.status = false;
                    this.result.errorCode = ErrorCodes.notFound;
                    this.result.message = ets;
                    this.result.customData = xhr;
                    isRequestFailed = true;
                }
            });
        })
    }
}

export default ApiRequest;