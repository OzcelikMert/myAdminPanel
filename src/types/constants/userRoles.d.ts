import {UserRoleId} from "../../constants";
import LanguageKeys from "../app/languages";

interface UserRoleDocument {
    id: UserRoleId,
    rank: number,
    order: number,
    langKey: LanguageKeys
}

export {
    UserRoleDocument
}
