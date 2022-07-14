import {PermissionDocument} from "../../modules/static";

const Permissions: Array<PermissionDocument> = [
    {id: 1, groupId:1, defaultRoleRank: 2},
    {id: 2, groupId:1, defaultRoleRank: 3},
    {id: 3, groupId:1, defaultRoleRank: 3},
    {id: 4, groupId:2, defaultRoleRank: 2},
    {id: 5, groupId:2, defaultRoleRank: 3},
    {id: 6, groupId:2, defaultRoleRank: 3},
    {id: 7, groupId:3, defaultRoleRank: 2},
    {id: 8, groupId:3, defaultRoleRank: 3},
    {id: 9, groupId:3, defaultRoleRank: 3},
    {id: 10, groupId:4, defaultRoleRank: 2},
    {id: 11, groupId:4, defaultRoleRank: 3},
    {id: 12, groupId:4, defaultRoleRank: 3},
    {id: 13, groupId:5, defaultRoleRank: 3},
    {id: 14, groupId:6, defaultRoleRank: 3},
    {id: 15, groupId:6, defaultRoleRank: 3},
    {id: 16, groupId:6, defaultRoleRank: 3},
    {id: 17, groupId:7, defaultRoleRank: 2},
    {id: 18, groupId:7, defaultRoleRank: 3},
    {id: 19, groupId:7, defaultRoleRank: 3},
    {id: 20, groupId:8, defaultRoleRank: 2},
    {id: 21, groupId:8, defaultRoleRank: 3},
    {id: 22, groupId:8, defaultRoleRank: 3}
]

enum PermissionId {
    BlogAdd = 1,
    BlogEdit,
    BlogDelete,
    PortfolioAdd,
    PortfolioEdit,
    PortfolioDelete,
    SliderAdd,
    SliderEdit,
    SliderDelete,
    ReferenceAdd,
    ReferenceEdit,
    ReferenceDelete,
    GalleryEdit,
    UserAdd,
    UserEdit,
    UserDelete,
    PageAdd,
    PageEdit,
    PageDelete,
    NavigateAdd,
    NavigateEdit,
    NavigateDelete
}

export {Permissions, PermissionId};
