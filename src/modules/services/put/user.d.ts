export interface UserPutParamDocument {
    userId: number
    roleId?: number
    statusId: number
    image?: string,
    name?: string
    email?: string
    password?: string
    permissionId?: number[]
    banDateEnd?: string
    banComment?: string
}