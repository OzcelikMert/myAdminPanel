import {PopulateTermsDocument} from "./postTerm";
import {PopulateAuthorIdDocument} from "./user";
import LanguageKeys from "../app/languages";
import {ThemeGroupTypeId} from "../../constants/themeGroupTypes";
import {PostTypeId, StatusId} from "../../constants";

export interface PostThemeGroupTypeContentDocument {
    langId: string
    content: string
    url?: string
}

export interface PostThemeGroupTypeDocument {
    _id: string
    elementId: string
    typeId: ThemeGroupTypeId,
    langKey: LanguageKeys,
    order: number
    contents: PostThemeGroupTypeContentDocument
}

export interface PostThemeGroupDocument {
    _id: string
    elementId: string
    langKey: LanguageKeys,
    order: number
    types: PostThemeGroupTypeDocument[]
}

export interface PostContentDocument {
    langId: string
    image?: string,
    title: string,
    content?: string,
    shortContent?: string,
    url?: string,
    seoTitle?: string,
    seoContent?: string
}

export default interface PostDocument {
    _id: string
    typeId: PostTypeId,
    mainId?: {
        _id: string
        contents: {
            langId: string
            title: string,
            url: string,
        }
    },
    statusId: StatusId,
    authorId: PopulateAuthorIdDocument
    lastAuthorId: PopulateAuthorIdDocument
    dateStart: Date,
    order: number,
    views: number,
    isFixed: boolean,
    isPrimary?: boolean,
    terms: PopulateTermsDocument[]
    contents?: PostContentDocument,
    themeGroups?: (Omit<PostThemeGroupDocument, "types"> & {
        types: (Omit<PostThemeGroupTypeDocument, "contents"> & {
            contents?: PostThemeGroupTypeContentDocument
        })[]
    })[]
}

export interface PostGetParamDocument {
    langId: string
    postId?: string
    typeId?: PostTypeId | PostTypeId[]
    statusId?: StatusId
    getContents?: 1 | 0
    maxCount?: number
}

export type PostAddParamDocument = {
    mainId?: string
    isFixed: 1 | 0
    isPrimary?: 1 | 0
    contents: PostContentDocument
    termId: string[]
    themeGroups?: (Omit<PostThemeGroupDocument, "types"|"_id"> & {
        types: (Omit<PostThemeGroupTypeDocument, "contents"|"_id"> & {
            contents: Omit<PostThemeGroupTypeContentDocument, "_id">
        })[]
    })[]
} & Omit<PostDocument, "mainId"|"authorId"|"lastAuthorId"|"views"|"terms"|"_id"|"contents"|"isFixed"|"isPrimary">

export type PostUpdateParamDocument = {
    postId: string
    themeGroups?: (Omit<PostThemeGroupDocument, "types"> & {
        types: (Omit<PostThemeGroupTypeDocument, "contents"> & {
            contents: PostThemeGroupTypeContentDocument
        })[]
    })[]
} & Omit<PostAddParamDocument, "themeGroups">

export interface PostUpdateStatusParamDocument {
    postId: string[],
    typeId: PostTypeId
    statusId: StatusId,
}

export interface PostDeleteParamDocument {
    postId: string[],
    typeId: PostTypeId
}