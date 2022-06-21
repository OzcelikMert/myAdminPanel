interface GlobalPageDocument {
    searchParams: any,
    langId: number,
    title: string
}

type GlobalSetPageDocument = {
    searchParams?: any,
    langId?: number,
    title?: string
}

export {
    GlobalSetPageDocument,
    GlobalPageDocument
}