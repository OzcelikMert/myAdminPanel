import React, {Component} from 'react';
import {PagePropCommonDocument} from "types/app/pageProps";
import {LanguageId} from "constants/index";
import {Navigate} from "react-router-dom";
import Spinner from "components/tools/spinner";
import authService from "services/auth.service";
import PagePaths from "constants/pagePaths";
import permissionUtil from "utils/permission.util";
import ThemeToast from "components/toast";
import {ErrorCodes} from "library/api";

type PageState = {
    permissionIsValid: boolean
    isPageLoading: boolean
};

type PageProps = {
    isFullPage: boolean
} & PagePropCommonDocument;

export default class ProviderPermission extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            permissionIsValid: true,
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
        }, async () => {
            await this.checkPermission();
            this.setState({
                isPageLoading: false
            })
        });
    }

    async checkPermission() {
        let permissionIsValid = true;
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
            permissionIsValid = false;
            new ThemeToast({
                type: "error",
                title: this.props.router.t("error"),
                content: this.props.router.t("noPerm"),
                position: "top-center"
            });
        }

        await new Promise( resolve => {
            this.setState({
                permissionIsValid: permissionIsValid,
            }, () => {
                resolve(1)
            });
        })
    }

    render() {
        return this.state.isPageLoading ? <Spinner isFullPage={this.props.isFullPage}/>
            : this.state.permissionIsValid
                ? this.props.children
                : <Navigate to={PagePaths.dashboard()}/>
    }
}