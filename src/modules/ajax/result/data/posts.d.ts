export interface PostDocument {
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