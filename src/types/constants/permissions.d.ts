import LanguageKeys from "../app/languages";
import {PermissionGroupId, PermissionId} from "../../constants";

interface PermissionDocument {
    id: PermissionId,
    groupId: PermissionGroupId,
    defaultRoleRank: number,
    langKey: LanguageKeys
}

export {
    PermissionDocument
}
