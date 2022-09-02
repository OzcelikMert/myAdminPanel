export default interface PostTermDocument {
    _id: string
    postTypeId: number,
    typeId: number,
    mainId: string
    statusId: number,
    authorId: string
    lastAuthorId: string
    order: number,
    views: number,
    isFixed: boolean,
    contents: {
        langId: string
        image: string,
        title: string,
        shortContent: string,
        url: string,
        seoTitle: string,
        seoContent: string
    }[]
}

export interface PostTermGetParamDocument {
    langId: string
    typeId: number
    postTypeId: number
    termId?: string
    statusId?: number
}

export interface PostTermAddParamDocument {
    langId: string
    typeId: number,
    postTypeId: number
    order: number
    mainId?: number
    statusId: number
    isFixed: 1 | 0
    contents: {
        title: string
        image?: string
        url?: string
        seoTitle?: string
        seoContent?: string
    }
}

export type PostTermUpdateParamDocument = {
    termId: string
} & PostTermAddParamDocument

export interface PostTermUpdateStatusParamDocument {
    termId: string[]
    typeId: number
    postTypeId: number
    statusId: number
}

export interface PostTermDeleteParamDocument {
    termId: string[]
    typeId: number
    postTypeId: number
}