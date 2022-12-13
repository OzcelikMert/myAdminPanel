import React, {Component} from 'react';
import 'styles/index.scss';
import {
    useLocation,
    useNavigate,
    useParams, useSearchParams, matchRoutes, RouteObject, Link
} from "react-router-dom";
import {PagePropCommonDocument} from "types/app/pageProps";
import {useTranslation} from "react-i18next";
import AppProviders from "./providers";

import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import English from "./languages/en.json"
import Turkish from "./languages/tr.json"
import {LanguageId, Languages} from "constants/index";
import Navbar from "components/tools/navbar";
import Sidebar from "components/tools/sidebar";
import Footer from "components/tools/footer";
import {ThemeFormSelect} from "components/form";
import Statement from "library/statement";
import {AppAdminGetState, AppAdminSetState} from "types/app/views";
import languageService from "services/language.service";
import settingService from "services/setting.service";
import LanguageDocument from "types/services/language";
import pathUtil from "utils/path.util";
import localStorageUtil from "utils/localStorage.util";
import {Helmet} from "react-helmet";
import AppRoutes from "./routes";
import PagePaths from "constants/pagePaths";

const language = i18n.use(initReactI18next);
language.init({
    resources: {
        en: {translation: English},
        tr: {translation: Turkish}
    },
    lng: Languages.findSingle("id", localStorageUtil.adminLanguage.get)?.code,
    fallbackLng: Languages.findSingle("id", LanguageId.English)?.code,
    interpolation: {
        escapeValue: false
    }
});

type PageState = {
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
            breadCrumbTitle: "",
            pageLanguages: [],
            isPageLoading: true,
            pageData: {
                searchParams: {
                    postId: "",
                    termTypeId: 0,
                    postTypeId: 0,
                    termId: "",
                    userId: "",
                    componentId: ""
                },
                langId: "",
                mainLangId: "1",
            },
            sessionData: {
                id: "",
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
                    postId: "",
                    termTypeId: 0,
                    postTypeId: 0,
                    termId: "",
                    userId: "",
                    componentId: ""
                };
                if (this.props.router.match) {
                    Statement.Foreach(this.props.router.match?.params, (key, value) => {
                        state.pageData.searchParams[key] = value;
                    })
                }
                return state;
            }, () => this.setState({isPageLoading: false}))
        })
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

    setSessionData(data: AppAdminSetState["sessionData"], callBack?: () => void) {
        this.setState((state: PageState) => {
            state.sessionData = Object.assign(state.sessionData, data);
            return state;
        }, () => {
            if (callBack) {
                callBack();
            }
        })
    }

    setPageData(data: AppAdminSetState["pageData"], callBack?: () => void) {
        this.setState((state: PageState) => {
            state.pageData = Object.assign(state.pageData, data);
            return state;
        }, () => {
            if (callBack) {
                callBack();
            }
        })
    }

    getContentLanguages() {
        this.setState({
            isPageLoading: true,
        }, () => {
            let resData = languageService.get({});
            if (resData.status) {
                this.setState({
                    pageLanguages: resData.data.map((lang, index) => ({
                        label: <this.ContentLanguageItem {...lang} key={index}/>,
                        value: lang._id
                    }))
                })
            }

            this.setState({
                isPageLoading: false
            })
        });

    }

    getContentMainLanguage() {
        this.setState({
            isPageLoading: true,
        }, () => {
            let resData = settingService.get({})
            if (resData.status) {
                let data = resData.data[0];
                this.setState((state: PageState) => {
                    state.pageData.mainLangId = data.defaultLangId;
                    state.pageData.langId = data.defaultLangId;
                    return state;
                })
            }

            this.setState({
                isPageLoading: false
            })
        });
    }

    ContentLanguageItem = (props: LanguageDocument) => (
        <div className="row p-0">
            <div className="col-6 text-end">
                <img width="35" src={pathUtil.uploads.flags + props.image} alt={props.shortKey}/>
            </div>
            <div className="col-6 text-start content-language-title">
                <h6>{props.title}</h6>
            </div>
        </div>
    )

    ContentLanguage = () => {
        const showingPages = [
            PagePaths.component().edit(),
            PagePaths.post().edit(),
            PagePaths.post().term().edit(),
            PagePaths.themeContent().post().edit(),
            PagePaths.themeContent().post().term().edit(),
            PagePaths.settings().seo(),
            PagePaths.settings().staticLanguages()
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
                    return {
                        ...state,
                        pageData: {
                            ...state.pageData,
                            langId: item.value
                        }
                    };
                })}
            />
        ) : null
    }

    BreadCrumb = () => {
        let breadCrumbTitles = this.state.breadCrumbTitle.split(" - ");
        return (
            <div className="page-header">
                <div className="row w-100 m-0">
                    <div className="col-md-8 p-0">
                        <h3 className="page-title">
                            <Link to="/dashboard">
                                <span className="page-title-icon bg-gradient-primary text-white me-2">
                                    <i className="mdi mdi-home"></i>
                                </span>
                            </Link>
                            {
                                breadCrumbTitles.map((breadCrumbTitle, index) => (
                                    <span>
                                        <label className="badge badge-gradient-dark ms-2">{breadCrumbTitle}</label>
                                        {
                                            breadCrumbTitles.length != (index + 1)
                                                ? <label className="badge badge-gradient-primary ms-2"><i className="mdi mdi-arrow-right"></i></label>
                                                : null
                                        }
                                    </span>
                                ))
                            }
                        </h3>
                    </div>
                    <div className="col-md-4 p-0 content-language">
                        <this.ContentLanguage/>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        const fullPageLayoutRoutes = [
            PagePaths.login(),
            PagePaths.lock()
        ];
        let isFullPageLayout = fullPageLayoutRoutes.includes(this.props.router.location.pathname);

        if (this.oldLocation !== this.props.router.location.pathname) {
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

        return (
            <AppProviders {...commonProps}>
                <Helmet>
                    <title>Admin Panel | {this.state.breadCrumbTitle}</title>
                    <meta name="description" content=""/>
                    <link rel="canonical" href={window.location.href.replace("http:", "https:")}/>
                </Helmet>
                <div className="container-scroller">
                    {!isFullPageLayout ? <Navbar {...commonProps}/> : ''}
                    <div
                        className={`container-fluid page-body-wrapper ${isFullPageLayout ? "full-page-wrapper" : ""}`}>
                        {!isFullPageLayout ? <Sidebar {...commonProps}/> : ''}
                        <div className="main-panel">
                            <div className="content-wrapper">
                                {!isFullPageLayout ? <this.BreadCrumb/> : ''}
                                <AppRoutes {...commonProps} isPageLoading={this.state.isPageLoading}/>
                            </div>
                            {!isFullPageLayout ? <Footer/> : ''}
                        </div>
                    </div>
                </div>

            </AppProviders>
        );
    }
}

export function withRouter(Component: any) {
    function ComponentWithRouterProp(props: any) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        let searchParams = useSearchParams();
        let {t, i18n} = useTranslation();

        const routes: RouteObject[] = [
            {path: PagePaths.settings().user().edit()},
            {path: PagePaths.component().edit()},
            {path: PagePaths.post().add()},
            {path: PagePaths.post().edit()},
            {path: PagePaths.post().list()},
            {path: PagePaths.post().term().add()},
            {path: PagePaths.post().term().edit()},
            {path: PagePaths.post().term().list()},
            {path: PagePaths.themeContent().post().add()},
            {path: PagePaths.themeContent().post().edit()},
            {path: PagePaths.themeContent().post().list()},
            {path: PagePaths.themeContent().post().term().add()},
            {path: PagePaths.themeContent().post().term().edit()},
            {path: PagePaths.themeContent().post().term().list()},
        ];
        let match: any = matchRoutes(routes, location);
        match = (match !== null) ? match[0] : match;
        return (
            <Component
                {...props}
                router={{location, navigate, params, searchParams, match, t, i18n}}
            />
        );
    }

    return ComponentWithRouterProp;
}

export default withRouter(AppAdmin);
