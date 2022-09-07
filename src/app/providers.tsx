import React, {Component} from 'react';
import {PagePropCommonDocument} from "../types/app/pageProps";
import {pageRoutes} from "./routes";
import {ErrorCodes} from "../library/api";
import {LanguageId} from "../constants";
import {Navigate} from "react-router-dom";
import Spinner from "./views/tools/spinner";
import authService from "../services/auth.service";

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
        let isRefresh = this.props.getSessionData.id.length < 1;
        let isAuth = false;
        let resData = authService.getSession({isRefresh: isRefresh});
        if (resData.status && resData.errorCode == ErrorCodes.success) {
            isAuth = true;
            if (isRefresh) {
                if (resData.data.length > 0) {
                    let user = resData.data[0];
                    this.props.setSessionData( {
                        id: user._id,
                        langId: LanguageId.English,
                        roleId: user.roleId,
                        email: user.email,
                        image: user.image,
                        name: user.name,
                        permissions: user.permissions
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
            : (
                !this.state.isAuth &&
                this.props.router.location.pathname !== pageRoutes.login.path() &&
                this.props.router.location.pathname !== pageRoutes.lock.path()
            )
                ? <Navigate to={pageRoutes.login.path()}/>
                : (
                    this.state.isAuth &&
                    this.props.router.location.pathname === pageRoutes.login.path() &&
                    this.props.router.location.pathname === pageRoutes.lock.path()
                )
                    ? <Navigate to={pageRoutes.dashboard.path()}/>
                    : this.props.children
    }
}

export default AppProviders;