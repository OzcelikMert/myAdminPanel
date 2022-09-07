export default interface UserDocument {
    _id: string
    roleId: number,
    statusId: number,
    image: string,
    name: string,
    comment: string,
    phone: string,
    email: string,
    password: string,
    permissions: number[],
    banDateEnd: Date,
    banComment: string,
    facebook: string,
    instagram: string,
    twitter: string,
    views: number,
}

export interface PopulateAuthorIdDocument {
    _id: string,
    name: string,
    email: string,
    url: string
}

export interface UsersGetParamDocument {
    userId?: string
}

export interface UserAddParamDocument {
    roleId: number,
    statusId: number,
    name: string,
    email: string,
    password: string,
    permissionId: number[]
}

export interface UserUpdateParamDocument {
    userId: string
    roleId: number,
    statusId: number,
    name: string,
    email: string
    password: string
    permissionId: number[]
    banDateEnd: string
    banComment: string
}

export interface UserDeleteParamDocument {
    userId: string
}