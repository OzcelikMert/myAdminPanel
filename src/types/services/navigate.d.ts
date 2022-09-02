export default interface NavigateDocument {
    _id: string
    mainId: string
    statusId: number,
    authorId: string
    lastAuthorId: string
    order: number,
    contents: {
        langId: string
        title: string,
        url: string,
    }[]
}

export interface NavigateGetParamDocument {
    langId: string
    navigateId?: string
    statusId?: number
    maxCount?: number
}

export interface NavigateAddParamDocument {
    langId: string
    mainId?: string
    statusId: number
    order: number
    contents: {
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