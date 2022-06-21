import {LanguageDocument} from "../../modules/static";

const Languages: Array<LanguageDocument> = [
    { id: 1, code: "tr", title: "Türkçe", order: 1, image: "" },
    { id: 2, code: "en", title: "English", order: 2, image: "" },
]

enum LanguageId {
    Turkish = 1,
    English
}

export {Languages, LanguageId}
