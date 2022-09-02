export default interface PostDocument {
    _id: string
    typeId: number,
    statusId: number,
    authorId: string
    lastAuthorId: string
    dateStart: Date,
    order: number,
    views: number,
    isFixed: boolean,
    terms: string[]
    contents: {
        langId: string
        image: string,
        title: string,
        content?: string,
        shortContent: string,
        url: string,
        seoTitle: string,
        seoContent: string
    }[]
}

export interface PostGetParamDocument {
    langId: string
    postId?: string
    typeId?: number | number[]
    statusId?: number
    getContents?: boolean
    maxCount?: number
}

export interface PostAddParamDocument {
    langId: string
    typeId: number
    statusId: number
    order: number
    isFixed: 1 | 0
    dateStart: string
    termId: string[]
    contents: {
        title: string
        image?: string,
        shortContent?: string
        content?: string
        url?: string
        seoTitle?: string
        seoContent?: string
    }
}

export type PostUpdateParamDocument = {
    postId: string
} & PostAddParamDocument

export interface PostUpdateStatusParamDocument {
    postId: string[],
    typeId: number
    statusId: number,
}

export interface PostDeleteParamDocument {
    postId: string[],
    typeId: number
}