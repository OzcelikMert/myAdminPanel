import {LanguageDocument} from "types/constants";

enum LanguageId {
    Turkish = 1,
    English
}

const Languages: Array<LanguageDocument> = [
    { id: LanguageId.English, code: "en", title: "English", order: 1, image: "gb.webp" },
    { id: LanguageId.Turkish, code: "tr", title: "Türkçe", order: 2, image: "tr.webp" },
]

export {Languages, LanguageId}
