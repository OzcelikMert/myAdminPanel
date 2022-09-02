import {PostTermTypeContentDocument} from "../../../types/static";

const PostTermTypeContents: Array<PostTermTypeContentDocument> = [
    { typeId: 1, contents: [{langId: 1, content: "Kategori"}, {langId: 2, content: "Category"}] },
    { typeId: 2, contents: [{langId: 1, content: "Etiket"}, {langId: 2, content: "Tag"}] }
]

export {
    PostTermTypeContents
}