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

import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import English from "./languages/en.json"
import Turkish from "./languages/tr.json"
import {GlobalPaths} from "../../config/global/";
import {LanguageId, Languages, SettingId, UserRoleId} from "../../public/static";
import ApiRequestConfig from "../../services/api/config";
import cogoToast, {CTReturn} from "cogo-toast";
import Navbar from "./views/tools/navbar";
import Sidebar from "./views/tools/sidebar";
import Footer from "./views/tools/footer";
import {LanguageDocument} from "../../modules/ajax/result/data";
import {ThemeFormSelect} from "./views/components/form";
import Services from "../../services";
import Statement from "../../library/statement";
import {AppAdminGetState, AppAdminSetState} from "../../modules/app/admin/views";

const language = i18n.use(initReactI18next);
language.init({
    resources: {
        en: {translation: English},
        tr: {translation: Turkish}
    },
    lng: Languages.findSingle("id", LanguageId.English).code,
    fallbackLng: Languages.findSingle("id", LanguageId.English).code,
    interpolation: {
        escapeValue: false
    }
});

export type PageState = {
    requestToast: CTReturn[]
    pageLanguages: { label: string | JSX.Element, value: any }[],
    breadCrumbTitle: string,
    isPageLoading: boolean,
} & AppAdminGetState;

type PageProps = {
    router: PagePropCommonDocument["router"]
}

class AppAdmin extends Component<PageProps, PageState> {
    oldLocation = "";
    constructor(props: PageProps) {
        super(props);
        this.state = {
            requestToast: [],
            breadCrumbTitle: "",
            pageLanguages: [],
            isPageLoading: true,
            pageData: {
                searchParams: {
                    postId: 0,
                    navigateId: 0,
                    termTypeId: 0,
                    postTypeId: 0,
                    termId: 0,
                    userId: 0
                },
                langId: 1,
                mainLangId: 1,
            },
            sessionData: {
                id: 0,
                langId: LanguageId.English,
                image: "",
                name: "",
                email: "",
                roleId: 1,
                permissions: []
            }
        }
    }

    componentDidMount() {
        this.initRequestToast();
        this.getContentLanguages();
        this.getContentMainLanguage();
        this.onRouteChanged();
    }

    componentDidUpdate(prevProps: Readonly<PageProps>, prevState: Readonly<PageState>) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        this.setState({
            isPageLoading: true,
        }, () => {
            this.setState((state: PageState) => {
                state.pageData.langId = state.pageData.mainLangId;
                state.pageData.searchParams = {
                    postId: 0,
                    navigateId: 0,
                    termTypeId: 0,
                    postTypeId: 0,
                    termId: 0,
                    userId: 0
                };
                if (this.props.router.match !== null) {
                    Statement.Foreach(this.props.router.match?.params, (key, value) => {
                        state.pageData.searchParams[key] = value;
                    })
                }
                return state;
            }, () => this.setState({isPageLoading: false}))
        })
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
            if (method !== "GET") {
                if (this.state.requestToast.length > 0) {
                    this.state.requestToast.forEach(toast => {
                        setTimeout(() => {
                            if (typeof toast.hide !== "undefined") toast.hide();
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
                } else {
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

    getRequestToastMessage(type: "loading" | "success" | "error", method: "POST" | "PUT" | "DELETE"): { title: string, content: string } {
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

    setBreadCrumb(titles: string[]) {
        this.setState((state: PageState) => {
            state.breadCrumbTitle = "";
            titles.forEach(title => {
                state.breadCrumbTitle += `${title} - `;
            })
            state.breadCrumbTitle = state.breadCrumbTitle.removeLastChar(2);
            return state;
        })
    }

    setSessionData(data: AppAdminSetState["sessionData"], callBack?: () => void){
        this.setState((state: PageState) => {
            state.sessionData = Object.assign(state.sessionData, data);
            return state;
        }, () => {
            if(callBack) {
                callBack();
            }
        })
    }

    setPageData(data: AppAdminSetState["pageData"], callBack?: () => void){
        this.setState((state: PageState) => {
            state.pageData = Object.assign(state.pageData, data);
            return state;
        }, () => {
            if(callBack) {
                callBack();
            }
        })
    }

    changeLanguage(languageId: LanguageId) {
        language.changeLanguage(Languages.findSingle("id", languageId).code);
    }

    getContentLanguages() {
        this.setState({
            isPageLoading: true,
        });
        let resData = Services.Get.languages({})
        if (resData.status) {
            this.setState({
                pageLanguages: resData.data.map((lang, index) => ({
                    label: <this.ContentLanguageItem {...lang} key={index}/>,
                    value: lang.langId
                })),
                isPageLoading: false
            })
        }
    }

    getContentMainLanguage() {
        this.setState({
            isPageLoading: true,
        });
        let resData = Services.Get.settings({
            id: SettingId.WebsiteMainLanguage
        })
        if (resData.status) {
            this.setState((state: PageState) => {
                resData.data.forEach(setting => {
                    state.pageData.mainLangId = Number(setting.settingValue);
                    state.pageData.langId = state.pageData.mainLangId;
                })
                state.isPageLoading = false;
                return state;
            })
        }
    }

    ContentLanguageItem = (props: LanguageDocument) => (
        <div className="row p-0">
            <div className="col-6 text-end">
                <img width="35" src={GlobalPaths.uploads.flags + props.langImage} alt={props.langShortKey}/>
            </div>
            <div className="col-6 text-start">
                <h6>{props.langTitle}</h6>
            </div>
        </div>
    )

    ContentLanguage = () => {
        const showingPages = [
            pageRoutes.navigate.path() + pageRoutes.navigate.edit.path(),
            pageRoutes.post.path() + pageRoutes.post.edit.path(),
            pageRoutes.postTerm.path() + pageRoutes.postTerm.edit.path(),
            pageRoutes.settings.path() + pageRoutes.settings.seo.path()
        ];

        let isShow = showingPages.map(page => {
            if (
                this.props.router.match &&
                this.props.router.match.route
            ) {
                return this.props.router.match.route.path.indexOf(page) > -1
            }
            return this.props.router.location.pathname.indexOf(page) > -1
        }).includes(true);

        return isShow ? (
            <ThemeFormSelect
                title="Content Language"
                name="contentLanguageId"
                isSearchable={false}
                options={this.state.pageLanguages}
                value={this.state.pageLanguages.findSingle("value", this.state.pageData.langId)}
                onChange={(item: any, e) => this.setState((state: PageState) => {
                    this.state.pageData.langId = item.value;
                    return state;
                })}
            />
        ) : null
    }

    BreadCrumb = () => (
        <div className="page-header">
            <div className="row w-100 m-0">
                <div className="col-md-8 p-0">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-home"></i>
                        </span>
                        {this.state.breadCrumbTitle}
                    </h3>
                </div>
                <div className="col-md-4 p-0 content-language">
                    <this.ContentLanguage/>
                </div>
            </div>
        </div>
    );

    render() {
        const fullPageLayoutRoutes = [
            pageRoutes.login.path(),
            pageRoutes.lock.path()
        ];
        let isFullPageLayout = fullPageLayoutRoutes.includes(this.props.router.location.pathname);

        if(this.oldLocation !== this.props.router.location.pathname) {
            this.oldLocation = this.props.router.location.pathname;
            return null;
        }


        const commonProps: PagePropCommonDocument = {
            router: this.props.router,
            setBreadCrumb: titles => this.setBreadCrumb(titles),
            setSessionData: (data, callBack) => this.setSessionData(data, callBack),
            getSessionData: this.state.sessionData,
            getPageData: this.state.pageData,
            setPageData: (data, callBack) => this.setPageData(data, callBack)
        };

        let breadCrumb = !isFullPageLayout ? <this.BreadCrumb/> : '';
        let navbarComponent = !isFullPageLayout ? <Navbar {...commonProps}/> : '';
        let sidebarComponent = !isFullPageLayout ? <Sidebar {...commonProps}/> : '';
        let footerComponent = !isFullPageLayout ? <Footer/> : '';
        return (
            <div className="container-scroller">
                {navbarComponent}
                <div
                    className={`container-fluid page-body-wrapper ${isFullPageLayout ? "full-page-wrapper" : ""}`}>
                    {sidebarComponent}
                    <div className="main-panel">
                        <div className="content-wrapper">
                            {breadCrumb}
                            <AppProviders {...commonProps}>
                                <AppRoutes {...commonProps} isPageLoading={this.state.isPageLoading}/>
                            </AppProviders>
                        </div>
                        {footerComponent}
                    </div>
                </div>
            </div>
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
