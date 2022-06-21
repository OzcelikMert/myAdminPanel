interface ApiRequestParamDocument {
    url: string,
    method: ApiRequestParamMethodDocument,
    data?: object,
    async?: boolean,
    resolve?: any,
    processData?: boolean,
    contentType?: string | false
}

type ApiRequestParamMethodDocument = "GET" | "POST" | "PUT" | "DELETE";

export {
    ApiRequestParamDocument,
    ApiRequestParamMethodDocument
}