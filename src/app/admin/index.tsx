import React, {Component} from 'react';
import '../../assets/app/admin/styles/index.scss';
import AppRoutes, {pageRoutes} from './routes';
import {
    useLocation,
    useNavigate,
    useParams, useSearchParams, matchRoutes, RouteObject
} from "react-router-dom";
import {PagePropCommonDocument} from "../../modules/views/pages/pageProps";
import {useTranslation} from "react-i18next";
import AppProviders from "./providers";
import $ from "jquery";

import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import English from "./languages/en.json"
import Turkish from "./languages/tr.json"
import {getSessionData} from "../../config/global/";
import {LanguageId, Languages} from "../../public/static";
import ApiRequestConfig from "../../services/api/config";
import cogoToast, {CTReturn} from "cogo-toast";

i18n.use(initReactI18next)
    .init({
        resources: {
            en: {translation: English},
            tr: {translation: Turkish}
        },
        lng: Languages.findSingle("id", getSessionData().langId).code || Languages.findSingle("id", LanguageId.English).code,
        fallbackLng: Languages.findSingle("id", LanguageId.English).code,
        interpolation: {
            escapeValue: false
        }
    });

type PageState = {
    requestToast: CTReturn[]
};

type PageProps = {} & PagePropCommonDocument;

class AppAdmin extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            requestToast: []
        }
    }

    componentDidMount() {
        this.initRequestToast();
    }

    initRequestToast() {
        ApiRequestConfig.beforeSend = (url, method) => {
            if (method !== "GET") {
                let toastMessage = this.getRequestToastMessage("loading", method);
                this.setState((state: PageState) => {
                    state.requestToast.push(cogoToast.loading(toastMessage.content, {
                        heading: toastMessage.title,
                        hideAfter: 1000,
                        position: 'bottom-center'
                    }))
                });
            }
        }

        ApiRequestConfig.complete = (url, method, result, isRequestFailed) => {
            if(method !== "GET"){
                if(this.state.requestToast.length > 0) {
                    this.state.requestToast.forEach(toast => {
                        setTimeout(() => {
                            if(typeof toast.hide !== "undefined") toast.hide();
                        }, 250);
                    })
                }

                if (isRequestFailed || !result.status) {
                    let toastMessage = this.getRequestToastMessage("error", method);
                    cogoToast.error(toastMessage.content, {
                        heading: toastMessage.title,
                        hideAfter: 10,
                        position: 'bottom-center'
                    })
                }else {
                    let toastMessage = this.getRequestToastMessage("success", method);
                    cogoToast.success(toastMessage.content, {
                        heading: toastMessage.title,
                        hideAfter: 5,
                        position: 'bottom-center'
                    })
                }
            }
        }
    }

    getRequestToastMessage(type: "loading" | "success" | "error", method: "POST" | "PUT"| "DELETE") : {title: string, content: string} {
        let key = `toastMessage${type.toLocaleLowerCase().toCapitalizeCase()}${type === "error" ? "" : method.toLocaleLowerCase().toCapitalizeCase()}`;
        // @ts-ignore
        let title = this.props.router.t(`${key}Title`);
        // @ts-ignore
        let content = this.props.router.t(`${key}Content`);

        return {
            title: title,
            content: content
        }
    }

    render() {
        return (
            <AppProviders router={this.props.router} />
        );
    }
}

export function withRouter(Component: any) {
    function ComponentWithRouterProp(props: any) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        let searchParams = useSearchParams();
        let {t} = useTranslation();

        const routes: RouteObject[] = [
            // Navigate
            {path: pageRoutes.navigate.path() + pageRoutes.navigate.edit.path()},
            // User
            {path: pageRoutes.settings.path() + pageRoutes.settings.user.path() + pageRoutes.settings.user.edit.path()},
            // Post
            {path: pageRoutes.themeContent.path() + pageRoutes.post.path() + pageRoutes.post.add.path()},
            {path: pageRoutes.themeContent.path() + pageRoutes.post.path() + pageRoutes.post.edit.path()},
            {path: pageRoutes.themeContent.path() + pageRoutes.post.path() + pageRoutes.post.list.path()},
            {path: pageRoutes.post.path() + pageRoutes.post.add.path()},
            {path: pageRoutes.post.path() + pageRoutes.post.edit.path()},
            {path: pageRoutes.post.path() + pageRoutes.post.list.path()},
            // Post Term
            {path: pageRoutes.themeContent.path() + pageRoutes.postTerm.path() + pageRoutes.postTerm.add.path()},
            {path: pageRoutes.themeContent.path() + pageRoutes.postTerm.path() + pageRoutes.postTerm.edit.path()},
            {path: pageRoutes.themeContent.path() + pageRoutes.postTerm.path() + pageRoutes.postTerm.list.path()},
            {path: pageRoutes.postTerm.path() + pageRoutes.postTerm.add.path()},
            {path: pageRoutes.postTerm.path() + pageRoutes.postTerm.edit.path()},
            {path: pageRoutes.postTerm.path() + pageRoutes.postTerm.list.path()},
        ];
        let match: any = matchRoutes(routes, location);
        match = (match !== null) ? match[0] : match;
        return (
            <Component
                {...props}
                router={{location, navigate, params, searchParams, match, t}}
            />
        );
    }

    return ComponentWithRouterProp;
}

export default withRouter(AppAdmin);
