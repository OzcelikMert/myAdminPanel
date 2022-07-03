import {NavigateFunction, Params, PathMatch, URLSearchParamsInit} from "react-router-dom";
import LanguageKeys from "../../app/admin/languages";
import {AppAdminGetState, AppAdminSetState} from "../../app/admin/views";

interface PagePropCommonDocument {
    router: PagePropRouterDocument,
    setBreadCrumb: (titles: string[]) => void
    setSessionData: (data: AppAdminSetState["sessionData"]) => void
    getSessionData: AppAdminGetState["sessionData"],
    setPageData: (data: AppAdminSetState["pageData"]) => void
    getPageData: AppAdminGetState["pageData"],

}

type PagePropRouterLocationDocument = {
    state: any,
} & Location

interface PagePropRouterDocument {
    location: PagePropRouterLocationDocument,
    navigate: NavigateFunction,
    params: Readonly<Params<string>>,
    searchParams: readonly [URLSearchParams, ((nextInit: URLSearchParamsInit, navigateOptions?: ({replace?: boolean | undefined, state?: any} | undefined)) => void)],
    match?: PathMatch<any> & {route?: {path: string}},
    t: (key: LanguageKeys) => string
}

export {
    PagePropCommonDocument
}