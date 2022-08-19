export default interface PostTermDocument {
    postTermId: number,
    postTermTypeId: number,
    postTermPostTypeId: number,
    postTermMainId: number,
    postTermOrder: number,
    postTermStatusId: number,
    postTermViews: number,
    postTermIsFixed: 1 | 0
    // Content
    postTermContentId?: number,
    postTermContentTermId?: number,
    postTermContentLangId?: number,
    postTermContentImage?: string
    postTermContentTitle?: string,
    postTermContentUrl?: string,
    postTermContentSEOTitle?: string,
    postTermContentSEO?: string
}

export interface PostTermGetParamDocument {
    typeId: number
    postTypeId: number
    termId?: number
    langId: number
    statusId?: number
    getContents?: boolean
}

export interface PostTermAddParamDocument {
    typeId: number,
    postTypeId: number
    langId: number
    title: string
    order: number
    termId: number
    mainId: number
    statusId: number
    image: string
    url: string
    seoTitle: string
    seoContent: string
    isFixed: 1 | 0
}

export interface PostTermUpdateParamDocument {
    termId: number
    postTypeId: number
    typeId: number
    langId?: number
    mainId?: number
    statusId?: number
    order?: number
    image?: string,
    title?: string
    url?: string
    seoTitle?: string
    seoContent?: string
    isFixed?: 1 | 0
}

export interface PostTermUpdateStatusParamDocument {
    termId: number[]
    typeId: number
    postTypeId: number
    statusId: number
}

export interface PostTermDeleteParamDocument {
    termId: number[]
    typeId: number
    postTypeId: number
}