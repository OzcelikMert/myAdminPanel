import React, {Component} from 'react'
import {PagePropCommonDocument} from "types/app/pageProps";
import {ThemeFieldSet, ThemeForm, ThemeFormType} from "components/form";
import {UserRoleId} from "constants/index";
import settingService from "services/setting.service";
import Thread from "library/thread";
import Spinner from "components/tools/spinner";
import ThemeToast from "components/toast";
import {SettingContactFormDocument, SettingContactFormUpdateParamDocument} from "types/services/setting";

type PageState = {
    isSubmitting: boolean
    isLoading: boolean
    formData: SettingContactFormUpdateParamDocument
    newContactForms: SettingContactFormDocument[]
    formActiveKey: string
};

type PageProps = {} & PagePropCommonDocument;

class PageSettingsContactForms extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            isSubmitting: false,
            isLoading: true,
            formActiveKey: `general`,
            newContactForms: [],
            formData: {
                contactForms: []
            }
        }
    }

   async componentDidMount() {
        this.setPageTitle();
        await this.getSettings();
        this.setState({
            isLoading: false
        })
    }

    setPageTitle() {
        this.props.setBreadCrumb([this.props.router.t("settings"), this.props.router.t("contactForms")])
    }

    async getSettings() {
        let resData = await settingService.get({})
        if (resData.status) {
            this.setState((state: PageState) => {
                resData.data.forEach(setting => {
                    state.formData = {
                        contactForms: setting.contactForms ?? []
                    }
                })
                return state;
            })
        }
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        }, () => {
            settingService.updateContactForm(this.state.formData).then(resData => {
                if(resData.status){
                    new ThemeToast({
                        type: "success",
                        title: this.props.router.t("successful"),
                        content: this.props.router.t("settingsUpdated")
                    })
                }

                this.setState((state: PageState) => {
                    state.isSubmitting = false;
                    return state;
                })
            })
        })
    }

    get TabContactFormEvents() {
        let self = this;
        return {
            onInputChange(data: any, key: string, value: any) {
                self.setState((state: PageState) => {
                    data[key] = value;
                    return state;
                })
            },
            onCreate() {
                self.setState((state: PageState) => {
                    state.newContactForms.push({
                        _id: String.createId(),
                        key: "",
                        port: 465,
                        outGoingServer: "",
                        inComingServer: "",
                        name: "",
                        password: "",
                        email: ""
                    })
                    return state;
                })
            },
            onAccept(_id: string) {
                self.setState((state: PageState) => {
                    let findIndex = state.newContactForms.indexOfKey("_id", _id);
                    if (findIndex > -1) {
                        if (typeof state.formData.contactForms === "undefined") {
                            state.formData.contactForms = [];
                        }
                        state.formData.contactForms.push(state.newContactForms[findIndex]);
                        state.newContactForms = state.newContactForms.filter(themeGroup => themeGroup._id != state.newContactForms[findIndex]._id);
                    }

                    return state;
                })
            },
            onDelete(data: any, index: number) {
                self.setState((state: PageState) => {
                    data.splice(index, 1);
                    return state;
                })
            },
            onEdit(data: any, index: number) {
                self.setState((state: PageState) => {
                    state.newContactForms.push(data[index]);
                    data.splice(index, 1);
                    return state;
                })
            }
        }
    }

    ContactForms = () => {
        const ContactForm = (contactFormProps: SettingContactFormDocument, contactFormIndex: number) => {
            return (
                <div className="col-md-12 mt-4">
                    <ThemeFieldSet
                        legend={`${this.props.router.t("contactForm")} (#${contactFormProps.key})`}
                        legendElement={
                            this.props.getSessionData.roleId == UserRoleId.SuperAdmin
                                ? <i className="mdi mdi-pencil-box text-warning fs-3 cursor-pointer"
                                     onClick={() => this.TabContactFormEvents.onEdit(this.state.formData.contactForms, contactFormIndex)}></i>
                                : undefined
                        }
                    >
                        <div className="row">
                            <div className="col-md-12 mt-4">
                                <ThemeFormType
                                    type="text"
                                    title={this.props.router.t("name")}
                                    value={contactFormProps.name}
                                    onChange={e => this.TabContactFormEvents.onInputChange(contactFormProps, "name", e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 mt-4">
                                <ThemeFormType
                                    type="text"
                                    title={this.props.router.t("email")}
                                    value={contactFormProps.email}
                                    onChange={e => this.TabContactFormEvents.onInputChange(contactFormProps, "email", e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 mt-4">
                                <ThemeFormType
                                    type="password"
                                    title={this.props.router.t("password")}
                                    value={contactFormProps.password}
                                    onChange={e => this.TabContactFormEvents.onInputChange(contactFormProps, "password", e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 mt-4">
                                <ThemeFormType
                                    type="text"
                                    title={this.props.router.t("outGoingServer")}
                                    value={contactFormProps.outGoingServer}
                                    onChange={e => this.TabContactFormEvents.onInputChange(contactFormProps, "outGoingServer", e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 mt-4">
                                <ThemeFormType
                                    type="text"
                                    title={this.props.router.t("inComingServer")}
                                    value={contactFormProps.inComingServer}
                                    onChange={e => this.TabContactFormEvents.onInputChange(contactFormProps, "inComingServer", e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 mt-4">
                                <ThemeFormType
                                    type="text"
                                    title={this.props.router.t("port")}
                                    value={contactFormProps.port}
                                    onChange={e => this.TabContactFormEvents.onInputChange(contactFormProps, "port", e.target.value)}
                                />
                            </div>
                        </div>
                    </ThemeFieldSet>
                </div>
            )
        }

        const NewContactForm = (contactFormProps: SettingContactFormDocument, contactFormIndex: number) => {
            return (
                <div className="col-md-12 mt-3">
                    <ThemeFieldSet legend={this.props.router.t("newContactForm")}>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <ThemeFormType
                                    title={`${this.props.router.t("key")}*`}
                                    type="text"
                                    required={true}
                                    value={contactFormProps.key}
                                    onChange={e => this.TabContactFormEvents.onInputChange(contactFormProps, "key", e.target.value)}
                                />
                            </div>
                            <div className="col-md-12 mt-3">
                                <button type={"button"} className="btn btn-gradient-success btn-lg"
                                        onClick={() => this.TabContactFormEvents.onAccept(contactFormProps._id || "")}>{this.props.router.t("okay")}</button>
                                <button type={"button"} className="btn btn-gradient-danger btn-lg"
                                        onClick={() => this.TabContactFormEvents.onDelete(this.state.newContactForms, contactFormIndex)}>{this.props.router.t("delete")}</button>
                            </div>
                        </div>
                    </ThemeFieldSet>
                </div>
            )
        }

        return (
            <div className="row">
                {
                    this.props.getSessionData.roleId == UserRoleId.SuperAdmin
                        ? <div className="col-md-7">
                            <button type={"button"} className="btn btn-gradient-success btn-lg"
                                    onClick={() => this.TabContactFormEvents.onCreate()}>+ {this.props.router.t("newContactForm")}
                            </button>
                        </div> : null
                }
                <div className="col-md-7 mt-2">
                    <div className="row">
                        {
                            this.state.newContactForms.map((themeGroup, index) => NewContactForm(themeGroup, index))
                        }
                    </div>
                    <div className="row">
                        {
                            this.state.formData.contactForms?.map((themeGroup, index) => ContactForm(themeGroup, index))
                        }
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return this.state.isLoading ? <Spinner /> : (
            <div className="page-settings page-dashboard page-post">
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
                                <this.ContactForms />
                            </ThemeForm>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageSettingsContactForms;
