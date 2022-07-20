export default interface PostDocument {
    postId: number,
    postTypeId: number,
    postAuthorId: number,
    postStatusId: number,
    postDateCreate: string,
    postDateStart: string,
    postOrder: number,
    postViews: number,
    postIsFixed: boolean,
    // Content
    postContentId?: number,
    postContentTags?: string,
    postContentPostId?: number,
    postContentLangId?: number,
    postContentImage?: string,
    postContentTitle?: string,
    postContent?: string,
    postContentShort?: string,
    postContentUrl?: string,
    postContentSEOTitle?: string,
    postContentSEO?: string
    postTermContents: {
        postTermId: number,
        postTermTypeId: number,
        postTermContentTitle?: string,
        postTermContentUrl?: string
    }[]
}

export interface PostGetParamDocument {
    postId?: number
    typeId?: number | number[]
    langId: number
    statusId?: number
    getContents?: boolean
    maxCount?: number
}

export interface PostAddParamDocument {
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

export interface PostUpdateParamDocument {
    postId: number
    typeId: number
    statusId?: number
    langId?: number
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

export interface PostUpdateStatusParamDocument {
    postId: number[],
    typeId: number
    statusId: number,
}

export interface PostDeleteParamDocument {
    postId: number[],
    typeId: number
}