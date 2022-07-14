export interface PostGetParamDocument {
    postId?: number
    typeId?: number | number[]
    langId: number
    statusId?: number
    getContents?: boolean
    maxCount?: number
}