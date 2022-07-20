export default interface NavigateDocument {
    navigateId: number,
    navigateMainId: number,
    navigateOrder: number,
    navigateStatusId: number,
    // Content
    navigateContentId?: number,
    navigateContentNavigateId?: number,
    navigateContentLangId?: number,
    navigateContentTitle?: string,
    navigateContentUrl?: string,
}

export interface NavigateGetParamDocument {
    navigateId?: number
    langId: number
    getContents?: boolean
    statusId?: number
    maxCount?: number
}

export interface NavigateAddParamDocument {
    langId: number
    title: string
    order: number
    mainId: number
    statusId: number
    url: string
}

export interface NavigateUpdateParamDocument {
    navigateId: number,
    langId: number,
    statusId?: number,
    title?: string,
    order?: number,
    mainId?: number,
    url?: string,
}

export interface NavigateUpdateStatusParamDocument {
    navigateId: number[],
    statusId: number,
}

export interface NavigateDeleteParamDocument {
    navigateId: number[]
}