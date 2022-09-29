import {PermissionGroupDocument} from "../types/constants";

enum PermissionGroupId {
    Blog = 1,
    Portfolio,
    Slider,
    Reference,
    Gallery,
    User,
    Page,
    Navigate,
    Settings,
    Service,
    Testimonial,
    Footer
}

const PermissionGroups: Array<PermissionGroupDocument> = [
    {id: PermissionGroupId.Blog, order: 1, langKey: "blogs"},
    {id: PermissionGroupId.Portfolio, order: 2, langKey: "portfolios"},
    {id: PermissionGroupId.Slider, order: 3, langKey: "sliders"},
    {id: PermissionGroupId.Reference, order: 4, langKey: "references"},
    {id: PermissionGroupId.Gallery, order: 5, langKey: "gallery"},
    {id: PermissionGroupId.User, order: 6, langKey: "users"},
    {id: PermissionGroupId.Page, order: 7, langKey: "pages"},
    {id: PermissionGroupId.Navigate, order: 8, langKey: "navigates"},
    {id: PermissionGroupId.Settings, order: 9, langKey: "settings"},
    {id: PermissionGroupId.Service, order: 10, langKey: "services"},
    {id: PermissionGroupId.Testimonial, order: 11, langKey: "testimonials"},
    {id: PermissionGroupId.Footer, order: 12, langKey: "footer"}
]

export {PermissionGroups, PermissionGroupId}