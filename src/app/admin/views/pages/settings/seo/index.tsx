import React, {Component} from 'react'
import {ThemeForm, ThemeFormSelect, ThemeFormTags, ThemeFormType} from "../../../components/form";
import {PagePropCommonDocument} from "../../../../../../modules/views/pages/pageProps";
import HandleForm from "../../../../../../library/react/handles/form";
import {getPageData, GlobalFunctions, setPageData} from "../../../../../../config/global";
import {SeoTitleSeparators, SettingId} from "../../../../../../public/static";
import Services from "../../../../../../services";
import {SeoPostParamDocument} from "../../../../../../modules/services/post/seo";
import {SeoGetParamDocument} from "../../../../../../modules/services/get/seo";
import {SettingGetParamDocument} from "../../../../../../modules/services/get/setting";

type PageState = {
    separators: { label: string, value: any }[]
    isSubmitting: boolean
    formData: {
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
            separators: GlobalFunctions.getSeoTitleSeparatorForSelect(),
            isSubmitting: false,
            formData: {
                title: "",
                content: "",
                tags: [],
                separatorId: SeoTitleSeparators[0].id
            }
        }
    }

    componentDidMount() {
        this.getSeo();
    }

    setPageTitle() {
        setPageData({
            title: this.props.router.t("seo")
        })
    }

    getSeo() {
        let params: SeoGetParamDocument & SettingGetParamDocument = {
            langId: getPageData().langId,
            id: SettingId.WebsiteTitleSeparator
        }

        let resDataSeo = Services.Get.seo(params);
        let resDataSetting = Services.Get.settings(params)

        if (resDataSeo.status && resDataSetting.status) {
            if (resDataSeo.data.length > 0) {
                this.setState((state: PageState) => {
                    let seo = resDataSeo.data[0];
                    state.formData = {
                        title: seo.seoContentTitle,
                        content: seo.seoContent,
                        tags: seo.seoContentTags,
                        separatorId:
                            resDataSetting.data.length > 0
                                ? Number(resDataSetting.data[0].settingValue)
                                : 1
                    }
                    return state;
                })
            }
        }
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        })
        let params: SeoPostParamDocument = Object.assign({
            langId: getPageData().langId
        }, this.state.formData);

        Services.Post.seo(params).then(resData => {
            if (resData.status) {
                Services.Put.setting({
                    settings: [
                        {id: SettingId.WebsiteTitleSeparator, value: this.state.formData.separatorId.toString()}
                    ]
                }).then(resData => {
                    this.setState((state: PageState) => {
                        state.isSubmitting = false;
                        return state;
                    })
                })
            }
        })
    }

    render() {
        this.setPageTitle();
        return (
            <div className="page-settings">
                <div className="gird-margin stretch-card">
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
                                            title={this.props.router.t("websiteTitle").toCapitalizeCase()}
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
                                            title={this.props.router.t("websiteDescription").toCapitalizeCase()}
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
                                            title={this.props.router.t("websiteTags").toCapitalizeCase()}
                                            placeHolder="Write and press enter."
                                            name="tags"
                                            value={this.state.formData.tags}
                                            onChange={(value, name) => HandleForm.onChangeSelect(name, value, this)}
                                        />
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormSelect
                                            title={this.props.router.t("websiteTitleSeparator").toCapitalizeCase()}
                                            placeholder="Select Role"
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
