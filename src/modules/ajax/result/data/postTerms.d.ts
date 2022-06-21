export interface PostTermDocument {
    postTermId: number,
    postTermTypeId: number,
    postTermPostTypeId: number,
    postTermMainId: number,
    postTermOrder: number,
    postTermStatusId: number,
    postTermViews: number,
    postTermIsFixed: boolean
    // Content
    postTermContentId: number,
    postTermContentTermId: number,
    postTermContentLangId: number,
    postTermContentTitle: string,
    postTermContentUrl: string,
    postTermContentSEOTitle: string,
    postTermContentSEO: string
}