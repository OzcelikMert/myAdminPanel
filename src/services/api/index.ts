import $ from "jquery";
import {ErrorCodes, Timeouts} from "../../public/ajax";
import {ApiRequestParamDocument} from "../../modules/services/api";
import ApiRequestConfig from "./config";
import {ResultDocument} from "../../modules/ajax/result";

const request = ({
                     url = "",
                     method = "GET",
                     data = {},
                     async = false,
                     resolve = null,
                     processData = true,
                     contentType = "application/x-www-form-urlencoded; charset=UTF-8"
}: ApiRequestParamDocument) => {
    let result: ResultDocument<any> = {
        data: [],
        customData: null,
        status: true,
        message: "",
        errorCode: ErrorCodes.success,
        statusCode: 200,
        source: ""
    }

    let isRequestFailed = false;
    $.ajax({
        url: ApiRequestConfig.mainUrl + url,
        data: data,
        method: method,
        async: async,
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
        xhrFields: {
            withCredentials: true,
        },
        contentType: contentType,
        processData: processData,
        timeout: Timeouts.verySlow,
        beforeSend: function () {
            if (typeof ApiRequestConfig.beforeSend !== "undefined") ApiRequestConfig.beforeSend(ApiRequestConfig.mainUrl + url, method);
        },
        complete: function () {
            if (typeof ApiRequestConfig.complete !== "undefined") ApiRequestConfig.complete(ApiRequestConfig.mainUrl + url, method, result, isRequestFailed);
            if (resolve !== null) resolve(result);
        },
        success: (resData) => {
            result = resData;
        },
        error: (xhr, ets) => {
            result.status = false;
            result.errorCode = ErrorCodes.notFound;
            result.message = ets;
            result.customData = xhr;
            isRequestFailed = true;
        }
    }).progress((t, u, v, r) => {
        console.log(t, u, v, r)
    });
    return result;
}

const Api = {
    get(url: string, data?: object) {
        return request({
            url: url,
            method: "GET",
            data: data
        });
    },
    post(url: string, data?: object, processData?: ApiRequestParamDocument["processData"], contentType?: ApiRequestParamDocument["contentType"]): Promise<ResultDocument<any>> {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                method: "POST",
                data: data,
                async: true,
                resolve: resolve,
                processData: processData,
                contentType: contentType
            })
        });
    },
    put(url: string, data?: object): Promise<ResultDocument<any>> {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                method: "PUT",
                data: data,
                async: true,
                resolve: resolve
            })
        })
    },
    delete(url: string, data?: object): Promise<ResultDocument<any>> {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                method: "DELETE",
                data: data,
                async: true,
                resolve: resolve
            })
        });
    }
}

export default Api;