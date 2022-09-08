import {PopulateAuthorIdDocument} from "./user";

export default interface NavigateDocument {
    _id: string
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
    contents?: {
        langId: string
        title: string,
        url: string,
    }
}

export interface NavigateGetParamDocument {
    langId: string
    navigateId?: string
    statusId?: number
    maxCount?: number
}

export interface NavigateAddParamDocument {
    mainId?: string
    statusId: number
    order: number
    contents: {
        langId: string
        title: string,
        url?: string
    }
}

export type NavigateUpdateParamDocument = {
    navigateId: string,
} & NavigateAddParamDocument

export interface NavigateUpdateStatusParamDocument {
    navigateId: string[],
    statusId: number,
}

export interface NavigateDeleteParamDocument {
    navigateId: string[]
}