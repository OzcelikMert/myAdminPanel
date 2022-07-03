import React, {Component} from 'react';
import {PagePropCommonDocument} from "../../modules/views/pages/pageProps";
import {pageRoutes} from "./routes";
import Services from "../../services";
import {ErrorCodes} from "../../public/ajax";
import {UserDocument} from "../../modules/ajax/result/data";
import {LanguageId} from "../../public/static";
import {Navigate} from "react-router-dom";
import {UsersGetParamDocument} from "../../modules/services/get/user";
import Spinner from "./views/tools/spinner";

type PageState = {
    isAuth: boolean
    isPageLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

class AppProviders extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            isAuth: false,
            isPageLoading: true
        }
    }

    componentDidMount() {
        this.onRouteChanged();
    }

    componentDidUpdate(prevProps:Readonly<PageProps>, prevState:Readonly<PageState>) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        this.setState({
            isPageLoading: true,
        }, () => this.checkSession());
    }

    checkSession() {
        let isRefresh = this.props.getSessionData.id < 1;
        let params: UsersGetParamDocument = {
            isRefresh: isRefresh,
            isCheckSession: true,
            requestType: "session"
        };
        let isAuth = false;
        let resData = Services.Get.users(params);
        if (resData.status && resData.errorCode == ErrorCodes.success) {
            isAuth = true;
            if (isRefresh) {
                if (resData.data.length > 0) {
                    let user: UserDocument = resData.data[0];
                    this.props.setSessionData( {
                        id: user.userId,
                        langId: LanguageId.English,
                        roleId: user.userRoleId,
                        email: user.userEmail,
                        image: user.userImage,
                        name: user.userName,
                        permissions: user.userPermissions
                    });
                }
            }
        }
        this.setState({
            isPageLoading: false,
            isAuth: isAuth
        })
    }

    render() {
        return this.state.isPageLoading ? <Spinner/>
            : (!this.state.isAuth && this.props.router.location.pathname !== pageRoutes.login.path())
                ? <Navigate to={pageRoutes.login.path()}/>
                : (this.state.isAuth && this.props.router.location.pathname === pageRoutes.login.path())
                    ? <Navigate to={pageRoutes.dashboard.path()}/>
                    : this.props.children
    }
}

export default AppProviders;