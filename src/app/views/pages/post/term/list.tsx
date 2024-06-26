import React, {Component} from 'react'
import {
    PostTermTypes, PostTypeId,
    PostTypes, Status,
    StatusId
} from "constants/index";
import {PagePropCommonDocument} from "types/app/pageProps";
import {TableColumn} from "react-data-table-component";
import {ThemeTableToggleMenu} from "components/table";
import Swal from "sweetalert2";
import PostTermDocument from "types/services/postTerm";
import postTermService from "services/postTerm.service";
import Thread from "library/thread";
import Spinner from "components/tools/spinner";
import imageSourceUtil from "utils/imageSource.util";
import classNameUtil from "utils/className.util";
import permissionUtil from "utils/permission.util";
import ThemeToast from "components/toast";
import PagePaths from "constants/pagePaths";
import ThemeDataTable from "components/table/dataTable";

type PageState = {
    searchKey: string
    postTerms: PostTermDocument[],
    showingPostTerms: PageState["postTerms"]
    selectedPostTerms: PageState["postTerms"]
    listMode: "list" | "deleted"
    isShowToggleMenu: boolean
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export default class PagePostTermList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            searchKey: "",
            selectedPostTerms: [],
            listMode: "list",
            isShowToggleMenu: false,
            postTerms: [],
            showingPostTerms: [],
            isLoading: true
        }
    }

    async componentDidMount() {
        this.setPageTitle();
        await this.getPostTerms();
        this.setState({
            isLoading: false
        })
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t(PostTypes.findSingle("id", this.props.getPageData.searchParams.postTypeId)?.langKey ?? "[noLangAdd]"),
            this.props.router.t(PostTermTypes.findSingle("id", this.props.getPageData.searchParams.termTypeId)?.langKey ?? "[noLangAdd]")
        ])
    }

    async getPostTerms() {
        let postTerms = (await postTermService.get({
            typeId: this.props.getPageData.searchParams.termTypeId,
            postTypeId: this.props.getPageData.searchParams.postTypeId,
            langId: this.props.getPageData.mainLangId
        })).data;
        this.setState({
            postTerms: postTerms,
            showingPostTerms: postTerms.filter(value => value.statusId !== StatusId.Deleted)
        })
    }

    onChangeStatus(event: any, statusId: number) {
        event.preventDefault();
        let selectedPostTermId = this.state.selectedPostTerms.map(postTerm => postTerm._id);

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
                        termId: selectedPostTermId,
                        typeId: this.props.getPageData.searchParams.termTypeId,
                        postTypeId: this.props.getPageData.searchParams.postTypeId
                    }).then(resData => {
                        loadingToast.hide();
                        if (resData.status) {
                            this.setState((state: PageState) => {
                                state.postTerms = state.postTerms.filter(item => !selectedPostTermId.includes(item._id))
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
                termId: selectedPostTermId,
                typeId: this.props.getPageData.searchParams.termTypeId,
                postTypeId: this.props.getPageData.searchParams.postTypeId,
                statusId: statusId
            }).then(resData => {
                loadingToast.hide();
                if (resData.status) {
                    this.setState((state: PageState) => {
                        state.postTerms.map((item, index) => {
                            if (selectedPostTermId.includes(item._id)) {
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

    onSelect(selectedRows: PageState["showingPostTerms"]) {
        this.setState((state: PageState) => {
            state.selectedPostTerms = selectedRows;
            state.isShowToggleMenu = selectedRows.length > 0;
            return state;
        })
    }

    onSearch(searchKey: string) {
        this.setState({
            searchKey: searchKey,
            showingPostTerms: this.state.showingPostTerms.filter(postTerm => (postTerm.contents?.title ?? "").toLowerCase().search(searchKey) > -1)
        })
    }

    onChangeListMode(mode: PageState["listMode"]) {
        this.setState((state: PageState) => {
            state.listMode = mode;
            state.showingPostTerms = [];
            state.selectedPostTerms = [];
            state.isShowToggleMenu = false;
            if (mode === "list") {
                state.showingPostTerms = state.postTerms.findMulti("statusId", StatusId.Deleted, false);
            } else {
                state.showingPostTerms = state.postTerms.findMulti("statusId", StatusId.Deleted);
            }
            return state;
        }, () => this.onSearch(this.state.searchKey))
    }

    navigateTermPage(type: "add" | "back" | "edit", postTermId = "") {
        let postTypeId = this.props.getPageData.searchParams.postTypeId;
        let postTermTypeId = this.props.getPageData.searchParams.termTypeId;
        let pagePath = [PostTypeId.Page, PostTypeId.Navigate].includes(Number(postTypeId)) ? PagePaths.post(postTypeId) : PagePaths.themeContent().post(postTypeId);
        let path = (type === "add")
            ? pagePath.term(postTermTypeId).add()
            : (type === "edit")
                ? pagePath.term(postTermTypeId).edit(postTermId)
                : pagePath.list();
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
                            src={imageSourceUtil.getUploadedImageSrc(row.contents?.image)}
                            alt={row.contents?.title}
                        />
                    </div>
                )
            },
            {
                name: this.props.router.t("name"),
                selector: row => row.contents?.title || this.props.router.t("[noLangAdd]"),
                sortable: true,
            },
            {
                name: this.props.router.t("main"),
                selector: row => row.mainId ? row.mainId.contents?.title || this.props.router.t("[noLangAdd]") : this.props.router.t("notSelected"),
                sortable: true
            },
            {
                name: this.props.router.t("views"),
                selector: row => row.views,
                sortable: true
            },
            {
                name: this.props.router.t("status"),
                sortable: true,
                cell: row => (
                    <label
                        className={`badge badge-gradient-${classNameUtil.getStatusClassName(row.statusId)}`}>
                        {
                            this.props.router.t(Status.findSingle("id", row.statusId)?.langKey ?? "[noLangAdd]")
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
                        className="btn btn-gradient-warning"
                        onClick={() => this.navigateTermPage("edit", row._id)}
                    ><i className="fa fa-pencil-square-o"></i></button>
                ) : null
            }
        ];
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-post-term">
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <div className="row">
                            <div className="col-6">
                                <button className="btn btn-gradient-dark btn-lg w-100"
                                        onClick={() => this.navigateTermPage("back")}>
                                    <i className="mdi mdi-arrow-left"></i> {this.props.router.t("returnBack")}
                                </button>
                            </div>
                            <div className="col-6 text-end">
                                {
                                    permissionUtil.checkPermission(
                                        this.props.getSessionData.roleId,
                                        this.props.getSessionData.permissions,
                                        permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Add")
                                    ) ? <button className="btn btn-gradient-info btn-lg w-100"
                                                onClick={() => this.navigateTermPage("add")}>
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
                                    <i className="mdi mdi-delete"></i> {this.props.router.t("trash")} ({this.state.postTerms.findMulti("statusId", StatusId.Deleted).length})
                                </button>
                                : <button className="btn btn-gradient-success btn-lg list-mode-btn"
                                          onClick={() => this.onChangeListMode("list")}>
                                    <i className="mdi mdi-view-list"></i> {this.props.router.t("list")} ({this.state.postTerms.findMulti("statusId", StatusId.Deleted, false).length})
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
                                    data={this.state.showingPostTerms}
                                    onSelect={rows => this.onSelect(rows)}
                                    onSearch={searchKey => this.onSearch(searchKey)}
                                    selectedRows={this.state.selectedPostTerms}
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
