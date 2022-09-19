import {PermissionDocument} from "../types/constants";
import {PermissionGroupId} from "./permissionGroups";
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
    NavigateDelete,
    SeoEdit,
    SettingEdit
}

const Permissions: Array<PermissionDocument> = [
    {id: PermissionId.BlogAdd, groupId: PermissionGroupId.Blog, defaultRoleRank: 2, langKey: "add"},
    {id: PermissionId.BlogEdit, groupId: PermissionGroupId.Blog, defaultRoleRank: 3, langKey: "edit"},
    {id: PermissionId.BlogDelete, groupId: PermissionGroupId.Blog, defaultRoleRank: 3, langKey: "delete"},
    {id: PermissionId.PortfolioAdd, groupId: PermissionGroupId.Portfolio, defaultRoleRank: 2, langKey: "add"},
    {id: PermissionId.PortfolioEdit, groupId: PermissionGroupId.Portfolio, defaultRoleRank: 3, langKey: "edit"},
    {id: PermissionId.PortfolioDelete, groupId: PermissionGroupId.Portfolio, defaultRoleRank: 3, langKey: "delete"},
    {id: PermissionId.SliderAdd, groupId: PermissionGroupId.Slider, defaultRoleRank: 2, langKey: "add"},
    {id: PermissionId.SliderEdit, groupId: PermissionGroupId.Slider, defaultRoleRank: 3, langKey: "edit"},
    {id: PermissionId.SliderDelete, groupId: PermissionGroupId.Slider, defaultRoleRank: 3, langKey: "delete"},
    {id: PermissionId.ReferenceAdd, groupId: PermissionGroupId.Reference, defaultRoleRank: 2, langKey: "add"},
    {id: PermissionId.ReferenceEdit, groupId: PermissionGroupId.Reference, defaultRoleRank: 3, langKey: "edit"},
    {id: PermissionId.ReferenceDelete, groupId: PermissionGroupId.Reference, defaultRoleRank: 3, langKey: "delete"},
    {id: PermissionId.GalleryEdit, groupId: PermissionGroupId.Gallery, defaultRoleRank: 3, langKey: "edit"},
    {id: PermissionId.UserAdd, groupId: PermissionGroupId.User, defaultRoleRank: 3, langKey: "add"},
    {id: PermissionId.UserEdit, groupId: PermissionGroupId.User, defaultRoleRank: 3, langKey: "edit"},
    {id: PermissionId.UserDelete, groupId: PermissionGroupId.User, defaultRoleRank: 3, langKey: "delete"},
    {id: PermissionId.PageAdd, groupId: PermissionGroupId.Page, defaultRoleRank: 2, langKey: "add"},
    {id: PermissionId.PageEdit, groupId: PermissionGroupId.Page, defaultRoleRank: 3, langKey: "edit"},
    {id: PermissionId.PageDelete, groupId: PermissionGroupId.Page, defaultRoleRank: 3, langKey: "delete"},
    {id: PermissionId.NavigateAdd, groupId: PermissionGroupId.Navigate, defaultRoleRank: 2, langKey: "add"},
    {id: PermissionId.NavigateEdit, groupId: PermissionGroupId.Navigate, defaultRoleRank: 3, langKey: "edit"},
    {id: PermissionId.NavigateDelete, groupId: PermissionGroupId.Navigate, defaultRoleRank: 3, langKey: "delete"},
    {id: PermissionId.SeoEdit, groupId: PermissionGroupId.Settings, defaultRoleRank: 3, langKey: "edit"},
    {id: PermissionId.SettingEdit, groupId: PermissionGroupId.Settings, defaultRoleRank: 3, langKey: "edit"}
]

export {Permissions, PermissionId};
