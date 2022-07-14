import React, {Component, FormEvent} from 'react'
import {Tab, Tabs} from "react-bootstrap";
import {
    ThemeFormType,
    ThemeFormSelect,
    ThemeForm,
    ThemeFormCheckBox
} from "../../../components/form"
import {PostTermDocument} from "../../../../../../modules/ajax/result/data";
import Services from "../../../../../../services";
import {pageRoutes} from "../../../../routes";
import {PagePropCommonDocument} from "../../../../../../modules/views/pages/pageProps";
import {
    PostTermTypeContents,
    PostTermTypeId,
    PostTypeContents,
    StatusId
} from "../../../../../../public/static";
import {GlobalFunctions} from "../../../../../../config/global";
import V from "../../../../../../library/variable";
import SweetAlert from "react-sweetalert2";
import {PostTermGetParamDocument} from '../../../../../../modules/services/get/postTerm';
import HandleForm from "../../../../../../library/react/handles/form";
import ThemeChooseImage from "../../../components/chooseImage";

type PageState = {
    formActiveKey: string
    postTerms: { value: number, label: string }[]
    status: { value: number, label: string }[]
    isSubmitting: boolean
    mainTitle: string
    formData: {
        termId: number
        typeId: number
        postTypeId: number
        langId: number
        mainId: number
        statusId: number
        image: string
        title: string
        order: number
        url: string
        seoTitle: string
        seoContent: string
        isFixed: 1 | 0
    },
    isSuccessMessage: boolean
    isSelectionImage: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PagePostTermAdd extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            formActiveKey: `general`,
            postTerms: [],
            status: [],
            isSubmitting: false,
            mainTitle: "",
            formData: {
                termId: this.props.getPageData.searchParams.termId,
                postTypeId: this.props.getPageData.searchParams.postTypeId,
                typeId: this.props.getPageData.searchParams.termTypeId,
                langId: this.props.getPageData.mainLangId,
                mainId: 0,
                statusId: 0,
                image: "",
                title: "",
                order: 0,
                url: "",
                seoTitle: "",
                seoContent: "",
                isFixed: 0
            },
            isSuccessMessage: false,
            isSelectionImage: false
        }
    }

    componentDidMount() {
        this.setPageTitle();
        this.getTerms();
        this.getStatus();
        if (this.props.getPageData.searchParams.termId > 0) {
            this.getTerm();
        }
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        if(this.state.formData.langId != this.props.getPageData.langId){
            this.setState((state: PageState) => {
                state.formData.langId = this.props.getPageData.langId;
                return state;
            }, () => this.getTerm())
        }
    }

    setPageTitle() {
        let titles: string[] = [
            GlobalFunctions.getStaticContent(PostTypeContents, "typeId", this.props.getPageData.searchParams.postTypeId, this.props.getSessionData.langId),
            GlobalFunctions.getStaticContent(PostTermTypeContents, "typeId", this.props.getPageData.searchParams.termTypeId, this.props.getSessionData.langId),
            this.props.router.t((this.state.formData.termId) > 0 ? "edit" : "add")
        ];
        if(this.state.formData.termId > 0) {
            titles.push(this.state.mainTitle)
        }
        this.props.setBreadCrumb(titles);
    }

    getStatus() {
        this.setState((state: PageState) => {
            state.status = GlobalFunctions.getStatusForSelect([
                StatusId.Active,
                StatusId.InProgress,
                StatusId.Pending
            ], this.props.getSessionData.langId);
            state.formData.statusId = StatusId.Active;
            return state;
        })
    }

    getTerms() {
        let params: PostTermGetParamDocument = {
            typeId: this.state.formData.typeId,
            postTypeId: this.state.formData.postTypeId,
            langId: this.props.getPageData.mainLangId,
            statusId: StatusId.Active
        };
        let resData = Services.Get.postTerms(params);
        if (resData.status) {
            this.setState((state: PageState) => {
                state.postTerms = [{value: 0, label: this.props.router.t("notSelected")}];
                resData.data.orderBy("postTermOrder", "asc").forEach((item: PostTermDocument) => {
                    if (!V.isEmpty(this.props.getPageData.searchParams.termId)) {
                        if (this.props.getPageData.searchParams.termId == item.postTermId) return;
                    }
                    state.postTerms?.push({value: item.postTermId, label: item.postTermContentTitle || this.props.router.t("[noLangAdd]")});
                });
                return state;
            })
        }
    }

    getTerm() {
        let params: PostTermGetParamDocument = {
            postTypeId: this.state.formData.postTypeId,
            termId: this.state.formData.termId,
            langId: this.state.formData.langId,
            getContents: true
        };
        let resData = Services.Get.postTerms(params);
        if (resData.status) {
            if (resData.data.length > 0) {
                const term: PostTermDocument = resData.data[0];
                this.setState((state: PageState) => {
                    state.formData = {
                        postTypeId: state.formData.postTypeId,
                        termId: state.formData.termId,
                        langId: state.formData.langId,
                        typeId: state.formData.typeId,
                        mainId: term.postTermMainId,
                        statusId: term.postTermStatusId,
                        order: term.postTermOrder,
                        isFixed: term.postTermIsFixed ? 1 : 0,
                        image: term.postTermContentImage || "",
                        title: term.postTermContentTitle || "",
                        url: term.postTermContentUrl || "",
                        seoTitle: term.postTermContentSEOTitle || "",
                        seoContent: term.postTermContentSEO || "",
                    }

                    if(this.props.getPageData.langId == this.props.getPageData.mainLangId) {
                        state.mainTitle = state.formData.title;
                    }
                    return state;
                }, () => {
                    this.setPageTitle();
                })
            } else {
                this.navigateTermPage();
            }
        }
    }

    navigateTermPage() {
        let path = pageRoutes.postTerm.path(this.props.getPageData.searchParams.postTypeId, this.props.getPageData.searchParams.termTypeId) + pageRoutes.postTerm.list.path()
        path = (this.props.router.location.pathname.search(pageRoutes.themeContent.path()) > -1) ? pageRoutes.themeContent.path() + path : path;
        this.props.router.navigate(path, {replace: true});
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        let params: any = Object.assign({

        }, this.state.formData);
        ((params.termId > 0)
            ? Services.Put.postTerm(params)
            : Services.Post.postTerm(params)).then(resData => {
                if (resData.status) {
                    this.getTerms();
                }

                this.setState((state: PageState) => {
                    if (resData.status) {
                        state.formData = {
                            postTypeId: state.formData.postTypeId,
                            termId: state.formData.termId,
                            langId: state.formData.langId,
                            typeId: state.formData.typeId,
                            mainId: state.formData.mainId,
                            statusId: state.formData.statusId,
                            image: "",
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
    }

    Messages = () => {
        return (
            <SweetAlert
                show={this.state.isSuccessMessage}
                title={this.props.router.t("successful")}
                text={`${this.props.router.t((V.isEmpty(this.props.getPageData.searchParams.termId)) ? "itemAdded" : "itemEdited")}!`}
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

    TabOptions = () => {
        return (
            <div className="row">
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

    TabGeneral = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <img
                        src={GlobalFunctions.getUploadedImageSrc(this.state.formData.image)}
                        alt="Empty Image"
                        className="post-image"
                    />
                    <button
                        type="button"
                        className="btn btn-gradient-warning btn-xs ms-1"
                        onClick={() => {
                            this.setState({isSelectionImage: true})
                        }}
                    ><i className="fa fa-pencil-square-o"></i></button>
                </div>
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
                            ${this.props.router.t((this.props.getPageData.searchParams.termTypeId == PostTermTypeId.Category) ? "category" : "tag")}
                       `}
                        name="mainId"
                        placeholder="Choose Main Term"
                        options={this.state.postTerms}
                        value={this.state.postTerms?.findSingle("value", this.state.formData.mainId)}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="page-post-term">
                <this.Messages/>
                <ThemeChooseImage
                    {...this.props}
                    isShow={this.state.isSelectionImage}
                    onHide={() => this.setState({isSelectionImage: false})}
                    result={this.state.formData.image}
                    onSelected={images => this.setState((state: PageState) => {
                        state.formData.image = images[0];
                        return state
                    })}
                    isMulti={false}
                />
                <div className="navigate-buttons mb-3">
                    <button className="btn btn-gradient-dark btn-lg btn-icon-text"
                            onClick={() => this.navigateTermPage()}>
                        <i className="mdi mdi-arrow-left"></i> {this.props.router.t("returnBack")}
                    </button>
                </div>
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
                                        <Tab eventKey="options" title={this.props.router.t("options")}>
                                            <this.TabOptions/>
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