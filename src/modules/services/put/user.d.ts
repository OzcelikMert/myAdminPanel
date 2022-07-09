export interface UserPutParamDocument {
    userId: number
    isSignOut?: boolean
    roleId?: number
    statusId?: number
    image?: string,
    name?: string
    email?: string
    password?: string
    permissionId?: number[]
    banDateEnd?: string
    banComment?: string
}