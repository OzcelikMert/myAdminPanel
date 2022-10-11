import React, {Component, FormEvent} from 'react'
import {PagePropCommonDocument} from "../../../../../types/app/pageProps";
import {ThemeForm, ThemeFormType} from "../../../components/form";
import HandleForm from "../../../../../library/react/handles/form";
import profileService from "../../../../../services/profile.service";
import ThemeToast from "../../../components/toast";

type PageState = {
    isSubmitting: boolean
    formData: {
        password: string,
        newPassword: string,
        confirmPassword: string
    }
};

type PageProps = {} & PagePropCommonDocument;

export class PageChangePassword extends Component<PageProps, PageState> {
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
            new ThemeToast({
                type: "error",
                title: this.props.router.t("error"),
                content: this.props.router.t("passwordsNotEqual")
            })
            return;
        }

        this.setState({
            isSubmitting: true
        }, () => {
            profileService.changePassword(this.state.formData).then(resData => {
                if(resData.status) {
                    new ThemeToast({
                        type: "success",
                        title: this.props.router.t("successful"),
                        content: this.props.router.t("passwordUpdated")
                    })
                }else{
                    new ThemeToast({
                        type: "error",
                        title: this.props.router.t("error"),
                        content: this.props.router.t("wrongPassword")
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
                                            title={`${this.props.router.t("newPassword")}*`}
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
                                            title={`${this.props.router.t("confirmPassword")}*`}
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

export default PageChangePassword;
