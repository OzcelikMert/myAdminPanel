export default interface SeoDocument {
    seoContentId: number,
    seoContentLangId: number,
    seoContentTitle: string,
    seoContent: string,
    seoContentTags: string[]
}

export interface SeoGetParamDocument {
    langId: number
}

export interface SeoUpdateParamDocument {
    langId: number
    title: string
    content: string
    tags: string[]
    separatorId: number
}