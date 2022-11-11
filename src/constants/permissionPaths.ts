import {PermissionId} from "./permissions";
import {UserRoleId} from "./userRoles";
import PagePaths from "./pagePaths";
import {PostTypeId} from "./postTypes";
import {PermissionPathDocument} from "../types/constants/permissionPaths";

const gallery: PermissionPathDocument[] = [
    {
        path: PagePaths.gallery().upload(),
        permissionId: PermissionId.GalleryEdit
    }
]

const component: PermissionPathDocument[] = [
    {
        path: PagePaths.component().edit(undefined),
        permissionId: PermissionId.ComponentEdit
    },
    {
        path: PagePaths.component().add(),
        userRoleId: UserRoleId.SuperAdmin
    }
];

const setting: PermissionPathDocument[] = [
    {
        path: PagePaths.settings().seo(),
        permissionId: PermissionId.SeoEdit
    },
    {
        path: PagePaths.settings().general(),
        permissionId: PermissionId.SettingEdit
    },
    {
        path: PagePaths.settings().subscribers(),
        permissionId: PermissionId.SubscriberEdit
    },
    {
        path: PagePaths.settings().contactForms(),
        userRoleId: UserRoleId.Admin
    },
    {
        path: PagePaths.settings().staticLanguages(),
        permissionId: PermissionId.StaticLanguage
    },
    {
        path: PagePaths.settings().user().add(),
        permissionId: PermissionId.ComponentEdit
    },
    {
        path: PagePaths.settings().user().edit(),
        permissionId: PermissionId.ComponentEdit
    }
]

const post: PermissionPathDocument[] = [
    {
        path: PagePaths.post(PostTypeId.Page).add(),
        permissionId: PermissionId.PageAdd
    },
    {
        path: PagePaths.post(PostTypeId.Page).edit(undefined),
        permissionId: PermissionId.PageEdit
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Slider).add(),
        permissionId: PermissionId.SliderAdd
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Slider).edit(undefined),
        permissionId: PermissionId.SliderDelete
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Navigate).add(),
        permissionId: PermissionId.NavigateAdd
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Navigate).edit(undefined),
        permissionId: PermissionId.NavigateEdit
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Service).add(),
        permissionId: PermissionId.ServiceAdd
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Service).edit(undefined),
        permissionId: PermissionId.ServiceEdit
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Blog).add(),
        permissionId: PermissionId.BlogAdd
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Blog).edit(undefined),
        permissionId: PermissionId.BlogEdit
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Portfolio).add(),
        permissionId: PermissionId.PortfolioAdd
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Portfolio).edit(undefined),
        permissionId: PermissionId.PortfolioEdit
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Reference).add(),
        permissionId: PermissionId.ReferenceAdd
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Reference).edit(undefined),
        permissionId: PermissionId.ReferenceEdit
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Testimonial).add(),
        permissionId: PermissionId.TestimonialAdd
    },
    {
        path: PagePaths.themeContent().post(PostTypeId.Testimonial).edit(undefined),
        permissionId: PermissionId.TestimonialEdit
    }
]

const PermissionPaths: PermissionPathDocument[] = [
    ...gallery,
    ...component,
    ...setting,
    ...post
];

export default PermissionPaths;