interface PermissionGroupContentDocument {
    groupId: number,
    contents: Array<PermissionGroupContentLangDocument>
}

interface PermissionGroupContentLangDocument {
    langId: number,
    content: string
}

export {
    PermissionGroupContentDocument,
    PermissionGroupContentLangDocument
}