import React, {Component} from 'react'
import {ThemeForm, ThemeFormTags, ThemeFormType} from "components/form";
import {PagePropCommonDocument} from "types/app/pageProps";
import HandleForm from "library/react/handles/form";
import settingService from "services/setting.service";
import Thread from "library/thread";
import Spinner from "components/tools/spinner";
import ThemeToast from "components/toast";
import {SettingSeoUpdateParamDocument} from "types/services/setting";

type PageState = {
    isSubmitting: boolean
    isLoading: boolean
    formData: SettingSeoUpdateParamDocument
};

type PageProps = {} & PagePropCommonDocument;

class PageSettingsSEO extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            isSubmitting: false,
            isLoading: true,
            formData: {
                seoContents: {
                    langId: this.props.getPageData.mainLangId,
                    title: "",
                    content: "",
                    tags: [],
                }
            }
        }
    }

    async componentDidMount() {
        this.setPageTitle()
        await this.getSeo();
        this.setState({
            isLoading: false
        })
    }

    async componentDidUpdate(prevProps: Readonly<PageProps>) {
        if (prevProps.getPageData.langId != this.props.getPageData.langId) {
            this.setState((state: PageState) => {
                state.isLoading = true;
                return state;
            }, async () => {
                await this.getSeo()
                this.setState({
                    isLoading: false
                })
            })
        }
    }

    setPageTitle() {
        this.props.setBreadCrumb([this.props.router.t("settings"), this.props.router.t("seo")])
    }

    async getSeo() {
        let resData = await settingService.get({langId: this.props.getPageData.langId});

        if (resData.status) {
            this.setState((state: PageState) => {
                if (resData.data.length > 0) {
                    let setting = resData.data[0];
                    state.formData = {
                        seoContents: {
                            ...state.formData.seoContents,
                            ...setting.seoContents,
                            langId: this.props.getPageData.langId
                        }
                    };
                }

                return state;
            })
        }
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        this.setState({
            isSubmitting: true
        }, () => {
            settingService.updateSeo(this.state.formData).then(resData => {
                if (resData.status) {
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
        })
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
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
                                            name="seoContents.title"
                                            required={true}
                                            maxLength={50}
                                            value={this.state.formData.seoContents.title}
                                            onChange={(event) => HandleForm.onChangeInput(event, this)}
                                        />
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormType
                                            title={this.props.router.t("websiteDescription")}
                                            type="textarea"
                                            name="seoContents.content"
                                            required={true}
                                            maxLength={120}
                                            value={this.state.formData.seoContents.content}
                                            onChange={(event) => HandleForm.onChangeInput(event, this)}
                                        />
                                    </div>
                                    <div className="col-md-7 mb-3">
                                        <ThemeFormTags
                                            title={this.props.router.t("websiteTags")}
                                            placeHolder={this.props.router.t("writeAndPressEnter")}
                                            name="seoContents.tags"
                                            value={this.state.formData.seoContents.tags ?? []}
                                            onChange={(value, name) => HandleForm.onChangeSelect(name, value, this)}
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
