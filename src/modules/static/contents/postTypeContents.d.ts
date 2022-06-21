interface PostTypeContentDocument {
    typeId: number,
    contents: Array<PostTypeContentLangDocument>
}

interface PostTypeContentLangDocument {
    langId: number,
    content: string
}

export {
    PostTypeContentDocument,
    PostTypeContentLangDocument
}
