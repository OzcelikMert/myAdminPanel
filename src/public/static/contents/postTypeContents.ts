import {PostTypeContentDocument} from "../../../types/static";

const PostTypeContents: Array<PostTypeContentDocument> = [
    { typeId: 1, contents: [{langId: 1, content: "Yazı"}, {langId: 2, content: "Blog"}] },
    { typeId: 2, contents: [{langId: 1, content: "Portfolyo"}, {langId: 2, content: "Portfolio"}] },
    { typeId: 3, contents: [{langId: 1, content: "Sayfa"}, {langId: 2, content: "Page"}] },
    { typeId: 4, contents: [{langId: 1, content: "Kayan Resim"}, {langId: 2, content: "Slider"}] },
    { typeId: 5, contents: [{langId: 1, content: "Refarans"}, {langId: 2, content: "Reference"}] },
]

export {PostTypeContents}
