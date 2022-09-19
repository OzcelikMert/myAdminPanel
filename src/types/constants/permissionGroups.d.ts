import LanguageKeys from "../app/languages";
import {PermissionGroupId} from "../../constants";

interface PermissionGroupDocument {
    id: PermissionGroupId,
    order: number,
    langKey: LanguageKeys
}

export {PermissionGroupDocument}