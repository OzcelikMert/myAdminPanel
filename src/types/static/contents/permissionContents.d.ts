interface PermissionContentDocument {
    permId: number,
    contents: Array<PermissionContentLangDocument>
}

interface PermissionContentLangDocument {
    langId: number,
    content: string
}

export {
    PermissionContentDocument,
    PermissionContentLangDocument
}