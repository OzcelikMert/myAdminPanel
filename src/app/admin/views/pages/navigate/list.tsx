import React, {Component, FormEvent} from 'react'
import {
    StatusContents,
    StatusId
} from "../../../../../public/static";
import {pageRoutes} from "../../../routes";
import Services from "../../../../../services";
import {NavigateDocument} from "../../../../../modules/ajax/result/data";
import {GlobalFunctions} from "../../../../../config/global";
import {PagePropCommonDocument} from "../../../../../modules/views/pages/pageProps";
import DataTable, {TableColumn} from "react-data-table-component";
import {ThemeFormCheckBox} from "../../components/form";
import {ThemeTableToggleMenu} from "../../components/table";
import Swal from "sweetalert2";
import {NavigateGetParamDocument} from "../../../../../modules/services/get/navigate";
import {NavigatePutParamDocument} from "../../../../../modules/services/put/navigate";

type PageState = {
    navigates: NavigateDocument[],
    showingNavigates: PageState["navigates"]
    selectedNavigates: number[]
    listMode: "list" | "deleted"
    isShowToggleMenu: boolean
    checkedRowsClear: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageNavigateList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        let params: NavigateGetParamDocument = {
            langId: this.props.getPageData.mainLangId
        };
        let navigates = Services.Get.navigate(params).data;
        this.state = {
            checkedRowsClear: false,
            selectedNavigates: [],
            listMode: "list",
            isShowToggleMenu: false,
            navigates: navigates,
            showingNavigates: navigates.filter(item => item.navigateStatusId !== StatusId.Deleted)
        }
    }

    componentDidMount() {
        this.setPageTitle();
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t("navigates"),
            this.props.router.t("list"),
        ])
    }

    onChangeStatus(event: any, statusId: number) {
        event.preventDefault();
        const params: NavigatePutParamDocument = {
            navigateId: this.state.selectedNavigates,
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
                    Services.Delete.navigate(params).then(resData => {
                        if (resData.status) {
                            this.setState((state: PageState) => {
                                state.navigates = state.navigates.filter(item => !state.selectedNavigates.includes(item.navigateId))
                                return state;
                            })
                            this.onChangeListMode(this.state.listMode);
                        }
                    })
                }
            })
        } else {
            Services.Put.navigate(params).then(resData => {
                if (resData.status) {
                    this.setState((state: PageState) => {
                        state.navigates.map((item, index) => {
                            if (state.selectedNavigates.includes(item.navigateId)) {
                                item.navigateStatusId = statusId;
                            }
                        })
                        return state;
                    })
                    this.onChangeListMode(this.state.listMode);
                }
            })
        }
    }

    onSelect(allSelected: boolean, selectedCount: number, selectedRows: PageState["navigates"]) {
        this.setState((state: PageState) => {
            state.selectedNavigates = [];
            selectedRows.forEach(item => state.selectedNavigates.push(item.navigateId))
            state.isShowToggleMenu = selectedCount > 0;
            return state;
        })
    }

    onChangeListMode(mode: PageState["listMode"]) {
        this.setState((state: PageState) => {
            state.listMode = mode;
            state.showingNavigates = [];
            state.selectedNavigates = [];
            state.isShowToggleMenu = false;
            state.navigates.map(value => {
                if (
                    (mode === "list" && value.navigateStatusId !== StatusId.Deleted) ||
                    (mode === "deleted" && value.navigateStatusId === StatusId.Deleted)
                ) state.showingNavigates.push(value);
            });
            state.checkedRowsClear = !this.state.checkedRowsClear;
            return state;
        })
    }

    navigateTermPage(type: "edit", navigateId = 0) {
        let path = (type === "edit")
                ? pageRoutes.navigate.path() + pageRoutes.navigate.edit.path(navigateId)
                : "";
        this.props.router.navigate(path, {replace: true});
    }

    get getTableColumns(): TableColumn<PageState["navigates"][0]>[] {
        return [
            {
                name: this.props.router.t("name"),
                selector: row => row.navigateContentTitle || this.props.router.t("[noLangAdd]"),
                sortable: true,
            },
            {
                name: this.props.router.t("main"),
                selector: row => this.state.navigates.findSingle("navigateId", row.navigateMainId)?.navigateContentTitle || this.props.router.t("[noLangAdd]"),
                sortable: true
            },
            {
                name: this.props.router.t("status"),
                sortable: true,
                cell: row => (
                    <label
                        className={`badge badge-gradient-${GlobalFunctions.getStatusClassName(row.navigateStatusId)}`}>
                        {
                            GlobalFunctions.getStaticContent(StatusContents, "statusId", row.navigateStatusId, this.props.getSessionData.langId)
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
                        onClick={() => this.navigateTermPage("edit", row.navigateId)}
                    ><i className="fa fa-pencil-square-o"></i></button>
                )
            }
        ];
    }

    render() {
        return (
            <div className="page-post-term">
                <div className="navigate-buttons mb-3">
                    {
                        this.state.listMode === "list"
                            ? <button className="btn btn-gradient-danger btn-lg"
                                      onClick={() => this.onChangeListMode("deleted")}>
                                <i className="mdi mdi-delete"></i> {this.props.router.t("trash")}
                            </button>
                            : <button className="btn btn-gradient-success btn-lg"
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
                                        langId={this.props.getSessionData.langId}
                                    />
                                </div>
                                <div className="table-responsive">
                                    <DataTable
                                        columns={this.getTableColumns}
                                        data={this.state.showingNavigates}
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
