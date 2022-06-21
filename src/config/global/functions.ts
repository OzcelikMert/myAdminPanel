import {
    SeoTitleSeparators,
    Status,
    StatusContents,
    StatusId,
    UserRoleContents,
    UserRoleId,
    UserRoles
} from "../../public/static";
import {getSessionData} from "./session";

const GlobalFunctions = {
    getStatusForSelect(statusId: StatusId[], langId: number) {
        let status: {value: any, label: string}[] = [];
        Status.findMulti("id", statusId).forEach(item => {
            status.push(
                {
                    value: item.id,
                    label: GlobalFunctions.getStaticContent(StatusContents, "statusId", item.id, langId)
                }
            );
        });
        return status;
    },
    getUserRolesForSelect(roleId: UserRoleId[], langId: number) {
        let roles: {value: any, label: string}[] = [];
        UserRoles.findMulti("id", roleId).forEach(item => {
            roles.push(
                {
                    value: item.id,
                    label: GlobalFunctions.getStaticContent(UserRoleContents, "roleId", item.id, langId)
                }
            );
        });
        return roles;
    },
    getSeoTitleSeparatorForSelect() {
        let separators: {value: any, label: string}[] = [];
        SeoTitleSeparators.forEach(item => {
            separators.push(
                {
                    value: item.id,
                    label: item.value
                }
            );
        });
        return separators;
    },
    getStatusClassName(statusId: number): string {
        let bg = ``;
        switch (statusId) {
            case StatusId.Active: bg = `success`; break;
            case StatusId.Pending:
            case StatusId.Banned: bg = `danger`; break;
            case StatusId.InProgress: bg = `warning`; break;
            case StatusId.Deleted:
            case StatusId.Disabled: bg = `dark`; break;
        }
        return bg;
    },
    getUserRolesClassName(roleId: UserRoleId): string {
        let bg = ``;
        switch (roleId) {
            case UserRoleId.Admin: bg = `primary`; break;
            case UserRoleId.Editor: bg = `danger`; break;
            case UserRoleId.Author: bg = `success`; break;
            case UserRoleId.User: bg = `info`; break;
        }
        return bg;
    },
    getStaticContent(contents: any[], searchKey: string, searchValue: any, langId: number): string {
        return contents.findSingle(searchKey, searchValue).contents.findSingle("langId", langId).content;
    }
}

export default GlobalFunctions;