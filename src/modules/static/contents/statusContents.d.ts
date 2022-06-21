interface StatusContentDocument {
    statusId: number,
    contents: Array<StatusContentLangDocument>
}

interface StatusContentLangDocument {
    langId: number,
    content: string
}

export {
    StatusContentDocument,
    StatusContentLangDocument
}