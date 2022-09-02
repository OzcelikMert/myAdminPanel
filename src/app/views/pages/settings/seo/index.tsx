import React, {Component} from 'react'
import {ThemeForm, ThemeFormSelect, ThemeFormTags, ThemeFormType} from "../../../components/form";
import {PagePropCommonDocument} from "../../../../../types/app/pageProps";
import HandleForm from "../../../../../library/react/handles/form";
import {PermissionId, SeoTitleSeparators, SettingId} from "../../../../../public/static";
import seoService from "../../../../../services/seo.service";
import settingService from "../../../../../services/setting.service";
import Thread from "../../../../../library/thread";
import Spinner from "../../../tools/spinner";
import staticContentUtil from "../../../../../utils/functions/staticContent.util";
import permissionUtil from "../../../../../utils/functions/permission.util";
import ThemeToast from "../../../components/toast";

type PageState = {
    separators: { label: string, value: any }[]
    isSubmitting: boolean
    isLoading: boolean
    formData: {
        langId: number
        title: string
        content: string
        tags: string[]
        separatorId: number
    }
};

type PageProps = {} & PagePropCommonDocument;

class PageSettingsSEO extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            separators: staticContentUtil.getSeoTitleSeparatorForSelect(),
            isSubmitting: false,
            isLoading: true,
            formData: {
                langId: this.props.getPageData.mainLangId,
                title: "",
                content: "",
                tags: [],
                separatorId: SeoTitleSeparators[0].id
            }
        }
    }

    componentDidMount() {
        if(!permissionUtil.checkPermissionAndRedirect(
            this.props.getSessionData.roleId,
            this.props.getSessionData.permissions,
            PermissionId.SeoEdit,
            this.props.router.navigate
        )) return;
        this.setPageTitle()
        Thread.start(() => {
            this.getSeo();
            this.getSettings();
            this.setState({
                isLoading: false
            })
        })
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        if(this.state.formData.langId != this.props.getPageData.langId){
            this.setState((state: PageState) => {
                state.formData.langId = this.props.getPageData.langId;
                state.isLoading = true;
                return state;
            }, () => {
                Thread.start(() => {
                    this.getSeo()
                    this.setState({
                        isLoading: false
                    })
                })
            })
        }
    }

    setPageTitle() {
        this.props.setBreadCrumb([this.props.router.t("settings"), this.props.router.t("seo")])
    }

    getSeo() {
        let resData = seoService.get({
            langId: this.state.formData.langId
        });

        if (resData.status) {
            this.setState((state: PageState) => {
                if(resData.data.length > 0){
                    let seo = resData.data[0];
                    state.formData = Object.assign(state.formData, {
                        title: seo.seoContentTitle,
                        content: seo.seoContent,
                        tags: seo.seoContentTags,
                    });
                }else {
                    state.formData = Object.assign(state.formData, {
                        title: "",
                        content: "",
                        tags: [],
                    });
                }

                return state;
            })
        }
    }

    getSettings() {
        let resData = settingService.get({
            id: SettingId.WebsiteTitleSeparator
        })

        if (resData.status) {
            this.setState((state: PageState) => {
                if(resData.data.length > 0){
                    let settings = resData.data;
                    state.formData.separatorId = Number(settings.findSingle("settingId", SettingId.WebsiteTitleSeparator).settingValue);
                }

                return state;
            })
        }
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        this.setState({
            isSubmitting: true
        })

        seoService.update(this.state.formData).then(resData => {
            if(resData.status){
                new ThemeToast({
                    type: "success",
                    title: this.props.router.t("successful"),
                    content: this.props.router.t("seoUpdated")
                })
            }
            this.setState((state: PageState) => {
                state.isSubmitting = false;
                return state;
            })
        })
    }

    render() {
        return this.state.isLoading ? <Spinner /> : (
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
                                            title={this.props.router.t("websiteTitle")}
                                            type="text"
                                            name="title"
                                            required={true}
                                            maxLength={50}
                                            value={this.state.formData.title}
                                            onChange={(event) => HandleForm.onChangeInput(event, this)}
                                        />
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormType
                                            title={this.props.router.t("websiteDescription")}
                                            type="textarea"
                                            name="content"
                                            required={true}
                                            maxLength={120}
                                            value={this.state.formData.content}
                                            onChange={(event) => HandleForm.onChangeInput(event, this)}
                                        />
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormTags
                                            title={this.props.router.t("websiteTags")}
                                            placeHolder={this.props.router.t("writeAndPressEnter")}
                                            name="tags"
                                            value={this.state.formData.tags}
                                            onChange={(value, name) => HandleForm.onChangeSelect(name, value, this)}
                                        />
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormSelect
                                            title={this.props.router.t("websiteTitleSeparator")}
                                            placeholder={this.props.router.t("websiteTitleSeparator")}
                                            name="separatorId"
                                            isMulti={false}
                                            isSearchable={false}
                                            options={this.state.separators}
                                            value={this.state.separators.findSingle("value", this.state.formData.separatorId)}
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

export default PageSettingsSEO;
