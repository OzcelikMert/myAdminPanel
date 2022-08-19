import {LanguageDocument} from "../../modules/static";

const Languages: Array<LanguageDocument> = [
    { id: 1, code: "tr", title: "Türkçe", order: 1, image: "tr.webp" },
    { id: 2, code: "en", title: "English", order: 2, image: "gb.webp" },
]

enum LanguageId {
    Turkish = 1,
    English
}

export {Languages, LanguageId}
