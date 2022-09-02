interface UserRoleContentDocument {
    roleId: number,
    contents: Array<UserRoleContentLangDocument>
}

interface UserRoleContentLangDocument {
    langId: number,
    content: string
}

export {
    UserRoleContentDocument,
    UserRoleContentLangDocument
}