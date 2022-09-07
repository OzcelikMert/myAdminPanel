import {UserRoleDocument} from "../types/constants";

const UserRoles: Array<UserRoleDocument> = [
    {id: 1, rank: 1, order: 1},
    {id: 2, rank: 2, order: 2},
    {id: 3, rank: 3, order: 3},
    {id: 4, rank: 4, order: 4}
]

enum UserRoleId {
    User = 1,
    Author,
    Editor,
    Admin
}

export {UserRoles, UserRoleId};
