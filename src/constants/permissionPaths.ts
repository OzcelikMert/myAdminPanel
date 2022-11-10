import {PermissionId} from "./permissions";
import {UserRoleId} from "./userRoles";
import PagePaths from "./pagePaths";

export default [
    {
        path: PagePaths.gallery().upload(),
        permissionId: PermissionId.GalleryEdit
    },
    {
        path: PagePaths.component().edit(undefined),
        permissionId: PermissionId.ComponentEdit
    },
    {
        path: PagePaths.component().add(),
        userRoleId: UserRoleId.SuperAdmin
    },
]