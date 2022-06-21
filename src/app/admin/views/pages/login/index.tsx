import React, {Component} from 'react'
import ThemeInputType from "../../components/form/input/type";
import {setPageData, setSessionData} from "../../../../../config/global";
import Services from "../../../../../services";
import {pageRoutes} from "../../../routes";
import {UserDocument} from "../../../../../modules/ajax/result/data";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import {LanguageId} from "../../../../../public/static";
import {ThemeForm, ThemeFormCheckBox} from "../../components/form";
import HandleForm from "../../../../../library/react/handles/form";
import {UsersGetParamDocument} from "../../../../../modules/services/get/user";


type PageState = {
    isSubmitting: boolean
    formData: {
        email: string,
        password: string,
        keepMe: 1 | 0
    }
};

type PageProps = {} & PagePropCommonDocument;

class PageLogin extends Component<PageProps, PageState> {
    constructor(prop: any) {
        super(prop);
        this.state = {
            isSubmitting: false,
            formData: {
                email: "",
                password: "",
                keepMe: 0
            }
        }
    }

    setPageTitle() {
        setPageData({
            title: `
                ${this.props.router.t("login")}
            `
        })
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        })
        let params: UsersGetParamDocument = {
            requestType: "session"
        };
        params = Object.assign(params, this.state.formData);
        let resData = Services.Get.users(params);
        if (resData.data.length > 0) {
            let user: UserDocument = resData.data[0];
            setSessionData({
                id: user.userId,
                langId: LanguageId.English,
                roleId: user.userRoleId,
                email: user.userEmail,
                image: user.userEmail,
                name: user.userName,
                permissions: user.userPermissions,
            });
            this.props.router.navigate(pageRoutes.dashboard.path(), {replace: true});
        }
        this.setState({
            isSubmitting: false
        })
    }

    render() {
        this.setPageTitle();
        return (
            <div className="page-login">
                <div className="d-flex align-items-stretch auth auth-img-bg h-100">
                    <div className="row flex-grow">
                        <div
                            className="col-lg-6 d-flex align-items-center justify-content-center bg-white login-half-form">
                            <div className="auth-form-transparent text-left p-3">
                                <div className="brand-logo">
                                    {
                                        //<img src="/demo/purple/react/template/demo_1/preview/static/media/logo.a79624ec.svg" alt="logo" />
                                    }
                                </div>
                                <h4 className="text-center">{this.props.router.t("loginPanel")}</h4>
                                <ThemeForm
                                    isSubmitting={this.state.isSubmitting}
                                    formAttributes={{onSubmit: (event) => this.onSubmit(event)}}
                                >
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <ThemeInputType
                                                title={this.props.router.t("email")}
                                                type="text"
                                                name="email"
                                                required={true}
                                                value={this.state.formData.email}
                                                onChange={e => HandleForm.onChangeInput(e, this)}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <ThemeInputType
                                                title={this.props.router.t("password")}
                                                type="password"
                                                name="password"
                                                required={true}
                                                value={this.state.formData.password}
                                                onChange={e => HandleForm.onChangeInput(e, this)}
                                            />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <ThemeFormCheckBox
                                                name={this.props.router.t("keepMe")}
                                                title="Keep me signed in"
                                                checked={Boolean(this.state.formData.keepMe)}
                                                onChange={e => HandleForm.onChangeInput(e, this)}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <button
                                                type="submit"
                                                className="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn w-100"
                                                disabled={this.state.isSubmitting}
                                            >
                                                {this.props.router.t("login")}
                                            </button>
                                        </div>
                                    </div>
                                </ThemeForm>
                            </div>
                        </div>
                        <div className="col-lg-6 login-half-bg d-flex flex-row"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageLogin;
