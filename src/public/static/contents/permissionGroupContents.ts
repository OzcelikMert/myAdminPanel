import {PermissionGroupContentDocument} from "../../../modules/static";

const PermissionGroupsContents: Array<PermissionGroupContentDocument> = [
    { groupId: 1, contents: [{langId: 1, content: "Yazı"}, {langId: 2, content: "Blog"}] },
    { groupId: 2, contents: [{langId: 1, content: "Portfolyo"}, {langId: 2, content: "Portfolio"}] },
    { groupId: 3, contents: [{langId: 1, content: "Slider"}, {langId: 2, content: "Slider"}] },
    { groupId: 4, contents: [{langId: 1, content: "Referenaslar"}, {langId: 2, content: "Reference"}] },
    { groupId: 5, contents: [{langId: 1, content: "Galeri"}, {langId: 2, content: "Gallery"}] },
    { groupId: 6, contents: [{langId: 1, content: "Kullanıcı"}, {langId: 2, content: "User"}] },
    { groupId: 7, contents: [{langId: 1, content: "Sayfa"}, {langId: 2, content: "Page"}] },
    { groupId: 8, contents: [{langId: 1, content: "Yönlendirici"}, {langId: 2, content: "Navigate"}] }
]

export {PermissionGroupsContents}