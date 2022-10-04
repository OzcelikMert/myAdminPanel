import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../../types/app/pageProps";
import {ThemeFieldSet, ThemeForm, ThemeFormSelect, ThemeFormType} from "../../../components/form";
import HandleForm from "../../../../../library/react/handles/form";
import {PermissionId, ThemeGroupTypeId, UserRoleId} from "../../../../../constants";
import settingService from "../../../../../services/setting.service";
import languageService from "../../../../../services/language.service";
import ServerInfoDocument from "../../../../../types/services/serverInfo";
import serverInfoService from "../../../../../services/serverInfo.service";
import Thread from "../../../../../library/thread";
import Spinner from "../../../tools/spinner";
import permissionUtil from "../../../../../utils/functions/permission.util";
import ThemeToast from "../../../components/toast";
import ThemeChooseImage from "../../../components/chooseImage";
import imageSourceUtil from "../../../../../utils/functions/imageSource.util";
import {SettingContactFormDocument, SettingUpdateParamDocument} from "../../../../../types/services/setting";
import {Tab, Tabs} from "react-bootstrap";
import {PostThemeGroupDocument, PostThemeGroupTypeDocument} from "../../../../../types/services/post";

type PageState = {
    languages: {label: string, value: string}[]
    isSubmitting: boolean
    isLoading: boolean
    serverInfo: ServerInfoDocument
    formData: SettingUpdateParamDocument,
    newContactForms: SettingContactFormDocument[]
    formActiveKey: string
};

type PageProps = {} & PagePropCommonDocument;

export class PageSettingsGeneral extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            languages: [],
            isSubmitting: false,
            isLoading: true,
            formActiveKey: `general`,
            newContactForms: [],
            serverInfo: {
                cpu: "0",
                storage: "0",
                memory: "0"
            },
            formData: {
                seoContents: {
                    langId: ""
                },
                contact: {}
            }
        }
    }

    componentDidMount() {
        if(!permissionUtil.checkPermissionAndRedirect(
            this.props.getSessionData.roleId,
            this.props.getSessionData.permissions,
            PermissionId.SettingEdit,
            this.props.router.navigate
        )) return;
        this.setPageTitle();
        Thread.start(() => {
            this.getServerDetails();
            this.getLanguages();
            this.getSettings();
            this.setState({
                isLoading: false
            })
        })
    }

    setPageTitle() {
        this.props.setBreadCrumb([this.props.router.t("settings"), this.props.router.t("general")])
    }

    getSettings() {
        let resData = settingService.get({})
        if (resData.status) {
            this.setState((state: PageState) => {
                resData.data.forEach(setting => {
                    state.formData = {
                        ...this.state.formData,
                        ...setting,
                        seoContents: {
                            ...this.state.formData.seoContents,
                            ...setting.seoContents,
                            title: setting.seoContents?.title || "",
                            langId: setting.defaultLangId
                        }
                    }
                })
                return state;
            })
        }
    }

    getLanguages() {
        let resData = languageService.get({})
        if (resData.status) {
            this.setState({
                languages: resData.data.map(lang => ({
                    label: lang.title,
                    value: lang._id
                }))
            })
        }
    }

    getServerDetails() {
        let resData = serverInfoService.get();
        if(resData.status){
            this.setState({
                serverInfo: resData.data
            })
        }
        this.setState({
            isLoading: false
        })
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        }, () => {
            settingService.update({
                logo: this.state.formData.logo,
                logoTwo: this.state.formData.logoTwo,
                icon: this.state.formData.icon,
                head: this.state.formData.head?.decode(),
                script: this.state.formData.script?.decode(),
                defaultLangId: this.state.formData.seoContents?.langId,
                contact: {
                    ...this.state.formData.contact
                },
                contactForms: this.state.formData.contactForms
            }).then(resData => {
                if(resData.status){
                    this.props.setPageData({
                        mainLangId: this.state.formData.seoContents?.langId
                    }, () => {
                        new ThemeToast({
                            type: "success",
                            title: this.props.router.t("successful"),
                            content: this.props.router.t("settingsUpdated")
                        })
                    });
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

    TabContactForms = () => {
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
                                    type="text"
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

    TabTools = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("head")}
                        name="head"
                        type="textarea"
                        value={this.state.formData.head?.decode()}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("script")}
                        name="script"
                        type="textarea"
                        value={this.state.formData.script?.decode()}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
            </div>
        );
    }

    TabSocialMedia = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title="Facebook"
                        name="contact.facebook"
                        type="url"
                        value={this.state.formData.contact?.facebook}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title="Instagram"
                        name="contact.instagram"
                        type="url"
                        value={this.state.formData.contact?.instagram}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title="Twitter"
                        name="contact.twitter"
                        type="url"
                        value={this.state.formData.contact?.twitter}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title="Linkedin"
                        name="contact.linkedin"
                        type="url"
                        value={this.state.formData.contact?.linkedin}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title="Google"
                        name="contact.google"
                        type="url"
                        value={this.state.formData.contact?.google}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
            </div>
        );
    }

    TabContact = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("email")}
                        name="contact.email"
                        type="email"
                        value={this.state.formData.contact?.email}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("phone")}
                        name="contact.phone"
                        type="tel"
                        value={this.state.formData.contact?.phone}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("address")}
                        name="contact.address"
                        type="text"
                        value={this.state.formData.contact?.address}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>,
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("addressMap")}
                        name="contact.addressMap"
                        type="text"
                        value={this.state.formData.contact?.addressMap}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
            </div>
        );
    }

    TabGeneral = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFieldSet legend={this.props.router.t("logo")}>
                        <ThemeChooseImage
                            {...this.props}
                            isShow={this.state["logo"]}
                            onHide={() => this.setState((state) => {
                                state["logo"] = false;
                                return state;
                            })}
                            onSelected={images => this.setState((state: PageState) => {
                                state.formData.logo = images[0];
                                return state;
                            })}
                            isMulti={false}
                        />
                        <div>
                            <img
                                src={imageSourceUtil.getUploadedImageSrc(this.state.formData.logo)}
                                alt="Empty Image"
                                className="post-image"
                            />
                            <button
                                type="button"
                                className="btn btn-gradient-warning btn-xs ms-1"
                                onClick={() => this.setState((state) => {
                                    state["logo"] = true;
                                    return state;
                                })}
                            ><i className="fa fa-pencil-square-o"></i></button>
                        </div>
                    </ThemeFieldSet>
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFieldSet legend={this.props.router.t("logo") + " - 2"}>
                        <ThemeChooseImage
                            {...this.props}
                            isShow={this.state["logoTwo"]}
                            onHide={() => this.setState((state) => {
                                state["logoTwo"] = false;
                                return state;
                            })}
                            onSelected={images => this.setState((state: PageState) => {
                                state.formData.logoTwo = images[0];
                                return state;
                            })}
                            isMulti={false}
                        />
                        <div>
                            <img
                                src={imageSourceUtil.getUploadedImageSrc(this.state.formData.logoTwo)}
                                alt="Empty Image"
                                className="post-image"
                            />
                            <button
                                type="button"
                                className="btn btn-gradient-warning btn-xs ms-1"
                                onClick={() => this.setState((state) => {
                                    state["logoTwo"] = true;
                                    return state;
                                })}
                            ><i className="fa fa-pencil-square-o"></i></button>
                        </div>
                    </ThemeFieldSet>
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFieldSet legend={this.props.router.t("icon")}>
                        <ThemeChooseImage
                            {...this.props}
                            isShow={this.state["icon"]}
                            onHide={() => this.setState((state) => {
                                state["icon"] = false;
                                return state;
                            })}
                            onSelected={images => this.setState((state: PageState) => {
                                state.formData.icon = images[0];
                                return state;
                            })}
                            isMulti={false}
                        />
                        <div>
                            <img
                                src={imageSourceUtil.getUploadedImageSrc(this.state.formData.icon)}
                                alt="Empty Image"
                                className="post-image"
                            />
                            <button
                                type="button"
                                className="btn btn-gradient-warning btn-xs ms-1"
                                onClick={() => this.setState((state) => {
                                    state["icon"] = true;
                                    return state;
                                })}
                            ><i className="fa fa-pencil-square-o"></i></button>
                        </div>
                    </ThemeFieldSet>
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormSelect
                        title={this.props.router.t("websiteMainLanguage").toCapitalizeCase()}
                        name="seoContents.langId"
                        isMulti={false}
                        isSearchable={false}
                        options={this.state.languages}
                        value={this.state.languages.findSingle("value", this.state.formData.seoContents?.langId || "")}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                    />
                </div>
            </div>
        );
    }

    ServerInfo = () => {
        return (
            <div className="col-12 grid-margin">
                <div className="card card-statistics">
                    <div className="row">
                        <div className="card-col col-xl-4 col-lg-4 col-md-4 col-6">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                                    <i className="mdi mdi-harddisk text-primary ms-0 me-sm-4 icon-lg"></i>
                                    <div className="wrapper text-center text-sm-end">
                                        <p className="card-text mb-0 text-dark">{this.props.router.t("storage")}</p>
                                        <div className="fluid-container">
                                            <h3 className="mb-0 font-weight-medium text-dark">{this.state.serverInfo.storage}%</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-col col-xl-4 col-lg-4 col-md-4 col-6">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                                    <i className="mdi mdi-memory text-primary ms-0 me-sm-4 icon-lg"></i>
                                    <div className="wrapper text-center text-sm-end">
                                        <p className="card-text mb-0 text-dark">{this.props.router.t("memory")}</p>
                                        <div className="fluid-container">
                                            <h3 className="mb-0 font-weight-medium text-dark">{this.state.serverInfo.memory}%</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-col col-xl-4 col-lg-4 col-md-4 col-6">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row">
                                    <i className="fa fa-microchip text-primary ms-0 me-sm-4 icon-lg"></i>
                                    <div className="wrapper text-center text-sm-end">
                                        <p className="card-text mb-0 text-dark">{this.props.router.t("processor")}</p>
                                        <div className="fluid-container">
                                            <h3 className="mb-0 font-weight-medium text-dark">{this.state.serverInfo.cpu}%</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return this.state.isLoading ? <Spinner /> : (
            <div className="page-settings page-dashboard page-post">
                <this.ServerInfo />
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
                                <div className="theme-tabs">
                                    <Tabs
                                        onSelect={(key: any) => this.setState({formActiveKey: key})}
                                        activeKey={this.state.formActiveKey}
                                        className="mb-5"
                                        transition={false}>
                                        <Tab eventKey="general" title={this.props.router.t("general")}>
                                            <this.TabGeneral/>
                                        </Tab>
                                        <Tab eventKey="contact" title={this.props.router.t("contact")}>
                                            <this.TabContact/>
                                        </Tab>
                                        <Tab eventKey="socialMedia" title={this.props.router.t("socialMedia")}>
                                            <this.TabSocialMedia/>
                                        </Tab>
                                        {
                                            this.props.getSessionData.roleId == UserRoleId.SuperAdmin
                                                ? <Tab eventKey="tools" title={this.props.router.t("tools")}>
                                                    <this.TabTools/>
                                                </Tab> : null
                                        }
                                        {
                                            this.props.getSessionData.roleId == UserRoleId.SuperAdmin ||
                                            this.props.getSessionData.roleId == UserRoleId.Admin
                                                ? <Tab eventKey="contactForms" title={this.props.router.t("contactForms")}>
                                                    <this.TabContactForms/>
                                                </Tab> : null
                                        }
                                    </Tabs>
                                </div>
                            </ThemeForm>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageSettingsGeneral;
