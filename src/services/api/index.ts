import {ApiRequestParamDocument} from "../../modules/services/api";
import ServiceResultDocument from "../../modules/services/api/result";
import ApiRequest from "./request";

const Api = {
    getSync(params: ApiRequestParamDocument): ServiceResultDocument<any> {
        return new ApiRequest({
            ...params,
            method: "GET",
            async: false
        }).initSync();
    },
    get(params: ApiRequestParamDocument): Promise<ServiceResultDocument<any>> {
        return new Promise(resolve => {
            new ApiRequest({
                ...params,
                method: "GET",
                async: true,
            }).init().then(resData => {
                resolve(resData)
            })
        });
    },
    post(params: ApiRequestParamDocument): Promise<ServiceResultDocument<any>> {
        return new Promise(resolve => {
            new ApiRequest({
                ...params,
                method: "POST",
                async: true,
            }).init().then(resData => {
                resolve(resData)
            })
        });
    },
    put(params: ApiRequestParamDocument): Promise<ServiceResultDocument<any>> {
        return new Promise(resolve => {
            new ApiRequest({
                ...params,
                method: "PUT",
                async: true,
            }).init().then(resData => {
                resolve(resData)
            })
        })
    },
    delete(params: ApiRequestParamDocument): Promise<ServiceResultDocument<any>> {
        return new Promise(resolve => {
            new ApiRequest({
                ...params,
                method: "DELETE",
                async: true,
            }).init().then(resData => {
                resolve(resData)
            })
        });
    }
}

export default Api;