interface PostTermTypeContentDocument {
    typeId: number,
    contents: Array<PostTermTypeContentLangDocument>
}

interface PostTermTypeContentLangDocument {
    langId: number,
    content: string
}

export {
    PostTermTypeContentDocument,
    PostTermTypeContentLangDocument
}