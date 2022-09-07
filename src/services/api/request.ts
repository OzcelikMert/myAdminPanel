import $ from "jquery";
import {ErrorCodes, Timeouts} from "../../library/api";
import {ApiRequestParamDocument} from "../../types/services/api";
import ApiRequestConfig from "./config";
import ServiceResultDocument from "../../types/services/api/result";

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

    private request(resolve?: (value: any) => void) {
        let self = this;
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
            beforeSend: function () {},
            complete: function () {
                if(resolve) resolve(self.result)
            },
            success: (resData) => {
                this.result = resData;
            },
            error: (xhr, ets) => {
                this.result = xhr.responseJSON;
                isRequestFailed = true;
            }
        });
    }

    init() : Promise<ServiceResultDocument<any>> {
        return new Promise( resolve => {
            this.request(resolve);
        })
    }

    initSync(): ServiceResultDocument<any> {
       this.request();
       return this.result;
    }
}

export default ApiRequest;