import React, {Component} from 'react';
import {PagePropCommonDocument} from "../../modules/views/pages/pageProps";
import AppRoutes, {pageRoutes} from "./routes";
import Services from "../../services";
import {ErrorCodes, ServicePages} from "../../public/ajax";
import {LanguageDocument, UserDocument} from "../../modules/ajax/result/data";
import {LanguageId, SettingId, StatusContents} from "../../public/static";
import Statement from "../../library/statement";
import {getPageData, getSessionData, GlobalFunctions, setPageData, setSessionData} from "../../config/global/";
import {Navigate} from "react-router-dom";
import Spinner from "./views/tools/spinner";
import Navbar from "./views/tools/navbar";
import Sidebar from "./views/tools/sidebar";
import Footer from "./views/tools/footer";
import {UsersGetParamDocument} from "../../modules/services/get/user";
import {ThemeFormSelect} from "./views/components/form";
import {GlobalPaths} from "../../config/global";
import HandleForm from "../../library/react/handles/form";

type PageState = {
    isAuth: boolean
    isPageLoading: boolean
    isFullPageLayout: boolean,
    pageTitle: string
    contentLanguages: {label: string | JSX.Element, value: any}[],
    formData: {
        contentLanguageId: number
    }
};

type PageProps = {} & PagePropCommonDocument;

class AppProviders extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            isAuth: false,
            isPageLoading: true,
            isFullPageLayout: true,
            pageTitle: "",
            contentLanguages: [],
            formData: {
                contentLanguageId: 1
            }
        }
    }

    componentDidMount() {
        this.getContentLanguages();
        this.onRouteChanged();
    }

    componentDidUpdate(prevProps:Readonly<PageProps>, prevState:Readonly<PageState>) {
        if (this.state.pageTitle === "" || this.state.pageTitle !== getPageData().title) {
            this.setPageTitle();
        }

        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.onRouteChanged();
        }

        if(this.state.formData.contentLanguageId != getPageData().langId){

        }
    }

    getContentLanguages() {
        let resData = Services.Get.languages({})
        if(resData.status){
            this.setState({
                contentLanguages: resData.data.map((lang, index) => ({
                    label: <this.ContentLanguageItem {...lang} key={index}/>,
                    value: lang.langId
                }))
            })
        }
    }

    onRouteChanged() {
        const fullPageLayoutRoutes = [pageRoutes.login.path()];
        this.setState({
            isPageLoading: true,
        })
        this.checkSession();
        this.setState((state: PageState) => {
            state.isFullPageLayout = fullPageLayoutRoutes.includes(this.props.router.location.pathname);
            state.isPageLoading = false;
            state.formData.contentLanguageId = 1;
            return state;
        })
        this.setPageTitle();
    }

    setPageTitle() {
        this.setState({
            pageTitle: getPageData().title
        })
    }

    checkSession() {
        let isRefresh = getSessionData().id < 1;
        let params: UsersGetParamDocument = {
            isRefresh: isRefresh,
            isCheckSession: true,
            requestType: "session"
        };
        let resData = Services.Get.users(params);
        if (!resData.status || resData.errorCode == ErrorCodes.notLoggedIn) {
            this.setState({
                isAuth: false
            })
        } else {
            if (isRefresh) {
                if (resData.data.length > 0) {
                    let user: UserDocument = resData.data[0];
                    setSessionData({
                        id: user.userId,
                        langId: LanguageId.English,
                        roleId: user.userRoleId,
                        email: user.userEmail,
                        image: user.userImage,
                        name: user.userName,
                        permissions: user.userPermissions,
                    });
                }
            }
            this.setState({
                isAuth: true
            })
        }
    }

    initPageData() {
        let searchParams: any = {};
        if (this.props.router.match !== null) {
            Statement.Foreach(this.props.router.match?.params, (key, value) => {
                searchParams[key] = value;
            })
        }
        setPageData({
            searchParams: searchParams,
            langId: this.state.formData.contentLanguageId
        })
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
            pageRoutes.post.path() + pageRoutes.post.edit.path(),
            pageRoutes.postTerm.path() + pageRoutes.postTerm.edit.path(),
            pageRoutes.settings.path() + pageRoutes.settings.seo.path()
        ];

        let isShow = showingPages.map(page => {
            if(
                this.props.router.match &&
                this.props.router.match.route
            ){
                return this.props.router.match.route.path.indexOf(page) > -1
            }
            return this.props.router.location.pathname.indexOf(page) > -1
        }).includes(true);

        return isShow ? (
            <ThemeFormSelect
                title="Content Language"
                name="contentLanguageId"
                isSearchable={false}
                options={this.state.contentLanguages}
                value={this.state.contentLanguages.findSingle("value", this.state.formData.contentLanguageId)}
                onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
            />
        ) : null
    }

    PageTitle = () => (
        <div className="page-header">
            <div className="row w-100 m-0">
                <div className="col-md-8 p-0">
                    <h3 className="page-title">
                        <span className="page-title-icon bg-gradient-primary text-white me-2">
                            <i className="mdi mdi-home"></i>
                        </span>
                        {this.state.pageTitle}
                    </h3>
                </div>
                <div className="col-md-4 p-0 content-language">
                    <this.ContentLanguage />
                </div>
            </div>
        </div>
    );

    render() {
        this.initPageData();
        let pageTitle = !this.state.isFullPageLayout ? <this.PageTitle/> : '';
        let navbarComponent = !this.state.isFullPageLayout ? <Navbar/> : '';
        let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar router={this.props.router}/> : '';
        let footerComponent = !this.state.isFullPageLayout ? <Footer/> : '';
        return (this.state.isPageLoading) ? <Spinner/>
            : (!this.state.isAuth && this.props.router.location.pathname !== pageRoutes.login.path())
                ? <Navigate to={pageRoutes.login.path()}/>
                : (this.state.isAuth && this.props.router.location.pathname === pageRoutes.login.path())
                    ? <Navigate to={pageRoutes.dashboard.path()}/>
                    : (
                        <div className="container-scroller">
                            {navbarComponent}
                            <div
                                className={`container-fluid page-body-wrapper ${this.state.isFullPageLayout ? "full-page-wrapper" : ""}`}>
                                {sidebarComponent}
                                <div className="main-panel">
                                    <div className="content-wrapper">
                                        {pageTitle}
                                        <AppRoutes router={this.props.router}/>
                                    </div>
                                    {footerComponent}
                                </div>
                            </div>
                        </div>
                    )
    }
}

export default AppProviders;