import {UserRoleId} from "constants/index";
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
