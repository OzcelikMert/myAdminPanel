import React, {Component} from 'react'
import ThemeInputType from "../../components/form/input/type";
import Services from "../../../../../services";
import {pageRoutes} from "../../../routes";
import {UserDocument} from "../../../../../modules/ajax/result/data";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import {LanguageId} from "../../../../../public/static";
import {ThemeForm, ThemeFormCheckBox} from "../../components/form";
import HandleForm from "../../../../../library/react/handles/form";
import {UsersGetParamDocument} from "../../../../../modules/services/get/user";
import {GlobalFunctions, GlobalPaths} from "../../../../../config/global";
import V from "../../../../../library/variable";
import ThemeFormLoadingButton from "../../components/form/button/loadingButton";

type PageState = {
    isSubmitting: boolean
    isWrong: boolean
    formData: {
        password: string
    }
};

type PageProps = {} & PagePropCommonDocument;

class PageLock extends Component<PageProps, PageState> {
    constructor(prop: any) {
        super(prop);
        this.state = {
            isSubmitting: false,
            isWrong: false,
            formData: {
                password: ""
            }
        }
    }

    componentDidMount() {
        if(V.isEmpty(this.props.getSessionData.email)) {
            this.props.router.navigate(pageRoutes.login.path(), {replace: true});
        }
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        }, () => {
            setTimeout(() => {
                let params: UsersGetParamDocument = {
                    requestType: "createSession",
                    email: this.props.getSessionData.email,
                };
                params = Object.assign(params, this.state.formData);
                let resData = Services.Get.users(params);
                if (resData.data.length > 0) {
                    let user: UserDocument = resData.data[0];
                    this.props.setSessionData({
                        id: user.userId
                    }, () => {
                        this.props.router.navigate(pageRoutes.dashboard.path(), {replace: true});
                    });
                }else {
                    this.setState({
                        isSubmitting: false,
                        isWrong: true
                    })
                }
            }, 1)
        })
    }

    render() {
        return (
            <div className="page-lock">
                <div className="content-wrapper d-flex align-items-center auth lock-full-bg h-100">
                    <div className="row w-100 align-items-center">
                        <div className="col-lg-4 mx-auto">
                            <div className="auth-form-transparent text-left p-5 text-center">
                                <img
                                    className="lock-profile-img"
                                    src={GlobalFunctions.getUploadedImageSrc(this.props.getSessionData.image)}
                                    alt={this.props.getSessionData.name}
                                />
                                <h4 className="text-center text-light mb-3 mt-3">{this.props.getSessionData.name}</h4>
                                <ThemeForm
                                    isSubmitting={this.state.isSubmitting}
                                    formAttributes={{onSubmit: (event) => this.onSubmit(event)}}
                                >
                                    <div className="row">
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
                                        <div className="col-md-12">
                                            {
                                                this.state.isSubmitting
                                                    ? <button className="btn btn-outline-light btn-lg font-weight-medium auth-form-btn w-100" disabled={true} type={"button"}>
                                                        <i className="fa fa-spinner fa-spin me-1"></i>
                                                        {this.props.router.t("loading") + "..."}
                                                    </button>
                                                    : <button
                                                        type="submit"
                                                        className={`btn btn-outline-${this.state.isWrong ? "danger" : "info"} btn-lg font-weight-medium auth-form-btn w-100`}
                                                    >
                                                        {this.props.router.t("login")}
                                                    </button>
                                            }
                                        </div>
                                    </div>
                                </ThemeForm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageLock;
