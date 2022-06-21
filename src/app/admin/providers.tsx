import React, {Component} from 'react';
import {PagePropCommonDocument} from "../../modules/views/pages/pageProps";
import {pageRoutes} from "./routes";
import Services from "../../services";
import {ErrorCodes, ServicePages} from "../../public/ajax";
import {UserDocument} from "../../modules/ajax/result/data";
import {LanguageId} from "../../public/static";
import Statement from "../../library/statement";
import {getPageData, getSessionData, setPageData, setSessionData} from "../../config/global/";
import {Navigate} from "react-router-dom";
import Spinner from "./views/tools/spinner";
import Navbar from "./views/tools/navbar";
import Sidebar from "./views/tools/sidebar";
import Footer from "./views/tools/footer";
import {UsersGetParamDocument} from "../../modules/services/get/user";


type PageState = {
    isAuth: boolean
    isPageLoading: boolean
    isFullPageLayout: boolean,
    pageTitle: string
};

type PageProps = {} & PagePropCommonDocument;

class AppProviders extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            isAuth: false,
            isPageLoading: true,
            isFullPageLayout: true,
            pageTitle: ""
        }
    }

    componentDidMount() {
        this.onRouteChanged();
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        if (this.state.pageTitle === "") {
            this.setPageTitle();
        }
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        const fullPageLayoutRoutes = [pageRoutes.login.path()];
        this.setState({
            isPageLoading: true,
        })
        this.checkSession();
        console.log(getPageData());
        this.setState({
            isFullPageLayout: fullPageLayoutRoutes.includes(this.props.router.location.pathname),
            isPageLoading: false
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
        console.log(resData);
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
            langId: LanguageId.English
        })
    }

    PageTitle = () => (
        <div className="page-header">
            <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                    <i className="mdi mdi-home"></i>
                </span>
                {this.state.pageTitle}
            </h3>
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
                                        {this.props.children}
                                    </div>
                                    {footerComponent}
                                </div>
                            </div>
                        </div>
                    )
    }
}

export default AppProviders;