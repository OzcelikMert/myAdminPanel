import {PostTermTypeContentDocument} from "../../types/constants";
import {LanguageId} from "../languages";

const PostTermTypeContents: Array<PostTermTypeContentDocument> = [
    {
        typeId: 1,
        contents: [
            {langId: LanguageId.Turkish, content: "Kategori"},
            {langId: LanguageId.English, content: "Category"}
        ]
    },
    {
        typeId: 2,
        contents: [
            {langId: LanguageId.Turkish, content: "Etiket"},
            {langId: LanguageId.English, content: "Tag"}
        ]
    }
]

export {
    PostTermTypeContents
}