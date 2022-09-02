import SearchParamDocument from "../providers";
import {LanguageId, UserRoleId} from "../../../public/static";

type AppAdminGetState = {
    pageData: {
        searchParams: SearchParamDocument,
        langId: number,
        mainLangId: number,
    },
    sessionData: {
        id: number,
        langId: LanguageId,
        image: string,
        name: string,
        email: string,
        roleId: UserRoleId,
        permissions: number[]
    }
}

type AppAdminSetState = {
    pageData: {
        langId?: number,
        mainLangId?: number,
    },
    sessionData: {
        id?: number,
        langId?: LanguageId,
        image?: string,
        name?: string,
        email?: string,
        roleId?: UserRoleId,
        permissions?: number[]
    }
}

export {
    AppAdminGetState,
    AppAdminSetState
}