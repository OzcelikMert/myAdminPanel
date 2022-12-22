import React, {Component} from 'react';
import 'styles/index.scss';
import {
    useLocation,
    useNavigate,
    useParams, useSearchParams, matchRoutes, RouteObject, Link
} from "react-router-dom";
import {PagePropCommonDocument} from "types/app/pageProps";
import {useTranslation} from "react-i18next";
import {LanguageId} from "constants/index";
import Navbar from "components/tools/navbar";
import Sidebar from "components/tools/sidebar";
import Footer from "components/tools/footer";
import Statement from "library/statement";
import {AppAdminGetState, AppAdminSetState} from "types/app/views";
import languageService from "services/language.service";
import settingService from "services/setting.service";
import LanguageDocument from "types/services/language";
import {Helmet} from "react-helmet";
import AppRoutes from "./routes";
import PagePaths from "constants/pagePaths";
import ThemeBreadCrumb from "components/breadCrumb";
import ThemeContentLanguage from "components/contentLanguage";
import ProviderAuth from "./providers/providerAuth";
import ProviderPermission from "./providers/providerPermission";


type PageState = {
    contentLanguages: LanguageDocument[],
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
            contentLanguages: [],
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

    async componentDidMount() {
        await this.onRouteChanged();
        await this.getContentLanguages();
        await this.getContentMainLanguage();
    }

    async componentDidUpdate(prevProps: Readonly<PageProps>, prevState: Readonly<PageState>) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            await this.onRouteChanged();
        }
    }

    async onRouteChanged() {
        this.setState({
            isPageLoading: true,
        }, async () => {
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

    async getContentLanguages() {
        this.setState({
            isPageLoading: true,
        }, async () => {
            let resData = await languageService.get({});
            if (resData.status) {
                this.setState({
                    contentLanguages: resData.data
                })
            }

            this.setState({
                isPageLoading: false
            })
        });

    }

    async getContentMainLanguage() {
        this.setState({
            isPageLoading: true,
        }, async () => {
            let resData = await settingService.get({})
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
            <>
                <Helmet>
                    <title>Admin Panel | {this.state.breadCrumbTitle}</title>
                    <meta name="description" content=""/>
                    <link rel="canonical" href={window.location.href.replace("http:", "https:")}/>
                </Helmet>
                <div className="container-scroller">
                    {!isFullPageLayout && this.state.sessionData.id.length > 0 ? <Navbar {...commonProps}/> : null}
                    <div
                        className={`container-fluid page-body-wrapper ${isFullPageLayout ? "full-page-wrapper" : ""}`}>
                        {!isFullPageLayout && this.state.sessionData.id.length > 0 ? <Sidebar {...commonProps}/> : null}
                        <ProviderAuth {...commonProps} isFullPage={isFullPageLayout}>
                            <ProviderPermission {...commonProps} isFullPage={isFullPageLayout}>
                                <div className="main-panel">
                                    <div className="content-wrapper">
                                        {
                                            !isFullPageLayout ?
                                                <div className="page-header">
                                                    <div className="row w-100 m-0">
                                                        <div className="col-md-8 p-0">
                                                            <ThemeBreadCrumb
                                                                breadCrumbs={this.state.breadCrumbTitle.split(" - ")}/>
                                                        </div>
                                                        <div className="col-md-4 p-0 content-language">
                                                            <ThemeContentLanguage
                                                                router={this.props.router}
                                                                options={this.state.contentLanguages}
                                                                value={this.state.contentLanguages.findSingle("_id", this.state.pageData.langId)}
                                                                onChange={(item, e) => this.setState((state: PageState) => {
                                                                    return {
                                                                        ...state,
                                                                        pageData: {
                                                                            ...state.pageData,
                                                                            langId: item.value
                                                                        }
                                                                    };
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div> : null
                                        }
                                        <AppRoutes {...commonProps} isPageLoading={this.state.isPageLoading} isFullPage={isFullPageLayout}/>
                                    </div>
                                    {!isFullPageLayout ? <Footer/> : ''}
                                </div>
                            </ProviderPermission>
                        </ProviderAuth>
                    </div>
                </div>
            </>
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
