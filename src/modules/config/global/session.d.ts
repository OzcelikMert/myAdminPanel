interface GlobalSessionDocument {
    id: number,
    langId: number,
    image: string,
    name: string,
    email: string,
    roleId: number,
    permissions: Array<number>
}

export {
    GlobalSessionDocument
}