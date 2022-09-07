import {PermissionGroupContentDocument} from "../../types/constants";
import {LanguageId} from "../languages";

const PermissionGroupsContents: Array<PermissionGroupContentDocument> = [
    {
        groupId: 1,
        contents: [
            {langId: LanguageId.Turkish, content: "Yazı"},
            {langId: LanguageId.English, content: "Blog"}
        ]
    },
    {
        groupId: 2,
        contents: [
            {langId: LanguageId.Turkish, content: "Portfolyo"},
            {langId: LanguageId.English, content: "Portfolio"}
        ]
    },
    {
        groupId: 3,
        contents: [
            {langId: LanguageId.Turkish, content: "Slider"},
            {langId: LanguageId.English, content: "Slider"}
        ]
    },
    {
        groupId: 4,
        contents: [
            {langId: LanguageId.Turkish, content: "Referenaslar"},
            {langId: LanguageId.English, content: "Reference"}
        ]
    },
    {
        groupId: 5,
        contents: [
            {langId: LanguageId.Turkish, content: "Galeri"},
            {langId: LanguageId.English, content: "Gallery"}
        ]
    },
    {
        groupId: 6,
        contents: [
            {langId: LanguageId.Turkish, content: "Kullanıcı"},
            {langId: LanguageId.English, content: "User"}
        ]
    },
    {
        groupId: 7,
        contents: [
            {langId: LanguageId.Turkish, content: "Sayfa"},
            {langId: LanguageId.English, content: "Page"}
        ]
    },
    {
        groupId: 8,
        contents: [
            {langId: LanguageId.Turkish, content: "Yönlendirici"},
            {langId: LanguageId.English, content: "Navigate"}
        ]
    }
]

export {PermissionGroupsContents}