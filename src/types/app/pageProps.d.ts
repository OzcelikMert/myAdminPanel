import {NavigateFunction, Params, PathMatch, URLSearchParamsInit} from "react-router-dom";
import LanguageKeys from "./languages";
import {AppAdminGetState, AppAdminSetState} from "./views";
import {i18n, TFunction} from "i18next";

export interface PagePropCommonDocument {
    router: PagePropRouterDocument,
    setBreadCrumb: (titles: string[]) => void
    setSessionData: (data: AppAdminSetState["sessionData"], callBack?: () => void) => void
    getSessionData: AppAdminGetState["sessionData"],
    setPageData: (data: AppAdminSetState["pageData"], callBack?: () => void) => void
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
    i18n: i18n
}