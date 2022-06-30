export interface PostPutParamDocument {
    postId: number | number[]
    statusId: number
    langId: number
    order?: number
    isFixed?: 1 | 0
    dateStart?: string
    image?: string,
    title?: string
    shortContent?: string
    content?: string
    url?: string
    seoTitle?: string
    seoContent?: string
    termId?: number[]
}