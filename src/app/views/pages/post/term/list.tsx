import React, {Component} from 'react'
import {
    PostTermTypeContents,
    PostTypeContents,
    StatusContents,
    StatusId
} from "../../../../../public/static";
import {pageRoutes} from "../../../../routes";
import {PagePropCommonDocument} from "../../../../../modules/app/admin/pageProps";
import DataTable, {TableColumn} from "react-data-table-component";
import {ThemeFormCheckBox} from "../../../components/form";
import {ThemeTableToggleMenu} from "../../../components/table";
import Swal from "sweetalert2";
import PostTermDocument from "../../../../../modules/services/postTerm";
import postTermService from "../../../../../services/postTerm.service";
import Thread from "../../../../../library/thread";
import Spinner from "../../../tools/spinner";
import staticContentUtil from "../../../../../utils/functions/staticContent.util";
import imageSourceUtil from "../../../../../utils/functions/imageSource.util";
import classNameUtil from "../../../../../utils/functions/className.util";
import permissionUtil from "../../../../../utils/functions/permission.util";
import ThemeToast from "../../../components/toast";

type PageState = {
    postTerms: PostTermDocument[],
    showingPostTerms: PageState["postTerms"]
    selectedPostTerms: number[]
    listMode: "list" | "deleted"
    isShowToggleMenu: boolean
    checkedRowsClear: boolean
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PagePostTermList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            checkedRowsClear: false,
            selectedPostTerms: [],
            listMode: "list",
            isShowToggleMenu: false,
            postTerms: [],
            showingPostTerms: [],
            isLoading: true
        }
    }

    componentDidMount() {
        this.setPageTitle();

        Thread.start(() => {
            this.getPostTerms();
            this.setState({
                isLoading: false
            })
        })
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            staticContentUtil.getStaticContent(PostTypeContents, "typeId", this.props.getPageData.searchParams.postTypeId),
            staticContentUtil.getStaticContent(PostTermTypeContents, "typeId", this.props.getPageData.searchParams.termTypeId)
        ])
    }

    getPostTerms() {
        let postTerms = postTermService.get({
            typeId: this.props.getPageData.searchParams.termTypeId,
            postTypeId: this.props.getPageData.searchParams.postTypeId,
            langId: this.props.getPageData.mainLangId
        }).data;
        this.setState({
            postTerms: postTerms,
            showingPostTerms: postTerms.filter(value => value.postTermStatusId !== StatusId.Deleted)
        })
    }

    onChangeStatus(event: any, statusId: number) {
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

                    postTermService.delete({
                        termId: this.state.selectedPostTerms,
                        typeId: this.props.getPageData.searchParams.termTypeId,
                        postTypeId: this.props.getPageData.searchParams.postTypeId
                    }).then(resData => {
                        loadingToast.hide();
                        if (resData.status) {
                            this.setState((state: PageState) => {
                                state.postTerms = state.postTerms.filter(item => !state.selectedPostTerms.includes(item.postTermId))
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

            postTermService.updateStatus({
                termId: this.state.selectedPostTerms,
                typeId: this.props.getPageData.searchParams.termTypeId,
                postTypeId: this.props.getPageData.searchParams.postTypeId,
                statusId: statusId
            }).then(resData => {
                loadingToast.hide();
                if (resData.status) {
                    this.setState((state: PageState) => {
                        state.postTerms.map((item, index) => {
                            if (state.selectedPostTerms.includes(item.postTermId)) {
                                item.postTermStatusId = statusId;
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

    onSelect(allSelected: boolean, selectedCount: number, selectedRows: PageState["showingPostTerms"]) {
        this.setState((state: PageState) => {
            state.selectedPostTerms = [];
            selectedRows.forEach(item => state.selectedPostTerms.push(item.postTermId))
            state.isShowToggleMenu = selectedCount > 0;
            return state;
        })
    }

    onChangeListMode(mode: PageState["listMode"]) {
        this.setState((state: PageState) => {
            state.listMode = mode;
            state.showingPostTerms = [];
            state.selectedPostTerms = [];
            state.isShowToggleMenu = false;
            if(mode === "list") {
                state.showingPostTerms = state.postTerms.findMulti("postTermStatusId", StatusId.Deleted, false);
            }else {
                state.showingPostTerms = state.postTerms.findMulti("postTermStatusId", StatusId.Deleted);
            }
            state.checkedRowsClear = !this.state.checkedRowsClear;
            return state;
        })
    }

    navigateTermPage(type: "add" | "back" | "edit", postTermId = 0) {
        let path = (type === "add")
            ? pageRoutes.postTerm.path(this.props.getPageData.searchParams.postTypeId, this.props.getPageData.searchParams.termTypeId) + pageRoutes.postTerm.add.path()
            : (type === "edit")
                ? pageRoutes.postTerm.path(this.props.getPageData.searchParams.postTypeId, this.props.getPageData.searchParams.termTypeId) + pageRoutes.postTerm.edit.path(postTermId)
                : pageRoutes.post.path(this.props.getPageData.searchParams.postTypeId) + pageRoutes.post.list.path();
        path = (this.props.router.location.pathname.search(pageRoutes.themeContent.path()) > -1) ? pageRoutes.themeContent.path() + path : path;
        this.props.router.navigate(path, {replace: true});
    }

    get getTableColumns(): TableColumn<PageState["showingPostTerms"][0]>[] {
        return [
            {
                name: this.props.router.t("image"),
                width: "75px",
                cell: row => (
                    <div className="image pt-2 pb-2">
                        <img
                            src={imageSourceUtil.getUploadedImageSrc(row.postTermContentImage)}
                            alt={row.postTermContentTitle}
                        />
                    </div>
                )
            },
            {
                name: this.props.router.t("name"),
                selector: row => row.postTermContentTitle || this.props.router.t("[noLangAdd]"),
                sortable: true,
            },
            {
                name: this.props.router.t("views"),
                selector: row => row.postTermViews,
                sortable: true
            },
            {
                name: this.props.router.t("status"),
                sortable: true,
                cell: row => (
                    <label
                        className={`badge badge-gradient-${classNameUtil.getStatusClassName(row.postTermStatusId)}`}>
                        {
                            staticContentUtil.getStaticContent(StatusContents, "statusId", row.postTermStatusId)
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
                    permissionUtil.getPermissionIdForPostType(row.postTermPostTypeId, "Edit")
                ) ? (
                    <button
                        className="btn btn-gradient-warning"
                        onClick={() => this.navigateTermPage("edit", row.postTermId)}
                    ><i className="fa fa-pencil-square-o"></i></button>
                ) : null
            }
        ];
    }

    render() {
        return this.state.isLoading ? <Spinner /> : (
            <div className="page-post-term">
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <div className="row">
                            <div className="col-6">
                                <button className="btn btn-gradient-dark btn-lg w-100" onClick={() => this.navigateTermPage("back")}>
                                    <i className="mdi mdi-arrow-left"></i> {this.props.router.t("returnBack")}
                                </button>
                            </div>
                            <div className="col-6 text-end">
                                {
                                    permissionUtil.checkPermission(
                                        this.props.getSessionData.roleId,
                                        this.props.getSessionData.permissions,
                                        permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Add")
                                    ) ? <button className="btn btn-gradient-info btn-lg w-100" onClick={() => this.navigateTermPage("add")}>
                                        + {this.props.router.t("addNew")}
                                    </button> : null
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 mb-3 text-end">
                        {
                            this.state.listMode === "list"
                                ? <button className="btn btn-gradient-danger btn-lg list-mode-btn"
                                          onClick={() => this.onChangeListMode("deleted")}>
                                    <i className="mdi mdi-delete"></i> {this.props.router.t("trash")} ({this.state.postTerms.findMulti("postTermStatusId", StatusId.Deleted).length})
                                </button>
                                : <button className="btn btn-gradient-success btn-lg list-mode-btn"
                                          onClick={() => this.onChangeListMode("list")}>
                                    <i className="mdi mdi-view-list"></i> {this.props.router.t("list")} ({this.state.postTerms.findMulti("postTermStatusId", StatusId.Deleted, false).length})
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
                                        data={this.state.showingPostTerms}
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

export default PagePostTermList;
