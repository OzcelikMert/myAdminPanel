import React, {Component, FormEvent} from 'react'
import {PagePropCommonDocument} from "../../../../../../modules/views/pages/pageProps";
import {ThemeForm, ThemeFormSelect, ThemeFormTags, ThemeFormType} from "../../../components/form";
import HandleForm from "../../../../../../library/react/handles/form";
import Services from "../../../../../../services";
import {SettingPutParamDocument} from "../../../../../../modules/services/put/setting";
import {SettingId} from "../../../../../../public/static";
import V from "../../../../../../library/variable";
import {UserPutParamDocument} from "../../../../../../modules/services/put/user";
import cogoToast from "cogo-toast";

type PageState = {
    isSubmitting: boolean
    formData: {
        password: string,
        newPassword: string,
        confirmPassword: string
    }
};

type PageProps = {} & PagePropCommonDocument;

export class PageSettingsChangePassword extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            isSubmitting: false,
            formData: {
                password: "",
                confirmPassword: "",
                newPassword: ""
            }
        }
    }

    componentDidMount() {
        this.setPageTitle();
    }

    setPageTitle() {
        this.props.setBreadCrumb([this.props.router.t("settings"), this.props.router.t("changePassword")])
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        if(this.state.formData.newPassword !== this.state.formData.confirmPassword){
            cogoToast.error("Not equals new password and confirm password. Please enter equal!", {
                heading: "Not Equals",
                hideAfter: 10,
                position: 'bottom-center'
            })
            return;
        }

        this.setState({
            isSubmitting: true
        }, () => {
            let params: UserPutParamDocument = Object.assign({
                userId: this.props.getSessionData.id
            }, this.state.formData);

            Services.Put.user(params).then(resData => {
                if(!resData.status) {
                    cogoToast.error("Wrong password. Please try again.", {
                        heading: "Wrong Password",
                        hideAfter: 10,
                        position: 'bottom-center'
                    })
                }

                this.setState({
                    isSubmitting: false
                })
            });
        })
    }

    render() {
        return (
            <div className="page-settings">
                <div className="grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <ThemeForm
                                isActiveSaveButton={true}
                                saveButtonText={this.props.router.t("save")}
                                saveButtonLoadingText={this.props.router.t("loading")}
                                isSubmitting={this.state.isSubmitting}
                                formAttributes={{onSubmit: (event) => this.onSubmit(event)}}
                            >
                                <div className="row">
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormType
                                            title={`${this.props.router.t("password")}*`}
                                            name="password"
                                            type="password"
                                            autoComplete={"new-password"}
                                            required={true}
                                            value={this.state.formData.password}
                                            onChange={e => HandleForm.onChangeInput(e, this)}
                                        />
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormType
                                            title={`${this.props.router.t("newPassword").toCapitalizeCase()}*`}
                                            name="newPassword"
                                            type="password"
                                            autoComplete={"new-password"}
                                            required={true}
                                            value={this.state.formData.newPassword}
                                            onChange={e => HandleForm.onChangeInput(e, this)}
                                        />
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormType
                                            title={`${this.props.router.t("confirmPassword").toCapitalizeCase()}*`}
                                            name="confirmPassword"
                                            type="password"
                                            autoComplete={"new-password"}
                                            required={true}
                                            value={this.state.formData.confirmPassword}
                                            onChange={e => HandleForm.onChangeInput(e, this)}
                                        />
                                    </div>
                                </div>
                            </ThemeForm>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageSettingsChangePassword;
