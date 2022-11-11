import {PermissionId, PostTypeId, UserRoleId, UserRoles} from "../../constants";
import {NavigateFunction} from "react-router-dom";
import PagePaths from "../../constants/pagePaths";
import PermissionPaths from "../../constants/permissionPaths";

export default {
    checkPermissionPath(path: string, userRoleId: UserRoleId, userPermissions: number[]) {
        for(const permissionPath of PermissionPaths) {
            if(path.startsWith(permissionPath.path)){
                if(
                    userRoleId != UserRoleId.SuperAdmin &&
                    permissionPath.permissionId &&
                    !userPermissions.includes(permissionPath.permissionId)
                ){
                    return false;
                }

                if(permissionPath.userRoleId){
                    let permPathUserRole = UserRoles.findSingle("id", permissionPath.userRoleId);
                    let userRole = UserRoles.findSingle("id", userRoleId);
                    if(userRole.rank < permPathUserRole.rank){
                        return false;
                    }
                }
            }
        }
        return true;
    },
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
    getPermissionIdForPostType(typeId: number, query: "Edit" | "Delete" | "Add"): PermissionId {
        let permissionId = 0;
        Object.keys(PostTypeId).forEach((postType) => {
            let postTypeId: any = PostTypeId[postType];
            if (typeId == postTypeId) {
                try {
                    permissionId = PermissionId[`${postType.toCapitalizeCase()}${query.toCapitalizeCase()}`] ?? 0;
                } catch (e) {}
            }
        })
        return permissionId;
    }
}