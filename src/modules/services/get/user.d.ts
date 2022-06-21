export interface UsersGetParamDocument {
    email?: string
    password?: string
    userId?: number
    isCheckSession?: boolean
    isRefresh?: boolean
    requestType: "list" | "session"
}