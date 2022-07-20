export default interface LanguageDocument {
    langId: number,
    langImage: string
    langShortKey: string,
    langTitle: string
}

export interface LanguageGetParamDocument {
    id?: number
}