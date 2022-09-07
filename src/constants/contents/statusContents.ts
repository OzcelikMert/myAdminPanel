import {StatusContentDocument} from "../../types/constants";
import {LanguageId} from "../languages";

const StatusContents: Array<StatusContentDocument> = [
    {
        statusId: 1,
        contents: [
            {langId: LanguageId.Turkish, content: "Aktif"},
            {langId: LanguageId.English, content: "Active"}
        ]
    },
    {
        statusId: 2,
        contents: [
            {langId: LanguageId.Turkish, content: "İşlemde"},
            {langId: LanguageId.English, content: "In Progress"}
        ]
    },
    {
        statusId: 3,
        contents: [
            {langId: LanguageId.Turkish, content: "Beklemede"},
            {langId: LanguageId.English, content: "Pending"}
        ]
    },
    {
        statusId: 4,
        contents: [
            {langId: LanguageId.Turkish, content: "Devre Dışı"},
            {langId: LanguageId.English, content: "Disabled"}
        ]
    },
    {
        statusId: 5,
        contents: [
            {langId: LanguageId.Turkish, content: "Yasaklı"},
            {langId: LanguageId.English, content: "Banned"}
        ]
    },
    {
        statusId: 6,
        contents: [
            {langId: LanguageId.Turkish, content: "Silindi"},
            {langId: LanguageId.English, content: "Deleted"}
        ]
    },
]

export {StatusContents}
