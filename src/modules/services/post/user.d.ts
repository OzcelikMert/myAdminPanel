export interface UserPostParamDocument {
    roleId: number
    statusId: number
    name: string
    email: string
    password: string
    permissionId: number[]
    banDateEnd: string
    banComment: string
}