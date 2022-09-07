import {UserRoleContentDocument} from "../../types/constants";
import {LanguageId} from "../languages";

const UserRoleContents: Array<UserRoleContentDocument> = [
    { 
        roleId: 1, 
        contents: [
            {langId: LanguageId.Turkish, content: "Kullanıcı"}, 
            {langId: LanguageId.English, content: "User"}
        ] 
    },
    { 
        roleId: 2, 
        contents: [
            {langId: LanguageId.Turkish, content: "Yazar"}, 
            {langId: LanguageId.English, content: "Author"}
        ] 
    },
    { 
        roleId: 3, 
        contents: [
            {langId: LanguageId.Turkish, content: "Editör"}, 
            {langId: LanguageId.English, content: "Editor"}
        ] 
    },
    { 
        roleId: 4, 
        contents: [
            {langId: LanguageId.Turkish, content: "Yetkili"}, 
            {langId: LanguageId.English, content: "Admin"}
        ] 
    },
]

export {UserRoleContents}