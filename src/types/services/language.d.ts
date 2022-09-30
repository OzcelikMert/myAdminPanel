import {StatusId} from "../../constants";

export default interface LanguageDocument {
    _id: string
    title: string
    image: string
    shortKey: string
    statusId: StatusId
}

export interface LanguageGetParamDocument {
    id?: string
}