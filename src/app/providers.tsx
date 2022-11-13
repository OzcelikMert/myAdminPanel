import React, {Component} from 'react';
import {PagePropCommonDocument} from "../types/app/pageProps";
import {ErrorCodes} from "../library/api";
import {LanguageId, UserRoleId} from "../constants";
import {Navigate} from "react-router-dom";
import Spinner from "./views/tools/spinner";
import authService from "../services/auth.service";
import PagePaths from "../constants/pagePaths";
import permissionUtil from "../utils/functions/permission.util";
import ThemeToast from "./views/components/toast";

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

    componentDidUpdate(prevProps: Readonly<PageProps>, prevState: Readonly<PageState>) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        this.setState({
            isPageLoading: true,
        }, () => {
            this.checkSession(() => {
                if (this.checkPermission()) {

                }
                this.setState({
                    isPageLoading: false
                })
            });
        });
    }

    checkPermission() {
        const ignoredPaths = [
            PagePaths.login(),
            PagePaths.lock()
        ];
        if (
            !ignoredPaths.includes(this.props.router.location.pathname) &&
            !permissionUtil.checkPermissionPath(
                this.props.router.location.pathname,
                this.props.getSessionData.roleId,
                this.props.getSessionData.permissions
            )
        ) {
            new ThemeToast({
                type: "error",
                title: this.props.router.t("error"),
                content: this.props.router.t("noPerm"),
                position: "top-center"
            })
            this.props.router.navigate(PagePaths.dashboard(), {replace: true})
            return false;
        }
        return true;
    }

    checkSession(callback: Function) {
        let isRefresh = this.props.getSessionData.id.length < 1;
        let isAuth = false;
        let isPromiseCallBack = false;
        let resData = authService.getSession({isRefresh: isRefresh});
        if (resData.status && resData.errorCode == ErrorCodes.success) {
            isAuth = true;
            if (isRefresh) {
                if (resData.data.length > 0) {
                    isPromiseCallBack = true;
                    let user = resData.data[0];
                    this.props.setSessionData({
                        id: user._id,
                        langId: LanguageId.English,
                        roleId: user.roleId,
                        email: user.email,
                        image: user.image,
                        name: user.name,
                        permissions: user.permissions
                    }, () => callback());
                }
            }
        }

        if(!isPromiseCallBack){
            callback();
        }
        this.setState({
            isAuth: isAuth
        })
    }

    render() {
        return this.state.isPageLoading ? <Spinner/>
            : (
                !this.state.isAuth &&
                this.props.router.location.pathname !== PagePaths.login() &&
                this.props.router.location.pathname !== PagePaths.lock()
            )
                ? <Navigate to={PagePaths.login()}/>
                : (
                    this.state.isAuth &&
                    this.props.router.location.pathname === PagePaths.login() &&
                    this.props.router.location.pathname === PagePaths.lock()
                )
                    ? <Navigate to={PagePaths.dashboard()}/>
                    : this.props.children
    }
}

export default AppProviders;