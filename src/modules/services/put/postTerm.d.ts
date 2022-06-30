export interface PostTermPutParamDocument {
    termId: number | number[]
    langId: number
    mainId?: number
    statusId?: number
    order?: number
    image?: string,
    title?: string
    url?: string
    seoTitle?: string
    seoContent?: string
    isFixed?: 1 | 0
}