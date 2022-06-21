import React, {Component, FormEvent} from 'react'
import {Tab, Tabs} from "react-bootstrap";
import JoditEditor from "jodit-react";
import moment from "moment";
import {ThemeForm, ThemeFormCheckBox, ThemeFormSelect, ThemeFormType} from "../../components/form"
import {getPageData, getSessionData, GlobalFunctions, setPageData} from "../../../../../config/global";
import {PostTermTypeId, PostTypeContents, Status, StatusContents, StatusId} from "../../../../../public/static";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import SweetAlert from "react-sweetalert2";
import V, {DateMask} from "../../../../../library/variable";
import {pageRoutes} from "../../../routes";
import HandleForm from "../../../../../library/react/handles/form";
import {PostDocument, PostTermDocument} from "../../../../../modules/ajax/result/data";
import Services from "../../../../../services";
import {PostTermGetParamDocument} from "../../../../../modules/services/get/postTerm";
import {PostPostParamDocument} from "../../../../../modules/services/post/post";
import {PostPutParamDocument} from "../../../../../modules/services/put/post";
import {PostGetParamDocument} from "../../../../../modules/services/get/post";

type PageState = {
    formActiveKey: string
    categoryTerms?: { value: number, label: string }[]
    tagTerms?: { value: number, label: string }[]
    status?: { value: number, label: string }[]
    isSubmitting: boolean
    formData: {
        title: string
        categoryTermId: number[]
        tagTermId: number[]
        statusId: number
        order: number
        dateStart: string
        content: string,
        shortContent: string
        url: string
        seoTitle: string
        seoContent: string
        isFixed: 1 | 0
    },
    isSuccessMessage: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PagePostAdd extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            formActiveKey: `general`,
            isSubmitting: false,
            formData: {
                title: "",
                categoryTermId: [],
                tagTermId: [],
                statusId: 0,
                order: 0,
                dateStart: new Date().getStringWithMask(DateMask.DATE),
                content: "",
                shortContent: "",
                url: "",
                seoTitle: "",
                seoContent: "",
                isFixed: 0
            },
            isSuccessMessage: false
        }
    }

    componentDidMount() {
        this.getTerms();
        this.getStatus();
        if (!V.isEmpty(getPageData().searchParams.postId)) {
            this.getPost();
        }
    }

    setPageTitle() {
        setPageData({
            title: `
                  ${GlobalFunctions.getStaticContent(PostTypeContents, "typeId", getPageData().searchParams.postTypeId, getSessionData().langId)}
            `
        })
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
            postTypeId: getPageData().searchParams.postTypeId,
            langId: getPageData().langId,
            statusId: StatusId.Active
        };

        let resData = Services.Get.postTerms(params);
        if (resData.status) {
            this.setState((state: PageState) => {
                state.tagTerms = [];
                state.categoryTerms = [];
                resData.data.orderBy("postTermOrder", "asc").forEach((item: PostTermDocument) => {
                    if (item.postTermTypeId == PostTermTypeId.Category) state.categoryTerms?.push({
                        value: item.postTermId,
                        label: item.postTermContentTitle
                    });
                    else if (item.postTermTypeId == PostTermTypeId.Tag) state.tagTerms?.push({
                        value: item.postTermId,
                        label: item.postTermContentTitle
                    });
                });
                return state;
            })
        }
    }

    getPost() {
        let params: PostGetParamDocument = {
            postId: getPageData().searchParams.postId,
            typeId: getPageData().searchParams.postTypeId,
            langId: getPageData().langId,
            getContents: true
        };
        let resData = Services.Get.posts(params);
        if (resData.status) {
            if (resData.data.length > 0) {
                const post: PostDocument = resData.data[0];
                this.setState((state: PageState) => {
                    let categoryTermId: number[] = [];
                    let tagTermId: number[] = [];

                    post.postTermContents.forEach(term => {
                        if (term.postTermTypeId == PostTermTypeId.Category) categoryTermId.push(term.postTermId);
                        else if (term.postTermTypeId == PostTermTypeId.Tag) tagTermId.push(term.postTermId);
                    });

                    state.formData = {
                        dateStart: post.postDateStart,
                        url: post.postContentUrl,
                        order: post.postOrder,
                        content: post.postContent,
                        shortContent: post.postContentShort,
                        title: post.postContentTitle,
                        seoContent: post.postContentSEO,
                        seoTitle: post.postContentSEOTitle,
                        statusId: post.postStatusId,
                        categoryTermId: categoryTermId,
                        tagTermId: tagTermId,
                        isFixed: post.postIsFixed ? 1 : 0
                    }
                    return state;
                })
            } else {
                this.navigateTermPage();
            }
        }
    }

    navigateTermPage() {
        let path = pageRoutes.post.path(getPageData().searchParams.postTypeId) + pageRoutes.post.list.path()
        path = (this.props.router.location.pathname.search(pageRoutes.themeContent.path()) > -1) ? pageRoutes.themeContent.path() + path : path;
        this.props.router.navigate(path, {replace: true});
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        })
        let params: PostPostParamDocument & PostPutParamDocument = Object.assign({
            postId: getPageData().searchParams.postId,
            termId: this.state.formData.tagTermId.concat(this.state.formData.categoryTermId),
            typeId: getPageData().searchParams.postTypeId,
            langId: getPageData().langId
        }, this.state.formData);

        ((V.isEmpty(params.postId))
            ? Services.Post.post(params)
            : Services.Put.post(params)).then(resData => {
                this.setState((state: PageState) => {
                    if (resData.status) {
                        state.isSuccessMessage = true;
                    }

                    state.isSubmitting = false;
                    return state;
                })
        });
    }

    onCloseSuccessMessage() {
        this.setState({
            isSuccessMessage: false
        });
        this.navigateTermPage()
    }

    onChangeJoeEditor(newContent: string) {
        this.setState((state: PageState) => {
            state.formData.content = newContent;
            return state;
        })
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

    TabOptions = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={`${this.props.router.t("startDate").toCapitalizeCase()}*`}
                        type="date"
                        name="dateStart"
                        value={moment(this.state.formData.dateStart).format("YYYY-MM-DD")}
                        onChange={(event) => HandleForm.onChangeInput(event, this)}
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

    TabContent = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <JoditEditor
                        value={this.state.formData.content}
                        config={{
                            uploader: {insertImageAsBase64URI: true},
                            showXPathInStatusbar: false,
                            showCharsCounter: false,
                            showWordsCounter: false,
                            toolbarAdaptive: true,
                            askBeforePasteFromWord: false,
                            askBeforePasteHTML: false,
                            defaultActionOnPaste: "insert_clear_html",
                            placeholder: this.props.router.t("content")
                        }}
                        onBlur={newContent => this.onChangeJoeEditor(newContent)}
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
                    <ThemeFormType
                        title={this.props.router.t("shortContent").toCapitalizeCase()}
                        name="shortContent"
                        type="textarea"
                        value={this.state.formData.shortContent}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormSelect
                        title={this.props.router.t("category")}
                        name="categoryTermId"
                        placeholder={this.props.router.t("chooseCategory").toCapitalizeCase()}
                        isMulti
                        closeMenuOnSelect={false}
                        options={this.state.categoryTerms}
                        value={this.state.categoryTerms?.filter(item => this.state.formData.categoryTermId.includes(item.value))}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormSelect
                        title={this.props.router.t("tag")}
                        name="tagTermId"
                        placeholder={this.props.router.t("chooseTag").toCapitalizeCase()}
                        isMulti
                        closeMenuOnSelect={false}
                        options={this.state.tagTerms}
                        value={this.state.tagTerms?.filter(item => this.state.formData.tagTermId.includes(item.value))}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item, this)}
                    />
                </div>
            </div>
        );
    }

    render() {
        this.setPageTitle()
        return (typeof this.state.status === "undefined") ? "" : (
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
                                        <Tab eventKey="content" title={this.props.router.t("content")}>
                                            {
                                                (this.state.formActiveKey === "content")
                                                    ? <this.TabContent/>
                                                    : ""
                                            }
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

export default PagePostAdd;
