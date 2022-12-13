import LanguageKeys from "../app/languages";
import {PermissionGroupId} from "constants/index";

interface PermissionGroupDocument {
    id: PermissionGroupId,
    order: number,
    langKey: LanguageKeys
}

export {PermissionGroupDocument}