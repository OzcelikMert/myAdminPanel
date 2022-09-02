import {PermissionGroupDocument} from "../../types/static";

const PermissionGroups: Array<PermissionGroupDocument> = [
    {id: 1, order: 1},
    {id: 2, order: 2},
    {id: 3, order: 3},
    {id: 4, order: 4},
    {id: 5, order: 5},
    {id: 6, order: 6},
    {id: 7, order: 7},
    {id: 8, order: 8}
]

enum PermissionGroupId {
    Blog = 1,
    Portfolio,
    Slider,
    Reference,
    Gallery,
    User,
    Page,
    Navigate
}

export {PermissionGroups, PermissionGroupId}