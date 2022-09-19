import {LanguageDocument} from "../types/constants";

enum LanguageId {
    Turkish = 1,
    English
}

const Languages: Array<LanguageDocument> = [
    { id: LanguageId.Turkish, code: "tr", title: "Türkçe", order: 1, image: "tr.webp" },
    { id: LanguageId.English, code: "en", title: "English", order: 2, image: "gb.webp" },
]

export {Languages, LanguageId}
