export interface PostPostParamDocument {
    typeId: number
    statusId: number
    order: number
    isFixed: 1 | 0
    dateStart: string
    langId: number
    image: string,
    title: string
    shortContent: string
    content: string
    url: string
    seoTitle: string
    seoContent: string
    termId: number[]
}