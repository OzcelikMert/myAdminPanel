import {
    SeoTitleSeparators,
    Status,
    StatusContents,
    StatusId,
    UserRoleContents,
    UserRoleId,
    UserRoles
} from "../../public/static";
import localStorageUtil from "../localStorage.util";

export default {
    getStatusForSelect(statusId: StatusId[]) {
        return Status.findMulti("id", statusId).map(item => ({
            value: item.id,
            label: this.getStaticContent(StatusContents, "statusId", item.id)
        }));
    },
    getUserRolesForSelect(roleId: UserRoleId[]) {
        return UserRoles.findMulti("id", roleId).map(item => ({
            value: item.id,
            label: this.getStaticContent(UserRoleContents, "roleId", item.id)
        }));
    },
    getSeoTitleSeparatorForSelect() {
        return SeoTitleSeparators.map(item => ({
            value: item.id,
            label: item.value
        }));
    },
    getStaticContent(contents: any[], searchKey: string, searchValue: any): string {
        console.log(contents, searchKey, searchValue, localStorageUtil.adminLanguage.get)
        return contents.findSingle(searchKey, searchValue).contents.findSingle("langId", localStorageUtil.adminLanguage.get).content;
    }
}