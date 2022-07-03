import React, {Component, FormEvent} from 'react'
import {Dropdown} from 'react-bootstrap';
import {
    PostTermTypeContents,
    PostTypeContents,
    StatusContents,
    StatusId
} from "../../../../../public/static";
import {pageRoutes} from "../../../routes";
import Services from "../../../../../services";
import {PostTermDocument} from "../../../../../modules/ajax/result/data";
import {GlobalFunctions, getPageData, setPageData, getSessionData, GlobalPaths} from "../../../../../config/global";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import DataTable, {TableColumn} from "react-data-table-component";
import {ThemeFormCheckBox} from "../../components/form";
import {PostTermPutParamDocument} from "../../../../../modules/services/put/postTerm";
import {ThemeTableToggleMenu} from "../../components/table";
import V from "../../../../../library/variable";
import Swal from "sweetalert2";
import {emptyImage} from "../../components/chooseImage";

type PageState = {
    postTerms: PostTermDocument[],
    showingPostTerms: PageState["postTerms"]
    selectedPostTerms: number[]
    listMode: "list" | "deleted"
    isShowToggleMenu: boolean
    checkedRowsClear: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageNavigateList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        let params = {
            typeId: getPageData().searchParams.termTypeId,
            postTypeId: getPageData().searchParams.postTypeId,
            langId: getPageData().mainLangId
        };
        let postTerms: PageState["postTerms"] = Services.Get.postTerms(params).data;
        this.state = {
            checkedRowsClear: false,
            selectedPostTerms: [],
            listMode: "list",
            isShowToggleMenu: false,
            postTerms: postTerms,
            showingPostTerms: postTerms.filter(value => value.postTermStatusId !== StatusId.Deleted)
        }
    }

    setPageTitle() {
        setPageData({
            title: `
                ${this.props.router.t("navigates")} 
            `
        })
    }

    onChangeStatus(event: any, statusId: number) {
        event.preventDefault();
        const params: PostTermPutParamDocument = {
            termId: this.state.selectedPostTerms,
            statusId: statusId,
            langId: getPageData().langId
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
                    Services.Delete.postTerm(params).then(resData => {
                        if (resData.status) {
                            this.setState((state: PageState) => {
                                state.postTerms = state.postTerms.filter(item => !state.selectedPostTerms.includes(item.postTermId))
                                return state;
                            })
                            this.onChangeListMode(this.state.listMode);
                        }
                    })
                }
            })
        } else {
            Services.Put.postTerm(params).then(resData => {
                if (resData.status) {
                    this.setState((state: PageState) => {
                        state.postTerms.map((item, index) => {
                            if (state.selectedPostTerms.includes(item.postTermId)) {
                                item.postTermStatusId = statusId;
                            }
                        })
                        return state;
                    })
                    this.onChangeListMode(this.state.listMode);
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
            state.postTerms.map(value => {
                if (
                    (mode === "list" && value.postTermStatusId !== StatusId.Deleted) ||
                    (mode === "deleted" && value.postTermStatusId === StatusId.Deleted)
                ) state.showingPostTerms.push(value);
            });
            state.checkedRowsClear = !this.state.checkedRowsClear;
            return state;
        })
    }

    navigateTermPage(type: "add" | "back" | "edit", postTermId = 0) {
        let path = (type === "add")
            ? pageRoutes.postTerm.path(getPageData().searchParams.postTypeId, getPageData().searchParams.termTypeId) + pageRoutes.postTerm.add.path()
            : (type === "edit")
                ? pageRoutes.postTerm.path(getPageData().searchParams.postTypeId, getPageData().searchParams.termTypeId) + pageRoutes.postTerm.edit.path(postTermId)
                : pageRoutes.post.path(getPageData().searchParams.postTypeId) + pageRoutes.post.list.path();
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
                            src={
                                row.postTermContentImage && !V.isEmpty(row.postTermContentImage)
                                    ? (row.postTermContentImage.isUrl())
                                        ? row.postTermContentImage
                                        : GlobalPaths.uploads.images + row.postTermContentImage
                                    : emptyImage
                            }
                            alt={row.postTermContentTitle}
                        />
                    </div>
                )
            },
            {
                name: this.props.router.t("name"),
                selector: row => row.postTermContentTitle || "",
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
                        className={`badge badge-gradient-${GlobalFunctions.getStatusClassName(row.postTermStatusId)}`}>
                        {
                            GlobalFunctions.getStaticContent(StatusContents, "statusId", row.postTermStatusId, getSessionData().langId)
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
                        className="btn btn-gradient-warning"
                        onClick={() => this.navigateTermPage("edit", row.postTermId)}
                    ><i className="fa fa-pencil-square-o"></i></button>
                )
            }
        ];
    }

    render() {
        this.setPageTitle();
        return (
            <div className="page-post-term">
                <div className="navigate-buttons mb-3">
                    <button className="btn btn-gradient-dark btn-lg" onClick={() => this.navigateTermPage("back")}>
                        <i className="mdi mdi-arrow-left"></i> {this.props.router.t("returnBack")}
                    </button>
                    <button className="btn btn-gradient-info btn-lg ms-3"
                            onClick={() => this.navigateTermPage("add")}>+ {this.props.router.t("addNew")}</button>
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
                <div className="gird-margin stretch-card">
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
                                        langId={getSessionData().langId}
                                    />
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

export default PageNavigateList;
