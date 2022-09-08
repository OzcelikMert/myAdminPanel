import {PopulateAuthorIdDocument} from "./user";

export default interface PostTermDocument {
    _id: string
    postTypeId: number,
    typeId: number,
    mainId?: {
        _id: string
        contents: {
            langId: string
            title: string,
            url: string,
        }
    }
    statusId: number,
    authorId: PopulateAuthorIdDocument
    lastAuthorId: PopulateAuthorIdDocument
    order: number,
    views: number,
    isFixed: boolean,
    contents?: {
        langId: string
        image: string,
        title: string,
        shortContent: string,
        url: string,
        seoTitle: string,
        seoContent: string
    }
}

export interface PopulateTermsDocument {
    _id: string,
    typeId: number
    contents: {
        langId: string,
        title: string,
    }
}

export interface PostTermGetParamDocument {
    langId: string
    typeId?: number
    postTypeId: number
    termId?: string
    statusId?: number
}

export interface PostTermAddParamDocument {
    typeId: number,
    postTypeId: number
    order: number
    mainId?: string
    statusId: number
    isFixed: 1 | 0
    contents: {
        langId: string
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