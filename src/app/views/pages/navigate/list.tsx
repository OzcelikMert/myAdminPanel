import React, {Component, FormEvent} from 'react'
import {
    PermissionId,
    StatusContents,
    StatusId
} from "../../../../public/static";
import {pageRoutes} from "../../../routes";
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import DataTable, {TableColumn} from "react-data-table-component";
import {ThemeFormCheckBox} from "../../components/form";
import {ThemeTableToggleMenu} from "../../components/table";
import Swal from "sweetalert2";
import NavigateDocument from "../../../../types/services/navigate";
import navigateService from "../../../../services/navigate.service";
import Thread from "../../../../library/thread";
import Spinner from "../../tools/spinner";
import classNameUtil from "../../../../utils/functions/className.util";
import staticContentUtil from "../../../../utils/functions/staticContent.util";
import permissionUtil from "../../../../utils/functions/permission.util";
import ThemeToast from "../../components/toast";

type PageState = {
    navigates: NavigateDocument[],
    showingNavigates: PageState["navigates"]
    selectedNavigates: number[]
    listMode: "list" | "deleted"
    isShowToggleMenu: boolean
    checkedRowsClear: boolean
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageNavigateList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            checkedRowsClear: false,
            selectedNavigates: [],
            listMode: "list",
            isShowToggleMenu: false,
            navigates: [],
            showingNavigates: [],
            isLoading: true
        }
    }

    componentDidMount() {
        this.setPageTitle();
        Thread.start(() => {
            this.getNavigates();
            this.setState({
                isLoading: false
            })
        })
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t("navigates"),
            this.props.router.t("list"),
        ])
    }

    getNavigates() {
        let resData = navigateService.get({
            langId: this.props.getPageData.mainLangId
        });

        if (resData.status) {
            this.setState({
                navigates: resData.data,
                showingNavigates: resData.data.filter(item => item.navigateStatusId !== StatusId.Deleted)
            })
        }
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

                    navigateService.delete({
                        navigateId: this.state.selectedNavigates
                    }).then(resData => {
                        loadingToast.hide();
                        if (resData.status) {
                            this.setState((state: PageState) => {
                                state.navigates = state.navigates.filter(item => !state.selectedNavigates.includes(item.navigateId))
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

            navigateService.updateStatus({
                navigateId: this.state.selectedNavigates,
                statusId: statusId
            }).then(resData => {
                loadingToast.hide();
                if (resData.status) {
                    this.setState((state: PageState) => {
                        state.navigates.map((item, index) => {
                            if (state.selectedNavigates.includes(item.navigateId)) {
                                item.navigateStatusId = statusId;
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
            if (mode === "list") {
                state.showingNavigates = state.navigates.findMulti("navigateStatusId", StatusId.Deleted, false);
            } else {
                state.showingNavigates = state.navigates.findMulti("navigateStatusId", StatusId.Deleted);
            }
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
                        className={`badge badge-gradient-${classNameUtil.getStatusClassName(row.navigateStatusId)}`}>
                        {
                            staticContentUtil.getStaticContent(StatusContents, "statusId", row.navigateStatusId)
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
                    PermissionId.NavigateEdit
                ) ? (
                    <button
                        className="btn btn-gradient-warning"
                        onClick={() => this.navigateTermPage("edit", row.navigateId)}
                    ><i className="fa fa-pencil-square-o"></i></button>
                ) : null
            }
        ];
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-post-term">
                <div className="row">
                    <div className="col-md-6 mb-3"></div>
                    <div className="col-md-6 mb-3 text-end">
                        {
                            this.state.listMode === "list"
                                ? <button className="btn btn-gradient-danger btn-lg"
                                          onClick={() => this.onChangeListMode("deleted")}>
                                    <i className="mdi mdi-delete"></i> {this.props.router.t("trash")} ({this.state.navigates.findMulti("navigateStatusId", StatusId.Deleted).length})
                                </button>
                                : <button className="btn btn-gradient-success btn-lg"
                                          onClick={() => this.onChangeListMode("list")}>
                                    <i className="mdi mdi-view-list"></i> {this.props.router.t("list")} ({this.state.navigates.findMulti("navigateStatusId", StatusId.Deleted, false).length})
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
                                            PermissionId.NavigateEdit
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
                                                            PermissionId.NavigateDelete
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
