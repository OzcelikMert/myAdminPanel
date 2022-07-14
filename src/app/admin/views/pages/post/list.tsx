import React, {Component} from 'react'
import {LanguageId, PostTermTypeId, PostTypeContents, StatusContents, StatusId} from "../../../../../public/static";
import {GlobalPaths} from "../../../../../config/global/";
import {pageRoutes} from "../../../routes";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import {GlobalFunctions} from "../../../../../config/global";
import {PostDocument} from "../../../../../modules/ajax/result/data";
import Services from "../../../../../services";
import {PostPutParamDocument} from "../../../../../modules/services/put/post";
import DataTable, {TableColumn} from "react-data-table-component";
import {ThemeFormCheckBox} from "../../components/form";
import {ThemeTableToggleMenu} from "../../components/table";
import Swal from "sweetalert2";
import {PostGetParamDocument} from "../../../../../modules/services/get/post";


type PageState = {
    posts: PostDocument[],
    showingPosts: PageState["posts"]
    selectedPosts: number[]
    listMode: "list" | "deleted"
    isShowToggleMenu: boolean
    checkedRowsClear: boolean
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
            showingPosts: []
        }
    }

    componentDidMount() {
        this.setPageTitle();
        this.getPosts();
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.getPosts();
        }
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            GlobalFunctions.getStaticContent(
                PostTypeContents,
                "typeId",
                this.props.getPageData.searchParams.postTypeId,
                this.props.getSessionData.langId
            )
        ])
    }

    getPosts() {
        let params: PostGetParamDocument = {
            typeId: this.props.getPageData.searchParams.postTypeId,
            langId: this.props.getPageData.langId
        };
        let posts: PageState["posts"] = Services.Get.posts(params).data;
        this.setState((state: PageState) => {
            state.posts = posts;
            state.showingPosts = posts.filter(value => value.postStatusId !== StatusId.Deleted);
            return state;
        });
    }

    onChangeStatus = (event: any, statusId: number) => {
        event.preventDefault();
        const params: PostPutParamDocument = {
            postId: this.state.selectedPosts,
            statusId: statusId
        }

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
                    Services.Delete.post(params).then(resData => {
                        if (resData.status) {
                            this.setState((state: PageState) => {
                                state.posts = state.posts.filter(item => !state.selectedPosts.includes(item.postId));
                                return state;
                            })
                            this.onChangeListMode(this.state.listMode);
                        }
                    })
                }
            })
        } else {
            Services.Put.post(params).then(resData => {
                if (resData.status) {
                    this.setState((state: PageState) => {
                        state.posts.map((item, index) => {
                            if (state.selectedPosts.includes(item.postId)) {
                                item.postStatusId = statusId;
                            }
                        })
                        return state;
                    })
                    this.onChangeListMode(this.state.listMode);
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
            state.posts.map(value => {
                if (
                    (mode === "list" && value.postStatusId !== StatusId.Deleted) ||
                    (mode === "deleted" && value.postStatusId === StatusId.Deleted)
                ) state.showingPosts.push(value);
            });
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
                            src={GlobalFunctions.getUploadedImageSrc(row.postContentImage)}
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
                    <label className={`badge badge-gradient-${GlobalFunctions.getStatusClassName(row.postStatusId)}`}>
                        {
                            GlobalFunctions.getStaticContent(
                                StatusContents,
                                "statusId",
                                row.postStatusId,
                                this.props.getSessionData.langId
                            )
                        }
                    </label>
                )
            },
            {
                name: this.props.router.t("edit"),
                width: "70px",
                button: true,
                cell: row => (
                    <button
                        onClick={() => this.navigateTermPage("edit", row.postId)}
                        className="btn btn-gradient-warning"
                    ><i className="fa fa-pencil-square-o"></i></button>
                )
            }
        ];
    }

    render() {
        return this.props.getPageData.searchParams.postTypeId == 0 ? null : (
            <div className="page-post">
                <div className="navigate-buttons mb-3">
                    <button className="btn btn-gradient-info btn-lg"
                            onClick={() => this.navigateTermPage("termEdit", 0, PostTermTypeId.Category)}>{this.props.router.t("editCategories")}</button>
                    <button className="btn btn-gradient-primary btn-lg ms-3"
                            onClick={() => this.navigateTermPage("termEdit", 0, PostTermTypeId.Tag)}>{this.props.router.t("editTags")}</button>
                    {
                        this.state.listMode === "list"
                            ? <button className="btn btn-gradient-danger btn-lg ms-3"
                                      onClick={() => this.onChangeListMode("deleted")}>
                                <i className="mdi mdi-delete"></i> {this.props.router.t("trash")}
                            </button>
                            : <button className="btn btn-gradient-success btn-lg ms-3"
                                      onClick={() => this.onChangeListMode("list")}>
                                <i className="mdi mdi-view-list"></i> {this.props.router.t("list")}
                            </button>
                    }
                </div>
                <div className="grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-post">
                                <div className={`ms-2 ${!this.state.isShowToggleMenu ? "invisible" : ""}`}>
                                    <ThemeTableToggleMenu
                                        status={[
                                            StatusId.Active,
                                            StatusId.Pending,
                                            StatusId.InProgress,
                                            StatusId.Deleted
                                        ]}
                                        onChange={(event, statusId) => this.onChangeStatus(event, statusId)}
                                        langId={this.props.getSessionData.langId}
                                    />
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
