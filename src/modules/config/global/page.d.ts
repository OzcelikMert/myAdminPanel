interface GlobalPageDocument {
    searchParams: any,
    langId: number,
    mainLangId: number,
    title: string
}

type GlobalSetPageDocument = {
    searchParams?: any,
    langId?: number,
    mainLangId?: number,
    title?: string
}

export {
    GlobalSetPageDocument,
    GlobalPageDocument
}