export interface SettingSeoContentDocument {
    langId: string
    title?: string,
    content?: string,
    tags?: string[]
}


export interface SettingContactFormDocument {
    _id?: string
    name: string
    key: string
    email: string
    password: string
    outGoingServer: string
    inComingServer: string
    port: number
}

export interface SettingContactDocument {
    email?: string,
    phone?: string,
    address?: string,
    addressMap?: string
    facebook?: string,
    instagram?: string,
    twitter?: string,
    linkedin?: string,
    google?: string,
}

export default interface SettingDocument {
    _id: string
    defaultLangId: string
    icon?: string,
    logo?: string,
    logoTwo?: string
    head?: string,
    script?: string
    seoContents?: SettingSeoContentDocument,
    contact?: SettingContactDocument
    contactForms?: SettingContactFormDocument[]
}

export interface SettingGetParamDocument {
    langId?: string
}

export type SettingUpdateParamDocument =  {
    defaultLangId?: string
} & Omit<SettingDocument, "_id"|"defaultLangId">