import {
    Status,
    StatusId,
    UserRoleId,
    UserRoles
} from "../constants";
import localStorageUtil from "./localStorage.util";
import {PagePropCommonDocument} from "../types/app/pageProps";
import LanguageKeys from "../types/app/languages";

export default {
    getStatusForSelect(statusId: StatusId[], t: PagePropCommonDocument["router"]["t"]) {
        return Status.findMulti("id", statusId).map(item => ({
            value: item.id,
            label: t(item.langKey)
        }));
    },
    getUserRolesForSelect(roleId: UserRoleId[], t: PagePropCommonDocument["router"]["t"]) {
        return UserRoles.findMulti("id", roleId).map(item => ({
            value: item.id,
            label: t(item.langKey)
        }));
    }
}