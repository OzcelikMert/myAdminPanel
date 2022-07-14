export interface UserDocument {
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