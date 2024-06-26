import React, {Component} from 'react'
import {PageTypeId, PageTypes, PostTermTypeId, PostTypeId, PostTypes, Status, StatusId} from "constants/index";
import {PagePropCommonDocument} from "types/app/pageProps";
import {TableColumn} from "react-data-table-component";
import {ThemeTableToggleMenu} from "components/table";
import Swal from "sweetalert2";
import postService from "services/post.service";
import PostDocument from "types/services/post";
import Spinner from "components/tools/spinner";
import Thread from "library/thread";
import imageSourceUtil from "utils/imageSource.util";
import classNameUtil from "utils/className.util";
import permissionUtil from "utils/permission.util";
import ThemeToast from "components/toast";
import PagePaths from "constants/pagePaths";
import ThemeDataTable from "components/table/dataTable";

type PageState = {
    searchKey: string
    posts: PostDocument[],
    showingPosts: PageState["posts"]
    selectedPosts: PageState["posts"]
    listMode: "list" | "deleted"
    isShowToggleMenu: boolean
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export default class PagePostList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            searchKey: "",
            selectedPosts: [],
            listMode: "list",
            isShowToggleMenu: false,
            posts: [],
            showingPosts: [],
            isLoading: true,
        }
    }

    async componentDidMount() {
        this.setPageTitle();
        await this.getPosts();
        this.setState({
            isLoading: false
        })
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.getPosts();
        }
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t(PostTypes.findSingle("id", this.props.getPageData.searchParams.postTypeId)?.langKey ?? "[noLangAdd]"),
            this.props.router.t("list")
        ])
    }

    async getPosts() {
        let posts = (await postService.get({
            typeId: this.props.getPageData.searchParams.postTypeId,
            langId: this.props.getPageData.langId
        })).data;
        this.setState((state: PageState) => {
            state.posts = posts;
            state.showingPosts = posts.filter(value => value.statusId !== StatusId.Deleted);
            return state;
        });
    }

    onChangeStatus = (event: any, statusId: number) => {
        event.preventDefault();
        let selectedPostId = this.state.selectedPosts.map(post => post._id);
        if (statusId === StatusId.Deleted && this.state.listMode === "deleted") {
            Swal.fire({
                title: this.props.router.t("deleteAction"),
                text: this.props.router.t("deleteSelectedItemsQuestion"),
                confirmButtonText: this.props.router.t("yes"),
                cancelButtonText: this.props.router.t("no"),
                icon: "question",
                showCancelButton: true
            }).then(result => {
                if (result.isConfirmed) {
                    const loadingToast = new ThemeToast({
                        content: this.props.router.t("deleting"),
                        type: "loading"
                    });

                    postService.delete({
                        postId: selectedPostId,
                        typeId: this.props.getPageData.searchParams.postTypeId
                    }).then(resData => {
                        loadingToast.hide();
                        if (resData.status) {
                            this.setState((state: PageState) => {
                                state.posts = state.posts.filter(item => !selectedPostId.includes(item._id));
                                return state;
                            }, () => {
                                new ThemeToast({
                                    type: "success",
                                    title: this.props.router.t("successful"),
                                    content: this.props.router.t("itemDeleted")
                                })
                                this.onChangeListMode(this.state.listMode);
                            })
                        }
                    })
                }
            })
        } else {
            const loadingToast = new ThemeToast({
                content: this.props.router.t("updating"),
                type: "loading"
            });
            postService.updateStatus({
                postId: selectedPostId,
                typeId: this.props.getPageData.searchParams.postTypeId,
                statusId: statusId
            }).then(resData => {
                loadingToast.hide();
                if (resData.status) {
                    this.setState((state: PageState) => {
                        state.posts.map((item, index) => {
                            if (selectedPostId.includes(item._id)) {
                                item.statusId = statusId;
                            }
                        })
                        return state;
                    }, () => {
                        new ThemeToast({
                            type: "success",
                            title: this.props.router.t("successful"),
                            content: this.props.router.t("statusUpdated")
                        })
                        this.onChangeListMode(this.state.listMode);
                    })
                }
            })
        }
    }

    onSelect(selectedRows: PageState["showingPosts"]) {
        this.setState((state: PageState) => {
            state.selectedPosts = selectedRows;
            state.isShowToggleMenu = selectedRows.length > 0;
            return state;
        })
    }

    onSearch(searchKey: string) {
        this.setState({
            searchKey: searchKey,
            showingPosts: this.state.showingPosts.filter(post => (post.contents?.title ?? "").toLowerCase().search(searchKey) > -1)
        })
    }

    onChangeListMode(mode: PageState["listMode"]) {
        this.setState((state: PageState) => {
            state.listMode = mode;
            state.showingPosts = [];
            state.selectedPosts = [];
            state.isShowToggleMenu = false;
            if (mode === "list") {
                state.showingPosts = state.posts.findMulti("statusId", StatusId.Deleted, false);
            } else {
                state.showingPosts = state.posts.findMulti("statusId", StatusId.Deleted);
            }
            return state;
        }, () => this.onSearch(this.state.searchKey))
    }

    navigateTermPage(type: "termEdit" | "edit", itemId = "", termTypeId = 0) {
        let postTypeId = this.props.getPageData.searchParams.postTypeId;
        let pagePath = [PostTypeId.Page, PostTypeId.Navigate].includes(Number(postTypeId)) ? PagePaths.post(postTypeId) : PagePaths.themeContent().post(postTypeId);
        let path = (type === "edit")
            ? pagePath.edit(itemId)
            : (type === "termEdit" && itemId)
                ? pagePath.term(termTypeId).edit(itemId)
                : pagePath.term(termTypeId).list()
        this.props.router.navigate(path, {replace: true});
    }

    get getTableColumns(): TableColumn<PageState["showingPosts"][0]>[] {
        return [
            (
                ![PostTypeId.Navigate].includes(Number(this.props.getPageData.searchParams.postTypeId))
                    ? {
                        name: this.props.router.t("image"),
                        width: "75px",
                        cell: row => {
                            return <div className="image pt-2 pb-2">
                                <img
                                    src={imageSourceUtil.getUploadedImageSrc(row.contents?.image)}
                                    alt={row.contents?.title}
                                    className="post-image"
                                />
                            </div>
                        }
                    } : {}
            ),
            {
                name: this.props.router.t("title"),
                selector: row => row.contents?.title || this.props.router.t("[noLangAdd]"),
                cell: row => (
                    <div className="row w-100">
                        <div className="col-md-8">{row.contents?.title || this.props.router.t("[noLangAdd]")}</div>
                        <div className="col-md-4">
                            {
                                row.isFixed
                                    ? <i className="mdi mdi-pin text-success fs-5"></i>
                                    : null
                            }
                        </div>
                    </div>
                ),
                width: "250px",
                sortable: true
            },
            (
                [PostTypeId.Navigate].includes(Number(this.props.getPageData.searchParams.postTypeId))
                    ? {
                        name: this.props.router.t("main"),
                        selector: row => row.mainId ? row.mainId.contents?.title || this.props.router.t("[noLangAdd]") : this.props.router.t("notSelected"),
                        sortable: true
                    } : {}
            ),
            (
                ![PostTypeId.Slider, PostTypeId.Page, PostTypeId.Service, PostTypeId.Testimonial, PostTypeId.Navigate].includes(Number(this.props.getPageData.searchParams.postTypeId))
                    ? {
                        name: this.props.router.t("category"),
                        cell: row => row.terms.findMulti("typeId", PostTermTypeId.Category).length > 0
                            ? row.terms.map(item => {
                                    if (item.typeId == PostTermTypeId.Category) {
                                        return <label
                                            onClick={() => this.navigateTermPage("termEdit", item._id, row.typeId)}
                                            className={`badge badge-gradient-success me-1 cursor-pointer`}
                                        >{item.contents?.title || this.props.router.t("[noLangAdd]")}</label>
                                    }
                                    return null;
                                }
                            ) : this.props.router.t("notSelected")

                    } : {}
            ),
            (
                [PostTypeId.Page, PostTypeId.Blog, PostTypeId.Portfolio, PostTypeId.Service].includes(Number(this.props.getPageData.searchParams.postTypeId))
                    ? {
                        name: this.props.router.t("views"),
                        selector: row => row.views,
                        sortable: true
                    } : {}
            ),
            (
                [PostTypeId.Page].includes(Number(this.props.getPageData.searchParams.postTypeId))
                    ? {
                        name: this.props.router.t("pageType"),
                        selector: row => this.props.router.t(PageTypes.findSingle("id", (row.pageTypeId ? row.pageTypeId : PageTypeId.Default))?.langKey ?? "[noLangAdd]"),
                        sortable: true,
                        cell: row => (
                            <label className={`badge badge-gradient-dark`}>
                                {
                                    this.props.router.t(PageTypes.findSingle("id", (row.pageTypeId ? row.pageTypeId : PageTypeId.Default))?.langKey ?? "[noLangAdd]")
                                }
                            </label>
                        )
                    } : {}
            ),
            {
                name: this.props.router.t("status"),
                sortable: true,
                cell: row => (
                    <label className={`badge badge-gradient-${classNameUtil.getStatusClassName(row.statusId)}`}>
                        {
                            this.props.router.t(Status.findSingle("id", row.statusId)?.langKey ?? "[noLangAdd]")
                        }
                    </label>
                )
            },
            {
                name: this.props.router.t("updatedBy"),
                sortable: true,
                selector: row => row.lastAuthorId.name
            },
            {
                name: "",
                width: "70px",
                button: true,
                cell: row => permissionUtil.checkPermission(
                    this.props.getSessionData.roleId,
                    this.props.getSessionData.permissions,
                    permissionUtil.getPermissionIdForPostType(row.typeId, "Edit")
                ) ? (
                    <button
                        onClick={() => this.navigateTermPage("edit", row._id)}
                        className="btn btn-gradient-warning"
                    ><i className="fa fa-pencil-square-o"></i></button>
                ) : null
            }
        ].filter(column => typeof column.name !== "undefined");
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-post">
                <div className="row mb-3">
                    <div className="col-md-3">
                        <div className="row">
                            {
                                ![PostTypeId.Slider, PostTypeId.Page, PostTypeId.Service, PostTypeId.Testimonial, PostTypeId.Navigate, PostTypeId.Reference].includes(Number(this.props.getPageData.searchParams.postTypeId))
                                    ? <div className="col-6">
                                        <button className="btn btn-gradient-info btn-lg w-100"
                                                onClick={() => this.navigateTermPage("termEdit", "", PostTermTypeId.Category)}>
                                            <i className="fa fa-pencil-square-o"></i> {this.props.router.t("editCategories").toCapitalizeCase()}
                                        </button>
                                    </div> : null
                            }
                            {
                                ![PostTypeId.Slider, PostTypeId.Service, PostTypeId.Testimonial, PostTypeId.Navigate, PostTypeId.Reference].includes(Number(this.props.getPageData.searchParams.postTypeId))
                                    ? <div className="col-6 text-end">
                                        <button className="btn btn-gradient-primary btn-edit-tag btn-lg w-100"
                                                onClick={() => this.navigateTermPage("termEdit", "", PostTermTypeId.Tag)}>
                                            <i className="fa fa-pencil-square-o"></i> {this.props.router.t("editTags").toCapitalizeCase()}
                                        </button>
                                    </div> : null
                            }
                        </div>
                    </div>
                    <div className="col-md-9 text-end">
                        {
                            this.state.listMode === "list"
                                ? <button className="btn btn-gradient-danger btn-lg list-mode-btn"
                                          onClick={() => this.onChangeListMode("deleted")}>
                                    <i className="mdi mdi-delete"></i> {this.props.router.t("trash")} ({this.state.posts.findMulti("statusId", StatusId.Deleted).length})
                                </button>
                                : <button className="btn btn-gradient-success btn-lg list-mode-btn"
                                          onClick={() => this.onChangeListMode("list")}>
                                    <i className="mdi mdi-view-list"></i> {this.props.router.t("list")} ({this.state.posts.findMulti("statusId", StatusId.Deleted, false).length})
                                </button>
                        }
                    </div>
                </div>
                <div className="grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-post">
                                <div className={`ms-2 ${!this.state.isShowToggleMenu ? "invisible" : ""}`}>
                                    {
                                        (
                                            permissionUtil.checkPermission(
                                                this.props.getSessionData.roleId,
                                                this.props.getSessionData.permissions,
                                                permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Edit")
                                            ) ||
                                            permissionUtil.checkPermission(
                                                this.props.getSessionData.roleId,
                                                this.props.getSessionData.permissions,
                                                permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Delete")
                                            )
                                        ) ? <ThemeTableToggleMenu
                                            t={this.props.router.t}
                                            status={
                                                [
                                                    StatusId.Active,
                                                    StatusId.Pending,
                                                    StatusId.InProgress
                                                ].concat(
                                                    permissionUtil.checkPermission(
                                                        this.props.getSessionData.roleId,
                                                        this.props.getSessionData.permissions,
                                                        permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Delete")
                                                    ) ? [StatusId.Deleted] : []
                                                )
                                            }
                                            onChange={(event, statusId) => this.onChangeStatus(event, statusId)}
                                            langId={this.props.getSessionData.langId}
                                        /> : null
                                    }
                                </div>
                                <ThemeDataTable
                                    columns={this.getTableColumns}
                                    data={this.state.showingPosts}
                                    onSelect={rows => this.onSelect(rows)}
                                    onSearch={searchKey => this.onSearch(searchKey)}
                                    selectedRows={this.state.selectedPosts}
                                    t={this.props.router.t}
                                    isSelectable={true}
                                    isAllSelectable={true}
                                    isSearchable={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
