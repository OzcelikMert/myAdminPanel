import {PopulateAuthorIdDocument} from "./user";
import {PostTermTypeId, PostTypeId, StatusId} from "../../constants";

export default interface PostTermDocument {
    _id: string
    postTypeId: PostTypeId,
    typeId: PostTermTypeId,
    mainId?: {
        _id: string
        contents: {
            langId: string
            title: string,
            url: string,
        }
    }
    statusId: StatusId,
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
    typeId: PostTermTypeId
    contents: {
        langId: string,
        title: string,
    }
}

export interface PostTermGetParamDocument {
    langId: string
    typeId?: PostTermTypeId
    postTypeId: PostTypeId
    termId?: string
    statusId?: StatusId
}

export interface PostTermAddParamDocument {
    typeId: PostTermTypeId,
    postTypeId: PostTypeId
    order: number
    mainId?: string
    statusId: StatusId
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
    typeId: PostTermTypeId
    postTypeId: PostTypeId
    statusId: StatusId
}

export interface PostTermDeleteParamDocument {
    termId: string[]
    typeId: PostTermTypeId
    postTypeId: PostTypeId
}