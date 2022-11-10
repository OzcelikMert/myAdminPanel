import {PermissionId, PostTypeId, UserRoleId} from "../../constants";
import {NavigateFunction} from "react-router-dom";
import PagePaths from "../../constants/pagePaths";

export default {
    checkPermission(userRoleId: number, userPermissions: number[], permissionId: number | number[]) {
        if(Array.isArray(permissionId)) {
            for (const permId of permissionId) {
                if(!this.checkPermission(userRoleId, userPermissions, permId)){
                    return false;
                }
            }
        }else {
            return userRoleId == UserRoleId.SuperAdmin || userPermissions.includes(permissionId);
        }
    },
    checkPermissionAndRedirect(userRoleId: number, userPermissions: number[], permissionId: number, navigate: NavigateFunction) {
        if (!this.checkPermission(
            userRoleId,
            userPermissions,
            permissionId
        )) {
            navigate(PagePaths.dashboard(), {replace: true})
            return false;
        }
        return true;
    },
    getPermissionIdForPostType(typeId: number, query: "Edit" | "Delete" | "Add"): PermissionId {
        let permissionId = 0;
        Object.keys(PostTypeId).forEach((postType) => {
            let postTypeId: any = PostTypeId[postType];
            if (typeId == postTypeId) {
                permissionId = PermissionId[`${postType.toCapitalizeCase()}${query.toCapitalizeCase()}`] ?? 0;
            }
        })
        return permissionId;
    }
}