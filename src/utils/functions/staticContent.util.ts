import {
    Status,
    StatusContents,
    StatusId,
    UserRoleContents,
    UserRoleId,
    UserRoles
} from "../../constants";
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
    getStaticContent(contents: any[], searchKey: string, searchValue: any): string {
        console.log(contents, searchKey, searchValue, localStorageUtil.adminLanguage.get)
        return contents.findSingle(searchKey, searchValue).contents.findSingle("langId", localStorageUtil.adminLanguage.get).content;
    }
}