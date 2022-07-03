import {NavigateFunction, Params, PathMatch, URLSearchParamsInit} from "react-router-dom";
import LanguageKeys from "../../app/admin/languages";
import AppProviders from "../../../app/admin/providers";

interface PagePropCommonDocument {
    router: PagePropRouterDocument,
    provider?: AppProviders
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