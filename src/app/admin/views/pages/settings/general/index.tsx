import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../../../modules/views/pages/pageProps";
import {getPageData, GlobalFunctions, setPageData} from "../../../../../../config/global";
import {ThemeForm, ThemeFormSelect, ThemeFormTags, ThemeFormType} from "../../../components/form";
import HandleForm from "../../../../../../library/react/handles/form";
import Services from "../../../../../../services";
import {SettingPutParamDocument} from "../../../../../../modules/services/put/setting";
import {SettingId} from "../../../../../../public/static";

type PageState = {
    languages: {label: string, value: any}[]
    isSubmitting: boolean
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
            formData: {
                langId: 1
            }
        }
    }

    componentDidMount() {
        this.getLanguages();
        this.getSettings();
    }

    setPageTitle() {
        setPageData({
            title: this.props.router.t("general")
        })
    }

    getSettings() {
        let resData = Services.Get.settings({})
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
        let resData = Services.Get.languages({})
        if (resData.status) {
            this.setState({
                languages: resData.data.map(lang => ({
                    label: lang.langTitle,
                    value: lang.langId
                }))
            })
        }
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        })
        let params: SettingPutParamDocument = {
            settings: [
                {id: SettingId.WebsiteMainLanguage, value: this.state.formData.langId.toString()}
            ]
        }

        Services.Put.setting(params).then(resData => {
            this.setState((state: PageState) => {
                state.isSubmitting = false;
                return state;
            })
            if(resData.status){
                setPageData({
                    mainLangId: this.state.formData.langId
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
