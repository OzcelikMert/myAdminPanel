import {GlobalPageDocument, GlobalSetPageDocument} from "../../modules/config/global";
import {LanguageId} from "../../public/static";

let GlobalPageData: GlobalPageDocument = {
    searchParams: {},
    langId: 1,
    title: "",
}

function setPageData(data: GlobalSetPageDocument) {
    Object.assign(GlobalPageData, data);
}

function getPageData(): GlobalPageDocument { return GlobalPageData; }

export {
    setPageData,
    getPageData
}