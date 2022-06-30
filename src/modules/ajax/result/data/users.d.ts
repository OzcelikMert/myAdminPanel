export interface UserDocument {
    userId: number,
    userRoleId: number,
    userStatusId: number,
    userName: string,
    userEmail: string,
    userImage: string,
    userPermissions: number[]
    userBanDateEnd: string
    userBanComment: string
}