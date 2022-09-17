import React, {Component, FormEvent} from 'react'
import {Tab, Tabs} from "react-bootstrap";
import JoditEditor from "jodit-react";
import moment from "moment";
import {ThemeFieldSet, ThemeForm, ThemeFormCheckBox, ThemeFormSelect, ThemeFormType} from "../../components/form"
import {PostTermTypeId, PostTypeContents, PostTypeId, StatusId} from "../../../../constants";
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import SweetAlert from "react-sweetalert2";
import V from "../../../../library/variable";
import {pageRoutes} from "../../../routes";
import HandleForm from "../../../../library/react/handles/form";
import ThemeChooseImage from "../../components/chooseImage";
import postTermService from "../../../../services/postTerm.service";
import postService from "../../../../services/post.service";
import Thread from "../../../../library/thread";
import Spinner from "../../tools/spinner";
import permissionUtil from "../../../../utils/functions/permission.util";
import staticContentUtil from "../../../../utils/functions/staticContent.util";
import imageSourceUtil from "../../../../utils/functions/imageSource.util";
import {
    PostThemeGroupDocument,
    PostThemeGroupTypeDocument,
    PostUpdateParamDocument
} from "../../../../types/services/post";
import {ThemeGroupTypeId} from "../../../../constants/themeGroupType.const";
import {LanguageKeysArray} from "../../../../constants/languageKeys";

type PageState = {
    langKeys: { value: string, label: string }[]
    formActiveKey: string
    categoryTerms: { value: string, label: string }[]
    tagTerms: { value: string, label: string }[]
    status: { value: number, label: string }[]
    isSubmitting: boolean
    mainTitle: string,
    newThemeGroups: PostThemeGroupDocument[],
    isLoading: boolean
    formData: Omit<PostUpdateParamDocument, "termId"> & {
        categoryTermId: string[]
        tagTermId: string[]
    },
    isSuccessMessage: boolean
    isSelectionImage: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PagePostAdd extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            formActiveKey: `general`,
            categoryTerms: [],
            langKeys: [],
            tagTerms: [],
            status: [],
            newThemeGroups: [],
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
                themeGroups: []
            },
            isSuccessMessage: false,
            isSelectionImage: false
        }
    }

    componentDidMount() {
        if (!permissionUtil.checkPermissionAndRedirect(
            this.props.getSessionData.roleId,
            this.props.getSessionData.permissions,
            this.props.getPageData.searchParams.postId
                ? permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Edit")
                : permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Add"),
            this.props.router.navigate
        )) return;
        this.setPageTitle();
        Thread.start(() => {
            this.getLangKeys();
            this.getTerms();
            this.getStatus();
            if (this.props.getPageData.searchParams.postId) {
                this.getPost();
            }
            this.setState({
                isLoading: false
            })
        })
    }

    componentDidUpdate(prevProps) {
        if (this.state.formData.contents.langId != this.props.getPageData.langId) {
            this.setState((state: PageState) => {
                state.formData.contents.langId = this.props.getPageData.langId;
                state.isLoading = true;
                return state;
            }, () => {
                Thread.start(() => {
                    this.getPost()
                    this.setState({
                        isLoading: false
                    })
                })
            })
        }
    }

    setPageTitle() {
        let titles: string[] = [
            staticContentUtil.getStaticContent(
                PostTypeContents,
                "typeId",
                this.props.getPageData.searchParams.postTypeId,
            ),
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

    getStatus() {
        this.setState((state: PageState) => {
            state.status = staticContentUtil.getStatusForSelect([
                StatusId.Active,
                StatusId.InProgress,
                StatusId.Pending
            ]);
            state.formData.statusId = StatusId.Active;
            return state;
        })
    }

    getTerms() {
        let resData = postTermService.get({
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

    getPost() {
        let resData = postService.get({
            postId: this.state.formData.postId,
            typeId: this.props.getPageData.searchParams.postTypeId,
            langId: this.state.formData.contents.langId,
            getContents: 1
        });
        if (resData.status) {
            if (resData.data.length > 0) {
                const post = resData.data[0];

                this.setState((state: PageState) => {
                    let categoryTermId: string[] = [];
                    let tagTermId: string[] = [];

                    post.terms.forEach(term => {
                        if (term.typeId == PostTermTypeId.Category) categoryTermId.push(term._id);
                        else if (term.typeId == PostTermTypeId.Tag) tagTermId.push(term._id);
                    });

                    state.formData = {
                        ...state.formData,
                        ...post,
                        categoryTermId: categoryTermId,
                        tagTermId: tagTermId,
                        isFixed: post.isFixed ? 1 : 0,
                        dateStart: new Date(post.dateStart),
                        contents: {
                            ...state.formData.contents,
                            ...post.contents,
                            content: post.contents?.content || ""
                        },
                        themeGroups: post.themeGroups
                            ? post.themeGroups.map(themeGroup => ({
                                ...themeGroup,
                                types: themeGroup.types.map(themeGroupType => ({
                                    ...themeGroupType,
                                    contents: {
                                        ...themeGroupType.contents,
                                        langId: state.formData.contents.langId,
                                        content: state.formData.contents.content || ""
                                    }
                                }))
                            })) : []
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
        let path = pageRoutes.post.path(this.props.getPageData.searchParams.postTypeId) + pageRoutes.post.list.path()
        path = (this.props.router.location.pathname.search(pageRoutes.themeContent.path()) > -1) ? pageRoutes.themeContent.path() + path : path;
        this.props.router.navigate(path, {replace: true});
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        }, () => {
            let params = Object.assign({
                termId: this.state.formData.tagTermId.concat(this.state.formData.categoryTermId),
            }, this.state.formData);

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

    TabTheme = () => {
        let self = this;

        const events  = {
            onInputChange(data: any, key: string, value: any) {
                self.setState((state: PageState) => {
                    data[key] = value;
                    return state;
                }, () => {
                    console.log(self.state)
                })
            },
            onCreateGroup() {
                self.setState((state: PageState) => {
                    state.newThemeGroups.push({
                        _id: String.createId(),
                        elementId: "",
                        langKey: "[noLangAdd]",
                        types: []
                    })
                    return state;
                })
            },
            onCreateGroupType(_id: string) {
                self.setState((state: PageState) => {
                    let findIndex = state.newThemeGroups.indexOfKey("_id", _id);
                    if(findIndex > -1){
                        state.newThemeGroups[findIndex].types.push({
                            _id: String.createId(),
                            elementId: "",
                            langKey: "[noLangAdd]",
                            typeId: ThemeGroupTypeId.Text,
                            contents: {
                                langId: state.formData.contents.langId,
                                content: ""
                            }
                        })
                    }

                    return state;
                })
            },
            onAcceptNewGroup(_id: string) {
                self.setState((state: PageState) => {
                    let findIndex = state.newThemeGroups.indexOfKey("_id", _id);
                    if(findIndex > -1){
                        state.formData.themeGroups?.push(state.newThemeGroups[findIndex]);
                        state.newThemeGroups = state.newThemeGroups.filter(themeGroup => themeGroup._id != state.newThemeGroups[findIndex]._id);
                    }

                    return state;
                })
            }
        }

        const Group = (props: PostThemeGroupDocument) => {
            const Type = (props: PostThemeGroupTypeDocument) => {
                let input = <div>{this.props.router.t("type")}</div>;

                switch (props.typeId) {
                    case ThemeGroupTypeId.Text:
                        input = <ThemeFormType
                            type={"text"}
                            title={this.props.router.t(props.langKey)}
                            value={props.contents.content}
                        />
                        break;
                    case ThemeGroupTypeId.TextArea:
                        input = <ThemeFormType
                            type={"textarea"}
                            title={this.props.router.t(props.langKey)}
                            value={props.contents.content}
                        />
                        break;
                    case ThemeGroupTypeId.Image:
                        input = <ThemeFieldSet legend={this.props.router.t(props.langKey)}>
                            <div className="row">
                                <div className="col-md-6">
                                    <img
                                        src={imageSourceUtil.getUploadedImageSrc(props.contents.content)}
                                        alt="Empty Image"
                                        className="post-image"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-gradient-warning btn-xs ms-1"
                                        onClick={() => {
                                            this.setState({isSelectionImage: true})
                                        }}
                                    ><i className="fa fa-pencil-square-o"></i> {this.props.router.t("select")}</button>
                                </div>
                            </div>
                        </ThemeFieldSet>
                        break;
                }

                return (
                    <div className="col-md-12">
                        {input}
                    </div>
                )
            }

            return (
                <div className="col-md-12">
                    <ThemeFieldSet legend={this.props.router.t(props.langKey)}>
                        <div className="row">
                            {
                                props.types.map(themeGroupType => Type(themeGroupType))
                            }
                        </div>
                    </ThemeFieldSet>
                </div>
            )
        }

        const NewGroup = (props: PostThemeGroupDocument) => {
            const TypeInfo = (props: PostThemeGroupTypeDocument) => {
                return (
                    <div className="row">
                        <div className="col-md-12">
                            <ThemeFormType
                                title={`${this.props.router.t("elementId")}*`}
                                type="text"
                                required={true}
                                value={props.elementId}
                                onChange={e => events.onInputChange(props, "elementId", e.target.value)}
                            />
                        </div>
                        <div className="col-md-12">
                            <ThemeFormSelect
                                title={this.props.router.t("langKey")}
                                placeholder={this.props.router.t("langKey")}
                                options={this.state.langKeys}
                                value={this.state.langKeys.filter(item => item.value == props.langKey)}
                                onChange={(item: any, e) => events.onInputChange(props, "langKey", item.value)}
                            />
                        </div>
                        <div className="col-md-12">
                            <ThemeFormSelect
                                title={this.props.router.t("typeId")}
                                placeholder={this.props.router.t("typeId")}
                                options={this.state.langKeys}
                                value={this.state.langKeys.filter(item => item.value == props.langKey)}
                                onChange={(item: any, e) => events.onInputChange(props, "langKey", item.value)}
                            />
                        </div>
                    </div>
                )
            }

            return (
                <div className="col-md-12">
                    <ThemeFieldSet legend={this.props.router.t("newGroup")}>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <ThemeFormType
                                    title={`${this.props.router.t("elementId")}*`}
                                    type="text"
                                    required={true}
                                    value={props.elementId}
                                    onChange={e => events.onInputChange(props, "elementId", e.target.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <ThemeFormSelect
                                    title={this.props.router.t("langKey")}
                                    placeholder={this.props.router.t("langKey")}
                                    options={this.state.langKeys}
                                    value={this.state.langKeys.filter(item => item.value == props.langKey)}
                                    onChange={(item: any, e) => events.onInputChange(props, "langKey", item.value)}
                                />
                            </div>
                            <div className="col-md-12">
                                <button type={"button"} className="btn btn-gradient-primary btn-lg" onClick={() => events.onCreateGroupType(props._id)}>+ Tip Olustur</button>
                            </div>
                            <div className="col-md-12">
                                {
                                    props.types.map(themeGroupType => TypeInfo(themeGroupType))
                                }
                            </div>
                            <div className="col-md-12">
                                <button type={"button"} className="btn btn-gradient-success btn-lg" onClick={() => events.onAcceptNewGroup(props._id)}>Tamam</button>
                            </div>
                        </div>
                    </ThemeFieldSet>
                </div>
            )
        }


        return (
            <div className="row">
                <div className="col-md-12">
                    <button type={"button"} className="btn btn-gradient-success btn-lg" onClick={() => events.onCreateGroup()}>+ Grup Olustur</button>
                </div>
                <div className="col-md-12 mt-2">
                    <div className="row">
                        {
                            this.state.newThemeGroups.map(themeGroup => NewGroup(themeGroup))
                        }
                    </div>
                    <div className="row">
                        {
                            this.state.formData.themeGroups?.map(themeGroup => Group(themeGroup))
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
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
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
                </div>
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
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={this.props.router.t("shortContent").toCapitalizeCase()}
                        name="contents.shortContent"
                        type="textarea"
                        value={this.state.formData.contents.shortContent}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>

                {
                    this.state.formData.typeId != PostTypeId.Page
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
                <div className="col-md-7 mb-3">
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
                </div>
            </div>
        );
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-post">
                <this.Messages/>
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
                                        <Tab eventKey="content" title={this.props.router.t("content")}>
                                            {
                                                (this.state.formActiveKey === "content")
                                                    ? <this.TabContent/>
                                                    : ""
                                            }
                                        </Tab>
                                        {
                                            this.state.formData.typeId == PostTypeId.Page
                                                ? <Tab eventKey="theme" title={this.props.router.t("theme")}>
                                                    <this.TabTheme/>
                                                </Tab> : null
                                        }
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
