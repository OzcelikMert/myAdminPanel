import {UserRoleContentDocument} from "../../../modules/static";

const UserRoleContents: Array<UserRoleContentDocument> = [
    { roleId: 1, contents: [{langId: 1, content: "Kullanıcı"}, {langId: 2, content: "User"}] },
    { roleId: 2, contents: [{langId: 1, content: "Yazar"}, {langId: 2, content: "Author"}] },
    { roleId: 3, contents: [{langId: 1, content: "Editör"}, {langId: 2, content: "Editor"}] },
    { roleId: 4, contents: [{langId: 1, content: "Yetkili"}, {langId: 2, content: "Admin"}] },
]

export {UserRoleContents}