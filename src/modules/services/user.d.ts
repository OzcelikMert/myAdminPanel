export default interface UserDocument {
    userId: number
    userRoleId: number
    userStatusId: number
    userImage: string
    userName: string
    userComment: string
    userPhone: string
    userEmail: string
    userPermissions: number[]
    userBanDateEnd: string
    userBanComment: string
    userFacebook: string
    userInstagram: string
    userTwitter: string
}

export interface UsersGetParamDocument {
    userId?: number
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
    userId: number
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
    userId: number
}