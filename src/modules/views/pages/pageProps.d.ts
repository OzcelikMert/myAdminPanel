import {NavigateFunction, Params, PathMatch, URLSearchParamsInit} from "react-router-dom";
import LanguageKeys from "../../app/admin/languages";

interface PagePropCommonDocument {
    router: PagePropRouterDocument,
}

type PagePropRouterLocationDocument = {
    state: any,
} & Location

interface PagePropRouterDocument {
    location: PagePropRouterLocationDocument,
    navigate: NavigateFunction,
    params: Readonly<Params<string>>,
    searchParams: readonly [URLSearchParams, ((nextInit: URLSearchParamsInit, navigateOptions?: ({replace?: boolean | undefined, state?: any} | undefined)) => void)],
    match?: PathMatch<any> | null,
    t: (key: LanguageKeys) => string
}

export {
    PagePropCommonDocument
}