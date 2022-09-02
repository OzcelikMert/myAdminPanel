export default interface LanguageDocument {
    _id: string
    title: string
    image: string
    shortKey: string
    statusId: number
}

export interface LanguageGetParamDocument {
    id?: string
}