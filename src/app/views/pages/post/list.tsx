import React, {Component} from 'react'
import {PageTypeId, PageTypes, PostTermTypeId, PostTypeId, PostTypes, Status, StatusId} from "../../../../constants";
import {pageRoutes} from "../../../routes";
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import DataTable, {TableColumn} from "react-data-table-component";
import {ThemeFormCheckBox} from "../../components/form";
import {ThemeTableToggleMenu} from "../../components/table";
import Swal from "sweetalert2";
import postService from "../../../../services/post.service";
import PostDocument from "../../../../types/services/post";
import Spinner from "../../tools/spinner";
import Thread from "../../../../library/thread";
import imageSourceUtil from "../../../../utils/functions/imageSource.util";
import classNameUtil from "../../../../utils/functions/className.util";
import permissionUtil from "../../../../utils/functions/permission.util";
import ThemeToast from "../../components/toast";

type PageState = {
    posts: PostDocument[],
    showingPosts: PageState["posts"]
    selectedPosts: string[]
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
        console.log(this.props)
        this.props.setBreadCrumb([
            this.props.router.t(PostTypes.findSingle("id", this.props.getPageData.searchParams.postTypeId).langKey),
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
            state.showingPosts = posts.filter(value => value.statusId !== StatusId.Deleted);
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
                                state.posts = state.posts.filter(item => !state.selectedPosts.includes(item._id));
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
                            if (state.selectedPosts.includes(item._id)) {
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

    onSelect(allSelected: boolean, selectedCount: number, selectedRows: PageState["showingPosts"]) {
        this.setState((state: PageState) => {
            state.selectedPosts = [];
            selectedRows.forEach(item => state.selectedPosts.push(item._id))
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
                state.showingPosts = state.posts.findMulti("statusId", StatusId.Deleted, false);
            } else {
                state.showingPosts = state.posts.findMulti("statusId", StatusId.Deleted);
            }
            state.checkedRowsClear = !this.state.checkedRowsClear;
            return state;
        })
    }

    navigateTermPage(type: "termEdit" | "edit", itemId = "", termTypeId = 0) {
        let path = (type === "edit")
            ? pageRoutes.post.path(this.props.getPageData.searchParams.postTypeId) + pageRoutes.post.edit.path(itemId)
            : (itemId)
                ? pageRoutes.postTerm.path(this.props.getPageData.searchParams.postTypeId, termTypeId) + pageRoutes.postTerm.edit.path(itemId)
                : pageRoutes.postTerm.path(this.props.getPageData.searchParams.postTypeId, termTypeId) + pageRoutes.postTerm.list.path();
        path = (this.props.router.location.pathname.search(pageRoutes.themeContent.path()) > -1) ? pageRoutes.themeContent.path() + path : path;
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
                ![PostTypeId.Slider, PostTypeId.Testimonial, PostTypeId.Navigate].includes(Number(this.props.getPageData.searchParams.postTypeId))
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
                        selector: row => this.props.router.t(PageTypes.findSingle("id", (row.pageTypeId ? row.pageTypeId : PageTypeId.Default)).langKey),
                        sortable: true,
                        cell: row => (
                            <label className={`badge badge-gradient-dark`}>
                                {
                                    this.props.router.t(PageTypes.findSingle("id", (row.pageTypeId ? row.pageTypeId : PageTypeId.Default)).langKey)
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
                            this.props.router.t(Status.findSingle("id", row.statusId).langKey)
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
                <div className="row">
                    <div className="col-md-3 mb-3">
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
                    <div className="col-md-9 mb-3 text-end">
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
                                            {...this.props}
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
                                        data={this.state.showingPosts.orderBy("order", "asc")}
                                        conditionalRowStyles={[
                                            {
                                                when: row => row.statusId != StatusId.Active || new Date().diffDays(new Date(row.dateStart)) > 0,
                                                classNames: ["bg-gradient-danger-light"]
                                            }
                                        ]}
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
