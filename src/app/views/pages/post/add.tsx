import React, {Component, FormEvent} from 'react'
import {Tab, Tabs} from "react-bootstrap";
import JoditEditor from "jodit-react";
import moment from "moment";
import {ThemeFieldSet, ThemeForm, ThemeFormCheckBox, ThemeFormSelect, ThemeFormType} from "components/form"
import {LanguageKeysArray, PageTypes, PostTermTypeId, PostTypeId, PostTypes, StatusId} from "constants/index";
import {PagePropCommonDocument} from "types/app/pageProps";
import SweetAlert from "react-sweetalert2";
import V from "library/variable";
import Variable from "library/variable";
import HandleForm from "library/react/handles/form";
import ThemeChooseImage from "components/chooseImage";
import postTermService from "services/postTerm.service";
import postService from "services/post.service";
import Thread from "library/thread";
import Spinner from "components/tools/spinner";
import staticContentUtil from "utils/staticContent.util";
import imageSourceUtil from "utils/imageSource.util";
import {PostContentButtonDocument, PostUpdateParamDocument} from "types/services/post";
import componentService from "services/component.service";
import PagePaths from "constants/pagePaths";
import ThemeToolTip from "components/tooltip";

type PageState = {
    langKeys: { value: string, label: string }[]
    posts: { value: string, label: string }[]
    pageTypes: { value: number, label: string }[]
    components: { value: string, label: string }[]
    formActiveKey: string
    categoryTerms: { value: string, label: string }[]
    tagTerms: { value: string, label: string }[]
    status: { value: number, label: string }[]
    isSubmitting: boolean
    mainTitle: string,
    isLoading: boolean
    formData: Omit<PostUpdateParamDocument, "terms"> & {
        categoryTermId: string[]
        tagTermId: string[]
    },
    isSuccessMessage: boolean
    isSelectionImage: boolean
};

type PageProps = {} & PagePropCommonDocument;

export default class PagePostAdd extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            formActiveKey: `general`,
            posts: [],
            categoryTerms: [],
            langKeys: [],
            pageTypes: [],
            tagTerms: [],
            status: [],
            components: [],
            isSubmitting: false,
            mainTitle: "",
            isLoading: true,
            formData: {
                postId: this.props.getPageData.searchParams.postId,
                typeId: this.props.getPageData.searchParams.postTypeId,
                categoryTermId: [],
                tagTermId: [],
                statusId: 0,
                order: 0,
                dateStart: new Date(),
                isFixed: 0,
                contents: {
                    langId: this.props.getPageData.langId,
                    image: "",
                    title: "",
                    content: "",
                    shortContent: "",
                    url: "",
                    seoTitle: "",
                    seoContent: "",
                },
            },
            isSuccessMessage: false,
            isSelectionImage: false
        }
    }

    async componentDidMount() {
        this.setPageTitle();
        this.getLangKeys();
        if ([PostTypeId.Navigate].includes(Number(this.state.formData.typeId))) {
            await this.getPosts();
        }
        if (![PostTypeId.Slider, PostTypeId.Service, PostTypeId.Testimonial, PostTypeId.Navigate].includes(Number(this.state.formData.typeId))) {
            await this.getTerms();
        }
        if ([PostTypeId.Page].includes(Number(this.state.formData.typeId))) {
            await this.getComponents();
            this.getPageTypes();
        }
        this.getStatus();
        if (this.props.getPageData.searchParams.postId) {
            await this.getPost();
        }
        this.setState({
            isLoading: false
        })
    }

    async componentDidUpdate(prevProps: PagePropCommonDocument) {
        if (prevProps.getPageData.langId != this.props.getPageData.langId) {
            this.setState((state: PageState) => {
                state.isLoading = true;
                return state;
            }, async () => {
                await this.getPost()
                this.setState({
                    isLoading: false
                })
            })
        }
    }

    setPageTitle() {
        let titles: string[] = [
            this.props.router.t(PostTypes.findSingle("id", this.props.getPageData.searchParams.postTypeId)?.langKey ?? "[noLangAdd]"),
            this.props.router.t(this.state.formData.postId ? "edit" : "add")
        ];
        if (this.state.formData.postId) {
            titles.push(this.state.mainTitle)
        }
        this.props.setBreadCrumb(titles);
    }

    getLangKeys() {
        this.setState((state: PageState) => {
            state.langKeys = LanguageKeysArray.map(langKey => ({label: langKey, value: langKey}))
            return state;
        })
    }

    async getComponents() {
        let resData = await componentService.get({langId: this.props.getPageData.mainLangId});
        if (resData.status) {
            this.setState((state: PageState) => {
                state.components = resData.data.orderBy("order", "asc").map(component => {
                    return {
                        value: component._id,
                        label: this.props.router.t(component.langKey)
                    };
                });
                return state;
            })
        }
    }

    getPageTypes() {
        this.setState((state: PageState) => {
            state.pageTypes = PageTypes.map(pageType => ({
                label: this.props.router.t(pageType.langKey),
                value: pageType.id
            }))
            return state;
        })
    }

    getStatus() {
        this.setState((state: PageState) => {
            state.status = staticContentUtil.getStatusForSelect([
                StatusId.Active,
                StatusId.InProgress,
                StatusId.Pending
            ], this.props.router.t);
            state.formData.statusId = StatusId.Active;
            return state;
        })
    }

    async getTerms() {
        let resData = await postTermService.get({
            postTypeId: this.props.getPageData.searchParams.postTypeId,
            langId: this.props.getPageData.mainLangId,
            statusId: StatusId.Active
        });
        if (resData.status) {
            this.setState((state: PageState) => {
                state.categoryTerms = [];
                state.tagTerms = [];
                resData.data.orderBy("order", "asc").forEach(term => {
                    if (term.typeId == PostTermTypeId.Category) {
                        state.categoryTerms.push({
                            value: term._id,
                            label: term.contents?.title || this.props.router.t("[noLangAdd]")
                        });
                    } else if (term.typeId == PostTermTypeId.Tag) {
                        state.tagTerms.push({
                            value: term._id,
                            label: term.contents?.title || this.props.router.t("[noLangAdd]")
                        });
                    }
                });
                return state;
            })
        }
    }

    async getPosts() {
        let resData = await postService.get({
            langId: this.props.getPageData.mainLangId,
            statusId: StatusId.Active,
            typeId: PostTypeId.Navigate
        });
        if (resData.status) {
            this.setState((state: PageState) => {
                state.posts = [{value: "", label: this.props.router.t("notSelected")}];
                resData.data.orderBy("order", "asc").forEach(item => {
                    if (!V.isEmpty(this.props.getPageData.searchParams.postId)) {
                        if (this.props.getPageData.searchParams.postId == item._id) return;
                    }
                    state.posts.push({
                        value: item._id,
                        label: item.contents?.title || this.props.router.t("[noLangAdd]")
                    });
                });
                return state;
            })
        }
    }

    async getPost() {
        let resData = await postService.get({
            postId: this.state.formData.postId,
            typeId: this.props.getPageData.searchParams.postTypeId,
            langId: this.props.getPageData.langId,
            getContents: 1
        });
        if (resData.status) {
            if (resData.data.length > 0) {
                const post = resData.data[0];

                this.setState((state: PageState) => {
                    let categoryTermId: string[] = [];
                    let tagTermId: string[] = [];

                    post.terms.forEach(term => {
                        if (term?.typeId == PostTermTypeId.Category) categoryTermId.push(term._id);
                        else if (term?.typeId == PostTermTypeId.Tag) tagTermId.push(term._id);
                    });

                    state.formData = {
                        ...state.formData,
                        ...post,
                        mainId: post.mainId?._id || "",
                        categoryTermId: categoryTermId,
                        tagTermId: tagTermId,
                        components: post.components?.map(component => component._id),
                        isFixed: post.isFixed ? 1 : 0,
                        dateStart: new Date(post.dateStart),
                        contents: {
                            ...state.formData.contents,
                            ...post.contents,
                            views: post.contents?.views ?? 0,
                            langId: this.props.getPageData.langId,
                            content: post.contents?.content ?? ""
                        }
                    };

                    if (this.props.getPageData.langId == this.props.getPageData.mainLangId) {
                        state.mainTitle = state.formData.contents.title;
                    }

                    return state;
                }, () => {
                    this.setPageTitle();
                })
            }
        } else {
            this.navigateTermPage();
        }
    }

    navigateTermPage() {
        let postTypeId = this.props.getPageData.searchParams.postTypeId;
        let pagePath = [PostTypeId.Page, PostTypeId.Navigate].includes(Number(postTypeId))  ? PagePaths.post(postTypeId) : PagePaths.themeContent().post(postTypeId);
        let path = pagePath.list();
        this.props.router.navigate(path, {replace: true});
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        }, () => {
            let params = {
                ...this.state.formData,
                terms: this.state.formData.tagTermId.concat(this.state.formData.categoryTermId),
                components: this.state.formData.components?.filter(componentId => !Variable.isEmpty(componentId)),
                contents: {
                    ...this.state.formData.contents,
                    content: this.state.formData.contents.content
                }
            };

            ((params.postId)
                ? postService.update(params)
                : postService.add(params)).then(resData => {
                this.setState((state: PageState) => {
                    if (resData.status) {
                        state.isSuccessMessage = true;
                    }

                    state.isSubmitting = false;

                    return state;
                })
            });
        })
    }

    onCloseSuccessMessage() {
        this.setState({
            isSuccessMessage: false
        });

        if (!this.state.formData.postId) {
            this.navigateTermPage();
        }
    }

    onChangeJoeEditor(newContent: string) {
        this.setState((state: PageState) => {
            state.formData.contents.content = newContent;
            return state;
        })
    }

    get TabGeneralButtonEvents() {
        let self = this;
        return {
            onChange(key: keyof PostContentButtonDocument, value: string, index: number) {
                self.setState((state: PageState) => {
                    if (state.formData.contents.buttons) state.formData.contents.buttons[index][key] = value;
                    return state;
                })
            },
            onAddNew() {
                self.setState((state: PageState) => {
                    if (typeof state.formData.contents.buttons === "undefined") state.formData.contents.buttons = [];
                    state.formData.contents.buttons.push({
                        title: "",
                        url: ""
                    })
                    return state;
                })
            },
            onDelete(index: number) {
                self.setState((state: PageState) => {
                    if (state.formData.contents.buttons) state.formData.contents.buttons.remove(index);
                    return state;
                })
            }
        }
    }

    get TabComponentEvents() {
        let self = this;
        return {
            onChangeSelect(value: string, index: number) {
                self.setState((state: PageState) => {
                    if (state.formData.components) state.formData.components[index] = value;
                    return state;
                })
            },
            onAddNew() {
                self.setState((state: PageState) => {
                    if (typeof state.formData.components === "undefined") state.formData.components = [];
                    state.formData.components.push("")
                    return state;
                })
            },
            onDelete(index: number) {
                self.setState((state: PageState) => {
                    if (state.formData.components) state.formData.components.remove(index);
                    return state;
                })
            }
        }
    }

    Messages = () => {
        return (
            <SweetAlert
                show={this.state.isSuccessMessage}
                title={this.props.router.t("successful")}
                text={`${this.props.router.t((V.isEmpty(this.state.formData.postId)) ? "itemAdded" : "itemEdited")}!`}
                icon="success"
                timer={1000}
                timerProgressBar={true}
                didClose={() => this.onCloseSuccessMessage()}
            />
        )
    }

    TabComponents = () => {
        const Component = (componentId: string, index: number) => {
            return (
                <div className="col-md-12 mt-4">
                    <div className="row">
                        <div className="col-3 col-lg-1 mt-2">
                            <button type="button" className="btn btn-gradient-danger btn-lg"
                                    onClick={event => this.TabComponentEvents.onDelete(index)}><i
                                className="mdi mdi-trash-can"></i></button>
                        </div>
                        <div className="col-9 col-lg-11">
                            <ThemeFormSelect
                                title={this.props.router.t("component")}
                                options={this.state.components}
                                value={this.state.components?.filter(item => item.value == componentId)}
                                onChange={(item: any, e) => this.TabComponentEvents.onChangeSelect(item.value, index)}
                            />
                        </div>
                    </div>

                </div>
            )
        }

        return (
            <div className="row mb-3">
                <div className="col-md-7">
                    <button type={"button"} className="btn btn-gradient-success btn-lg"
                            onClick={() => this.TabComponentEvents.onAddNew()}>+ {this.props.router.t("addNew")}
                    </button>
                </div>
                <div className="col-md-7 mt-2">
                    <div className="row">
                        {
                            this.state.formData.components?.map((componentId, index) => {
                                return Component(componentId, index)
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }

    TabSEO = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("url")}
                        name="contents.url"
                        type="text"
                        value={this.state.formData.contents.url}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("title")}
                        name="contents.seoTitle"
                        type="text"
                        value={this.state.formData.contents.seoTitle}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("content")}
                        name="contents.seoContent"
                        type="textarea"
                        value={this.state.formData.contents.seoContent}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
            </div>
        );
    }

    TabOptions = () => {
        return (
            <div className="row">
                {
                    ![PostTypeId.Navigate].includes(Number(this.state.formData.typeId))
                        ? <div className="col-md-7 mb-3">
                            <ThemeFormType
                                title={`${this.props.router.t("startDate").toCapitalizeCase()}*`}
                                type="date"
                                name="dateStart"
                                value={moment(this.state.formData.dateStart).format("YYYY-MM-DD")}
                                onChange={(event) => HandleForm.onChangeInput(event, this)}
                            />
                        </div> : null
                }
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
                {
                    this.state.formData.typeId == PostTypeId.Page
                        ? <div className="col-md-7">
                            <ThemeFormSelect
                                title={this.props.router.t("pageType")}
                                name="pageTypeId"
                                options={this.state.pageTypes}
                                value={this.state.pageTypes?.findSingle("value", this.state.formData.pageTypeId || "")}
                                onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                            />
                        </div> : null
                }
                <div className="col-md-7">
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
                        value={this.state.formData.contents.content || ""}
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
        const Buttons = () => {
            const Button = (propButton: PostContentButtonDocument, index: number) => {
                return (
                    <div className="col-md-12 mt-4">
                        <ThemeFieldSet
                            legend={`${this.props.router.t("button")}#${index + 1}`}
                            legendElement={<i className="mdi mdi-trash-can text-danger fs-3 cursor-pointer"
                                              onClick={() => this.TabGeneralButtonEvents.onDelete(index)}></i>}
                        >
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <ThemeFormType
                                        type={"text"}
                                        title={this.props.router.t("title")}
                                        value={propButton.title}
                                        onChange={e => this.TabGeneralButtonEvents.onChange("title", e.target.value, index)}
                                    />
                                </div>
                                <div className="col-md-6 mt-3 mt-lg-0">
                                    <ThemeFormType
                                        type={"text"}
                                        title={this.props.router.t("url")}
                                        value={propButton.url}
                                        onChange={e => this.TabGeneralButtonEvents.onChange("url", e.target.value, index)}
                                    />
                                </div>
                            </div>
                        </ThemeFieldSet>
                    </div>
                )
            }

            return (
                <div className="row mb-3">
                    <div className="col-md-7">
                        <button type={"button"} className="btn btn-gradient-success btn-lg"
                                onClick={() => this.TabGeneralButtonEvents.onAddNew()}>+ {this.props.router.t("newButton")}
                        </button>
                    </div>
                    <div className="col-md-7 mt-2">
                        <div className="row">
                            {
                                this.state.formData.contents.buttons?.map((button, index) => {
                                    return Button(button, index)
                                })
                            }
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="row">
                {
                    ![PostTypeId.Navigate].includes(Number(this.state.formData.typeId))
                        ? <div className="col-md-7 mb-3">
                            <ThemeChooseImage
                                {...this.props}
                                isShow={this.state.isSelectionImage}
                                onHide={() => this.setState({isSelectionImage: false})}
                                result={this.state.formData.contents.image || ""}
                                onSelected={images => this.setState((state: PageState) => {
                                    state.formData.contents.image = images[0];
                                    return state
                                })}
                                isMulti={false}
                            />
                            <img
                                src={imageSourceUtil.getUploadedImageSrc(this.state.formData.contents.image)}
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
                        </div> : null
                }
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={`${this.props.router.t("title")}*`}
                        name="contents.title"
                        type="text"
                        required={true}
                        value={this.state.formData.contents.title}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                {
                    [PostTypeId.Navigate].includes(Number(this.state.formData.typeId))
                        ? <div className="col-md-7 mb-3">
                            <ThemeFormType
                                title={`${this.props.router.t("url")}*`}
                                name="contents.url"
                                type="text"
                                required={true}
                                value={this.state.formData.contents.url}
                                onChange={e => HandleForm.onChangeInput(e, this)}
                            />
                        </div> : null
                }
                {
                    ![PostTypeId.Navigate].includes(Number(this.state.formData.typeId))
                        ? <div className="col-md-7 mb-3">
                            <ThemeFormType
                                title={this.props.router.t("shortContent").toCapitalizeCase()}
                                name="contents.shortContent"
                                type="textarea"
                                value={this.state.formData.contents.shortContent}
                                onChange={e => HandleForm.onChangeInput(e, this)}
                            />
                        </div> : null
                }
                {
                    [PostTypeId.Navigate].includes(Number(this.state.formData.typeId))
                        ? <div className="col-md-7 mb-3">
                            <ThemeFormSelect
                                title={this.props.router.t("main")}
                                name="mainId"
                                placeholder={this.props.router.t("chooseMain")}
                                options={this.state.posts}
                                value={this.state.posts.findSingle("value", this.state.formData.mainId || "")}
                                onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                            />
                        </div> : null
                }
                {
                    ![PostTypeId.Page, PostTypeId.Slider, PostTypeId.Service, PostTypeId.Testimonial, PostTypeId.Navigate].includes(Number(this.state.formData.typeId))
                        ? <div className="col-md-7 mb-3">
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
                        </div> : null
                }
                {
                    ![PostTypeId.Slider, PostTypeId.Service, PostTypeId.Testimonial, PostTypeId.Navigate].includes(Number(this.state.formData.typeId))
                        ? <div className="col-md-7 mb-3">
                            <ThemeFormSelect
                                title={this.props.router.t("tag")}
                                name="tagTermId"
                                placeholder={this.props.router.t("chooseTag")}
                                isMulti
                                closeMenuOnSelect={false}
                                options={this.state.tagTerms}
                                value={this.state.tagTerms?.filter(item => this.state.formData.tagTermId.includes(item.value))}
                                onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item, this)}
                            />
                        </div> : null
                }
                {
                    [PostTypeId.Slider, PostTypeId.Service].includes(Number(this.state.formData.typeId))
                        ? <div className="col-md-7 mb-3">
                            {
                                Buttons()
                            }
                        </div> : null
                }
            </div>
        );
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-post">
                <this.Messages/>
                <div className="row mb-3">
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-6">
                                <button className="btn btn-gradient-dark btn-lg btn-icon-text w-100"
                                        onClick={() => this.navigateTermPage()}>
                                    <i className="mdi mdi-arrow-left"></i> {this.props.router.t("returnBack")}
                                </button>
                            </div>
                            {
                                this.state.formData.postId && [PostTypeId.Page, PostTypeId.Blog, PostTypeId.Portfolio, PostTypeId.Service].includes(Number(this.state.formData.typeId))
                                    ? <div className="col-6">
                                        <ThemeToolTip message={this.props.router.t("views")}>
                                            <label className="badge badge-gradient-primary w-100 p-2 fs-6 rounded-3">
                                                <i className="mdi mdi-eye"></i> {this.state.formData.contents.views}
                                            </label>
                                        </ThemeToolTip>
                                    </div> : null
                            }
                        </div>
                    </div>
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
                                        {
                                            ![PostTypeId.Slider, PostTypeId.Navigate].includes(Number(this.state.formData.typeId))
                                                ? <Tab eventKey="content" title={this.props.router.t("content")}>
                                                    {
                                                        (this.state.formActiveKey === "content")
                                                            ? <this.TabContent/>
                                                            : ""
                                                    }
                                                </Tab> : null
                                        }
                                        {
                                            [PostTypeId.Page].includes(Number(this.state.formData.typeId))
                                                ? <Tab eventKey="components" title={this.props.router.t("components")}>
                                                    <this.TabComponents/>
                                                </Tab> : null
                                        }
                                        <Tab eventKey="options" title={this.props.router.t("options")}>
                                            <this.TabOptions/>
                                        </Tab>
                                        {
                                            ![PostTypeId.Slider, PostTypeId.Testimonial, PostTypeId.Navigate].includes(Number(this.state.formData.typeId))
                                                ? <Tab eventKey="seo" title={this.props.router.t("seo")}>
                                                    <this.TabSEO/>
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
