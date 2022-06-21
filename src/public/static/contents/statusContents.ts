import {StatusContentDocument} from "../../../modules/static";

const StatusContents: Array<StatusContentDocument> = [
    { statusId: 1, contents: [{langId: 1, content: "Aktif"}, {langId: 2, content: "Active"}] },
    { statusId: 2, contents: [{langId: 1, content: "İşlemde"}, {langId: 2, content: "In Progress"}] },
    { statusId: 3, contents: [{langId: 1, content: "Beklemede"}, {langId: 2, content: "Pending"}] },
    { statusId: 4, contents: [{langId: 1, content: "Devre Dışı"}, {langId: 2, content: "Disabled"}] },
    { statusId: 5, contents: [{langId: 1, content: "Yasaklı"}, {langId: 2, content: "Banned"}] },
    { statusId: 6, contents: [{langId: 1, content: "Silindi"}, {langId: 2, content: "Deleted"}] },
]

export {StatusContents}
