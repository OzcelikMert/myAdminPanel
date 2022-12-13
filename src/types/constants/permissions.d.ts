import LanguageKeys from "../app/languages";
import {PermissionGroupId, PermissionId} from "constants/index";

interface PermissionDocument {
    id: PermissionId,
    groupId: PermissionGroupId,
    defaultRoleRank: number,
    langKey: LanguageKeys
}

export {
    PermissionDocument
}
