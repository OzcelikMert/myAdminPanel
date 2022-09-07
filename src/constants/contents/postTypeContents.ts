import {PostTypeContentDocument} from "../../types/constants";
import {LanguageId} from "../languages";

const PostTypeContents: Array<PostTypeContentDocument> = [
    {
        typeId: 1,
        contents: [
            {langId: LanguageId.Turkish, content: "Yazı"},
            {langId: LanguageId.English, content: "Blog"}
        ]
    },
    {
        typeId: 2,
        contents: [
            {langId: LanguageId.Turkish, content: "Portfolyo"},
            {langId: LanguageId.English, content: "Portfolio"}
        ]
    },
    {
        typeId: 3,
        contents: [
            {langId: LanguageId.Turkish, content: "Sayfa"},
            {langId: LanguageId.English, content: "Page"}
        ]
    },
    {
        typeId: 4,
        contents: [
            {langId: LanguageId.Turkish, content: "Kayan Resim"},
            {langId: LanguageId.English, content: "Slider"}
        ]
    },
    {
        typeId: 5,
        contents: [
            {langId: LanguageId.Turkish, content: "Refarans"},
            {langId: LanguageId.English, content: "Reference"}
        ]
    },
]

export {PostTypeContents}
