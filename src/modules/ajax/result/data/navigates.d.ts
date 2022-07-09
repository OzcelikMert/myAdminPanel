export interface NavigateDocument {
    navigateId: number,
    navigateMainId: number,
    navigateOrder: number,
    navigateStatusId: number,
    // Content
    navigateContentId?: number,
    navigateContentNavigateId?: number,
    navigateContentLangId?: number,
    navigateContentTitle?: string,
    navigateContentUrl?: string,
}