import React, {Component} from 'react'
import {
    PostTermTypeId,
    PostTypeContents, PostTypeId,
    StatusContents,
    StatusId
} from "../../../../public/static";
import {pageRoutes} from "../../../routes";
import {PagePropCommonDocument} from "../../../../modules/app/admin/pageProps";
import DataTable, {TableColumn} from "react-data-table-component";
import {ThemeFormCheckBox} from "../../components/form";
import {ThemeTableToggleMenu} from "../../components/table";
import Swal from "sweetalert2";
import postService from "../../../../services/post.service";
import PostDocument from "../../../../modules/services/post";
import Spinner from "../../tools/spinner";
import Thread from "../../../../library/thread";
import staticContentUtil from "../../../../utils/functions/staticContent.util";
import imageSourceUtil from "../../../../utils/functions/imageSource.util";
import classNameUtil from "../../../../utils/functions/className.util";
import permissionUtil from "../../../../utils/functions/permission.util";
import ThemeToast from "../../components/toast";


type PageState = {
    posts: PostDocument[],
    showingPosts: PageState["posts"]
    selectedPosts: number[]
    listMode: "list" | "deleted"
    isShowToggleMenu: boolean
    checkedRowsClear: boolean
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PagePostList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            checkedRowsClear: false,
            selectedPosts: [],
            listMode: "list",
            isShowToggleMenu: false,
            posts: [],
            showingPosts: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        this.setPageTitle();
        Thread.start(() => {
            this.getPosts();
            this.setState({
                isLoading: false
            })
        })
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.getPosts();
        }
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            staticContentUtil.getStaticContent(
                PostTypeContents,
                "typeId",
                this.props.getPageData.searchParams.postTypeId
            ),
            this.props.router.t("list")
        ])
    }

    getPosts() {
        let posts = postService.get({
            typeId: this.props.getPageData.searchParams.postTypeId,
            langId: this.props.getPageData.langId
        }).data;
        this.setState((state: PageState) => {
            state.posts = posts;
            state.showingPosts = posts.filter(value => value.postStatusId !== StatusId.Deleted);
            return state;
        });
    }

    onChangeStatus = (event: any, statusId: number) => {
        event.preventDefault();
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
                        postId: this.state.selectedPosts,
                        typeId: this.props.getPageData.searchParams.postTypeId
                    }).then(resData => {
                        loadingToast.hide();
                        if (resData.status) {
                            this.setState((state: PageState) => {
                                state.posts = state.posts.filter(item => !state.selectedPosts.includes(item.postId));
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
                postId: this.state.selectedPosts,
                typeId: this.props.getPageData.searchParams.postTypeId,
                statusId: statusId
            }).then(resData => {
                loadingToast.hide();
                if (resData.status) {
                    this.setState((state: PageState) => {
                        state.posts.map((item, index) => {
                            if (state.selectedPosts.includes(item.postId)) {
                                item.postStatusId = statusId;
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

    onSelect(allSelected: boolean, selectedCount: number, selectedRows: PageState["showingPosts"]) {
        this.setState((state: PageState) => {
            state.selectedPosts = [];
            selectedRows.forEach(item => state.selectedPosts.push(item.postId))
            state.isShowToggleMenu = selectedCount > 0;
            return state;
        })
    }

    onChangeListMode(mode: PageState["listMode"]) {
        this.setState((state: PageState) => {
            state.listMode = mode;
            state.showingPosts = [];
            state.selectedPosts = [];
            state.isShowToggleMenu = false;
            if (mode === "list") {
                state.showingPosts = state.posts.findMulti("postStatusId", StatusId.Deleted, false);
            } else {
                state.showingPosts = state.posts.findMulti("postStatusId", StatusId.Deleted);
            }
            state.checkedRowsClear = !this.state.checkedRowsClear;
            return state;
        })
    }

    navigateTermPage(type: "termEdit" | "edit", itemId = 0, termTypeId = 0) {
        let path = (type === "edit")
            ? pageRoutes.post.path(this.props.getPageData.searchParams.postTypeId) + pageRoutes.post.edit.path(itemId)
            : (itemId > 0)
                ? pageRoutes.postTerm.path(this.props.getPageData.searchParams.postTypeId, termTypeId) + pageRoutes.postTerm.edit.path(itemId)
                : pageRoutes.postTerm.path(this.props.getPageData.searchParams.postTypeId, termTypeId) + pageRoutes.postTerm.list.path();
        path = (this.props.router.location.pathname.search(pageRoutes.themeContent.path()) > -1) ? pageRoutes.themeContent.path() + path : path;
        this.props.router.navigate(path, {replace: true});
    }

    get getTableColumns(): TableColumn<PageState["showingPosts"][0]>[] {
        return [
            {
                name: this.props.router.t("image"),
                width: "75px",
                cell: row => (
                    <div className="image pt-2 pb-2">
                        <img
                            src={imageSourceUtil.getUploadedImageSrc(row.postContentImage)}
                            alt={row.postContentTitle}
                            className="post-image"
                        />
                    </div>
                )
            },
            {
                name: this.props.router.t("title"),
                selector: row => row.postContentTitle || this.props.router.t("[noLangAdd]"),
                sortable: true
            },
            {
                name: this.props.router.t("category"),
                cell: row => (
                    row.postTermContents.map(item => (item.postTermTypeId == PostTermTypeId.Category)
                        ? <label
                            onClick={() => this.navigateTermPage("termEdit", item.postTermId, PostTermTypeId.Category)}
                            className={`badge badge-gradient-success me-1 cursor-pointer category-badge`}
                        >{item.postTermContentTitle || this.props.router.t("[noLangAdd]")}</label>
                        : null
                    )
                )
            },
            {
                name: this.props.router.t("views"),
                selector: row => row.postViews,
                sortable: true
            },
            {
                name: this.props.router.t("status"),
                sortable: true,
                cell: row => (
                    <label className={`badge badge-gradient-${classNameUtil.getStatusClassName(row.postStatusId)}`}>
                        {
                            staticContentUtil.getStaticContent(
                                StatusContents,
                                "statusId",
                                row.postStatusId
                            )
                        }
                    </label>
                )
            },
            {
                name: "",
                width: "70px",
                button: true,
                cell: row => permissionUtil.checkPermission(
                    this.props.getSessionData.roleId,
                    this.props.getSessionData.permissions,
                    permissionUtil.getPermissionIdForPostType(row.postTypeId, "Edit")
                ) ? (
                    <button
                        onClick={() => this.navigateTermPage("edit", row.postId)}
                        className="btn btn-gradient-warning"
                    ><i className="fa fa-pencil-square-o"></i></button>
                ) : null
            }
        ];
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-post">
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <div className="row">
                            {
                                this.props.getPageData.searchParams.postTypeId != PostTypeId.Page
                                    ? <div className="col-6">
                                        <button className="btn btn-gradient-info btn-lg w-100"
                                                onClick={() => this.navigateTermPage("termEdit", 0, PostTermTypeId.Category)}>
                                            <i className="fa fa-pencil-square-o"></i> {this.props.router.t("editCategories").toCapitalizeCase()}
                                        </button>
                                    </div> : null
                            }
                            <div className="col-6 text-end">
                                <button className="btn btn-gradient-primary btn-lg w-100"
                                        onClick={() => this.navigateTermPage("termEdit", 0, PostTermTypeId.Tag)}>
                                    <i className="fa fa-pencil-square-o"></i> {this.props.router.t("editTags").toCapitalizeCase()}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 mb-3 text-end">
                        {
                            this.state.listMode === "list"
                                ? <button className="btn btn-gradient-danger btn-lg list-mode-btn"
                                          onClick={() => this.onChangeListMode("deleted")}>
                                    <i className="mdi mdi-delete"></i> {this.props.router.t("trash")} ({this.state.posts.findMulti("postStatusId", StatusId.Deleted).length})
                                </button>
                                : <button className="btn btn-gradient-success btn-lg list-mode-btn"
                                          onClick={() => this.onChangeListMode("list")}>
                                    <i className="mdi mdi-view-list"></i> {this.props.router.t("list")} ({this.state.posts.findMulti("postStatusId", StatusId.Deleted, false).length})
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
                                        permissionUtil.checkPermission(
                                            this.props.getSessionData.roleId,
                                            this.props.getSessionData.permissions,
                                            permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Edit")
                                        ) ? <ThemeTableToggleMenu
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
                                <div className="table-responsive">
                                    <DataTable
                                        columns={this.getTableColumns}
                                        data={this.state.showingPosts}
                                        noHeader
                                        fixedHeader
                                        defaultSortAsc={false}
                                        pagination
                                        highlightOnHover
                                        selectableRows
                                        onSelectedRowsChange={selected => this.onSelect(selected.allSelected, selected.selectedCount, selected.selectedRows)}
                                        selectableRowsComponent={ThemeFormCheckBox}
                                        clearSelectedRows={this.state.checkedRowsClear}
                                        noDataComponent={
                                            <h5>
                                                {this.props.router.t("noRecords")} <i
                                                className="mdi mdi-emoticon-sad-outline"></i>
                                            </h5>
                                        }
                                        paginationComponentOptions={{
                                            noRowsPerPage: true,
                                            rangeSeparatorText: "/",
                                            rowsPerPageText: "",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PagePostList;
