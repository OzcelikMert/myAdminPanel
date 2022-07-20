import {ApiRequestParamDocument} from "../../modules/services/api";
import ServiceResultDocument from "../../modules/services/api/result";
import ApiRequest from "./request";

const Api = {
    get(params: ApiRequestParamDocument): ServiceResultDocument<any> {
        let result: any;
        new Promise(resolve => {
            new ApiRequest({
                ...params,
                method: "GET"
            }).init().then(resData => {
                result = resData;
                resolve(0);
            })
        })
        return result;
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