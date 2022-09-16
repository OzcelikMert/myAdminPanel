import {PopulateTermsDocument} from "./postTerm";
import {PopulateAuthorIdDocument} from "./user";
import LanguageKeys from "../app/languages";
import {ThemeGroupTypeId} from "../../constants/themeGroupType.const";

export interface PostThemeGroupTypeContentDocument {
    langId: string
    content: string
}

export interface PostThemeGroupTypeDocument {
    _id: string
    elementId: string
    typeId: ThemeGroupTypeId,
    langKey: LanguageKeys,
    contents: PostThemeGroupTypeContentDocument
}

export interface PostThemeGroupDocument {
    _id: string
    elementId: string
    langKey: LanguageKeys,
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
    typeId: number,
    statusId: number,
    authorId: PopulateAuthorIdDocument
    lastAuthorId: PopulateAuthorIdDocument
    dateStart: Date,
    order: number,
    views: number,
    isFixed: boolean,
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
    typeId?: number | number[]
    statusId?: number
    getContents?: 1 | 0
    maxCount?: number
}

export type PostAddParamDocument = {
    isFixed: 1 | 0
    contents: PostContentDocument
    termId: string[]
    themeGroups?: (Omit<PostThemeGroupDocument, "types"|"_id"> & {
        types: (Omit<PostThemeGroupTypeDocument, "contents"|"_id"> & {
            contents: Omit<PostThemeGroupTypeContentDocument, "_id">
        })[]
    })[]
} & Omit<PostDocument, "authorId"|"lastAuthorId"|"views"|"terms"|"_id"|"contents"|"isFixed">

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
    typeId: number
    statusId: number,
}

export interface PostDeleteParamDocument {
    postId: string[],
    typeId: number
}