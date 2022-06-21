import {GlobalSessionDocument} from "../../modules/config/global";
import {LanguageId} from "../../public/static";

let GlobalSessionData: GlobalSessionDocument = {
    id: 0,
    langId: LanguageId.English,
    image: "",
    name: "",
    email: "",
    roleId: 1,
    permissions: []
}

function setSessionData(data: GlobalSessionDocument) {
    Object.assign(GlobalSessionData, data);
}

function getSessionData() : GlobalSessionDocument { return GlobalSessionData; }

export {
    setSessionData,
    getSessionData
}