interface ApiRequestParamDocument {
    url: (string | undefined)[],
    method?: ApiRequestParamMethodDocument,
    async?: boolean,
    data?: object,
    processData?: boolean,
    contentType?: string | false
}

type ApiRequestParamMethodDocument = "GET" | "POST" | "PUT" | "DELETE";

export {
    ApiRequestParamDocument,
    ApiRequestParamMethodDocument
}