import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../../types/app/pageProps";
import {ThemeForm, ThemeFormSelect} from "../../../components/form";
import HandleForm from "../../../../../library/react/handles/form";
import {PermissionId, SettingId} from "../../../../../public/static";
import settingService from "../../../../../services/setting.service";
import languageService from "../../../../../services/language.service";
import ServerInfoDocument from "../../../../../types/services/serverInfo";
import serverInfoService from "../../../../../services/serverInfo.service";
import Thread from "../../../../../library/thread";
import Spinner from "../../../tools/spinner";
import permissionUtil from "../../../../../utils/functions/permission.util";
import ThemeToast from "../../../components/toast";

type PageState = {
    languages: {label: string, value: any}[]
    isSubmitting: boolean
    isLoading: boolean
    serverInfo: ServerInfoDocument
    formData: {
        langId: number
    }
};

type PageProps = {} & PagePropCommonDocument;

export class PageSettingsGeneral extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            languages: [],
            isSubmitting: false,
            isLoading: true,
            serverInfo: {
                cpu: "0",
                storage: "0",
                memory: "0"
            },
            formData: {
                langId: 1
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
                    switch(setting.settingId){
                        case SettingId.WebsiteMainLanguage: state.formData.langId = Number(setting.settingValue); break;
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
                    label: lang.langTitle,
                    value: lang.langId
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
        })
        settingService.update({
            settings: [
                {id: SettingId.WebsiteMainLanguage, value: this.state.formData.langId.toString()}
            ]
        }).then(resData => {
            if(resData.status){
                this.props.setPageData({
                    mainLangId: this.state.formData.langId
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
            <div className="page-settings page-dashboard">
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
                                <div className="row">
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormSelect
                                            title={this.props.router.t("websiteMainLanguage").toCapitalizeCase()}
                                            name="langId"
                                            isMulti={false}
                                            isSearchable={false}
                                            options={this.state.languages}
                                            value={this.state.languages.findSingle("value", this.state.formData.langId)}
                                            onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
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

export default PageSettingsGeneral;
