export default interface SettingsDocument {
    _id: string
    defaultLangId: string
    icon: string,
    logo: string,
    seoContents: {
        langId: string
        title: string,
        content: string,
        tags: string[]
    }[]
}

export interface SettingGetParamDocument {
    langId?: string
}

export interface SettingUpdateParamDocument {
    defaultLangId?: string,
    icon?: string,
    logo?: string,
    seoContents?: {
        langId: string,
        title: string,
        content?: string,
        tags?: string[]
    }
}