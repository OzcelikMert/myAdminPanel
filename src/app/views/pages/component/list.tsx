import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import {PermissionId, UserRoleId} from "../../../../constants";
import DataTable, {TableColumn} from "react-data-table-component";
import {pageRoutes} from "../../../routes";
import Swal from "sweetalert2";
import Thread from "../../../../library/thread";
import Spinner from "../../tools/spinner";
import permissionUtil from "../../../../utils/functions/permission.util";
import ThemeToast from "../../components/toast";
import {ComponentDocument} from "../../../../types/services/component";
import componentService from "../../../../services/component.service";

type PageState = {
    components: ComponentDocument[]
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageComponentList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            components: [],
            isLoading: true
        }
    }

    componentDidMount() {
        this.setPageTitle();
        Thread.start(() => {
            this.getComponents();
            this.setState({
                isLoading: false
            })
        })
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t("components"),
            this.props.router.t("list"),
        ])
    }

    getComponents() {
        let components = componentService.get({langId: this.props.getPageData.langId}).data;
        this.setState((state: PageState) => {
            state.components = components;
            return state;
        });
    }

    onDelete(_id: string) {
        let component = this.state.components.findSingle("_id", _id);
        Swal.fire({
            title: this.props.router.t("deleteAction"),
            html: `<b>'${this.props.router.t(component.langKey)}'</b> ${this.props.router.t("deleteItemQuestionWithItemName")}`,
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
                componentService.delete({
                    _id: [_id]
                }).then(resData => {
                    loadingToast.hide();
                    if (resData.status) {
                        this.setState((state: PageState) => {
                            state.components = state.components.filter(item => _id !== item._id);
                            return state;
                        }, () => {
                            new ThemeToast({
                                type: "success",
                                title: this.props.router.t("successful"),
                                content: this.props.router.t("itemDeleted")
                            })
                        })
                    }
                })
            }
        })
    }

    navigateTermPage(type: "edit", itemId = "") {
        let path = pageRoutes.component.path() + pageRoutes.component.edit.path(itemId)
        this.props.router.navigate(path, {replace: true});
    }

    get getTableColumns(): TableColumn<PageState["components"][0]>[] {
        return [
            {
                name: this.props.router.t("title"),
                selector: row => this.props.router.t(row.langKey),
                sortable: true
            },
            {
                name: this.props.router.t("updatedBy"),
                sortable: true,
                selector: row => row.lastAuthorId.name
            },
            {
                name: "",
                button: true,
                width: "70px",
                cell: row => permissionUtil.checkPermission(
                    this.props.getSessionData.roleId,
                    this.props.getSessionData.permissions,
                    PermissionId.ComponentEdit
                ) ? (
                    <button
                        onClick={() => this.navigateTermPage("edit", row._id)}
                        className="btn btn-gradient-warning"
                    ><i className="fa fa-pencil-square-o"></i>
                    </button>
                ) : null
            },
            (
                this.props.getSessionData.roleId == UserRoleId.SuperAdmin
                    ? {
                        name: "",
                        button: true,
                        width: "70px",
                        cell: row => (
                            <button
                                onClick={() => this.onDelete(row._id)}
                                className="btn btn-gradient-danger"
                            ><i className="mdi mdi-trash-can-outline"></i>
                            </button>
                        )
                    } : {}
            )
        ].filter(column => typeof column.name !== "undefined");
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-post">
                <div className="grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-post">
                                <div className="table-responsive">
                                    <DataTable
                                        columns={this.getTableColumns}
                                        data={this.state.components.orderBy("order", "asc")}
                                        noHeader
                                        fixedHeader
                                        defaultSortAsc={false}
                                        pagination
                                        highlightOnHover
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

export default PageComponentList;
