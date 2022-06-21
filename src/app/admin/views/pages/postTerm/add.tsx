import React, {Component, FormEvent} from 'react'
import {Tab, Tabs} from "react-bootstrap";
import {
    ThemeFormType,
    ThemeFormSelect,
    ThemeForm,
    ThemeFormCheckBox
} from "../../components/form"
import {getPageData, getSessionData, setPageData} from "../../../../../config/global/";
import {PostTermDocument} from "../../../../../modules/ajax/result/data";
import Services from "../../../../../services";
import {pageRoutes} from "../../../routes";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import {
    PostTermTypeContents,
    PostTermTypeId,
    PostTypeContents,
    StatusId
} from "../../../../../public/static";
import {GlobalFunctions} from "../../../../../config/global";
import V from "../../../../../library/variable";
import SweetAlert from "react-sweetalert2";
import {PostTermGetParamDocument} from '../../../../../modules/services/get/postTerm';
import HandleForm from "../../../../../library/react/handles/form";

type PageState = {
    formActiveKey: string,
    postTerms?: { value: number, label: string }[],
    status?: { value: number, label: string }[]
    isSubmitting: boolean
    formData: {
        title: string,
        mainId: number,
        statusId: number,
        order: number,
        url: string,
        seoTitle: string,
        seoContent: string,
        isFixed: 1 | 0
    },
    isSuccessMessage: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PagePostTermAdd extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            formActiveKey: `general`,
            isSubmitting: false,
            formData: {
                title: "",
                mainId: 0,
                statusId: 0,
                order: 0,
                url: "",
                seoTitle: "",
                seoContent: "",
                isFixed: 0
            },
            isSuccessMessage: false
        }
    }

    setPageTitle() {
        setPageData({
            title: `
                ${GlobalFunctions.getStaticContent(PostTypeContents, "typeId", getPageData().searchParams.postTypeId, getSessionData().langId)} 
                - 
                ${GlobalFunctions.getStaticContent(PostTermTypeContents, "typeId", getPageData().searchParams.termTypeId, getSessionData().langId)}
            `
        })
    }

    componentDidMount() {
        this.getTerms();
        this.getStatus();
        if (!V.isEmpty(getPageData().searchParams.termId)) {
            this.getTerm();
        }
    }

    getStatus() {
        this.setState((state: PageState) => {
            state.status = GlobalFunctions.getStatusForSelect([
                StatusId.Active,
                StatusId.InProgress,
                StatusId.Pending
            ], getSessionData().langId);
            state.formData.statusId = StatusId.Active;
            return state;
        })
    }

    getTerms() {
        let params: PostTermGetParamDocument = {
            typeId: getPageData().searchParams.termTypeId,
            postTypeId: getPageData().searchParams.postTypeId,
            langId: getPageData().langId,
            statusId: StatusId.Active
        };
        let resData = Services.Get.postTerms(params);
        if (resData.status) {
            this.setState((state: PageState) => {
                state.postTerms = [{value: 0, label: this.props.router.t("notSelected")}];
                resData.data.orderBy("postTermOrder", "asc").forEach((item: PostTermDocument) => {
                    if (!V.isEmpty(getPageData().searchParams.termId)) {
                        if (getPageData().searchParams.termId == item.postTermId) return;
                    }
                    state.postTerms?.push({value: item.postTermId, label: item.postTermContentTitle});
                });
                return state;
            })
        }
    }

    getTerm() {
        let params: PostTermGetParamDocument = {
            postTypeId: getPageData().searchParams.postTypeId,
            termId: getPageData().searchParams.termId,
            langId: getPageData().langId,
            getContents: true
        };
        let resData = Services.Get.postTerms(params);
        if (resData.status) {
            if (resData.data.length > 0) {
                const term: PostTermDocument = resData.data[0];
                this.setState((state: PageState) => {
                    state.formData = {
                        mainId: term.postTermMainId,
                        statusId: term.postTermStatusId,
                        title: term.postTermContentTitle,
                        url: term.postTermContentUrl,
                        seoTitle: term.postTermContentSEOTitle,
                        seoContent: term.postTermContentSEO,
                        order: term.postTermOrder,
                        isFixed: term.postTermIsFixed ? 1 : 0
                    }
                    return state;
                })
            } else {
                this.navigateTermPage();
            }
        }
    }

    navigateTermPage() {
        let path = pageRoutes.postTerm.path(getPageData().searchParams.postTypeId, getPageData().searchParams.termTypeId) + pageRoutes.postTerm.list.path()
        path = (this.props.router.location.pathname.search(pageRoutes.themeContent.path()) > -1) ? pageRoutes.themeContent.path() + path : path;
        this.props.router.navigate(path, {replace: true});
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        let params: any = Object.assign({
            termId: getPageData().searchParams.termId,
            typeId: getPageData().searchParams.termTypeId,
            postTypeId: getPageData().searchParams.postTypeId,
            langId: getPageData().langId,
        }, this.state.formData);
        ((V.isEmpty(params.termId))
            ? Services.Post.postTerm(params)
            : Services.Put.postTerm(params)).then(resData => {
                if (resData.status) {
                    this.getTerms();
                }

                this.setState((state: PageState) => {
                    if (resData.status) {
                        state.formData = {
                            mainId: state.formData.mainId,
                            statusId: state.formData.statusId,
                            title: "",
                            order: 0,
                            isFixed: 0,
                            url: "",
                            seoTitle: "",
                            seoContent: ""
                        }
                        state.isSuccessMessage = true;
                    }

                    state.isSubmitting = false;
                    return state;
                });
        });
    }

    onCloseSuccessMessage() {
        this.setState({
            isSuccessMessage: false
        });
        if (!V.isEmpty(getPageData().searchParams.termId)) {
            this.navigateTermPage()
        }
    }

    Messages = () => {
        return (
            <SweetAlert
                show={this.state.isSuccessMessage}
                title={this.props.router.t("successful")}
                text={`${this.props.router.t((V.isEmpty(getPageData().searchParams.termId)) ? "itemAdded" : "itemEdited")}!`}
                icon="success"
                timer={1000}
                timerProgressBar={true}
                didClose={() => this.onCloseSuccessMessage()}
            />
        )
    }

    TabSEO = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("url")}
                        name="url"
                        type="text"
                        value={this.state.formData.url}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("title")}
                        name="seoTitle"
                        type="text"
                        value={this.state.formData.seoTitle}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("content")}
                        name="seoContent"
                        type="textarea"
                        value={this.state.formData.seoContent}
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
                    <ThemeFormType
                        title={`${this.props.router.t("title")}*`}
                        name="title"
                        type="text"
                        required={true}
                        value={this.state.formData.title}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormSelect
                        title={`
                            ${this.props.router.t("main")} 
                            ${this.props.router.t((getPageData().searchParams.termTypeId == PostTermTypeId.Category) ? "category" : "tag")}
                       `}
                        name="mainId"
                        placeholder="Choose Main Term"
                        options={this.state.postTerms}
                        value={this.state.postTerms?.findSingle("value", this.state.formData.mainId)}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormSelect
                        title={this.props.router.t("status")}
                        name="statusId"
                        options={this.state.status}
                        value={this.state.status?.findSingle("value", this.state.formData.statusId)}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("order")}
                        name="order"
                        type="number"
                        required={true}
                        value={this.state.formData.order}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormCheckBox
                        title={this.props.router.t("isFixed")}
                        name="isFixed"
                        checked={Boolean(this.state.formData.isFixed)}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
            </div>
        );
    }

    render() {
        this.setPageTitle()
        return (typeof this.state.status === "undefined" || typeof this.state.postTerms === "undefined") ? "" : (
            <div className="page-post-term">
                <this.Messages/>
                <div className="navigate-buttons mb-3">
                    <button className="btn btn-gradient-dark btn-lg btn-icon-text"
                            onClick={() => this.navigateTermPage()}>
                        <i className="mdi mdi-arrow-left"></i> {this.props.router.t("returnBack")}
                    </button>
                </div>
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
                                <div className="theme-tabs">
                                    <Tabs
                                        onSelect={(key: any) => this.setState({formActiveKey: key})}
                                        activeKey={this.state.formActiveKey}
                                        className="mb-5"
                                        transition={false}>
                                        <Tab eventKey="general" title={this.props.router.t("general")}>
                                            <this.TabGeneral/>
                                        </Tab>
                                        <Tab eventKey="seo" title={this.props.router.t("seo")}>
                                            <this.TabSEO/>
                                        </Tab>
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

export default PagePostTermAdd;