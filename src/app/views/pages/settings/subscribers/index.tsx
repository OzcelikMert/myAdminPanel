import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../../types/app/pageProps";
import {PermissionId, Status, StatusId, UserRoleId, UserRoles} from "../../../../../constants";
import DataTable, {TableColumn} from "react-data-table-component";
import {pageRoutes} from "../../../../routes";
import Swal from "sweetalert2";
import Thread from "../../../../../library/thread";
import Spinner from "../../../tools/spinner";
import imageSourceUtil from "../../../../../utils/functions/imageSource.util";
import classNameUtil from "../../../../../utils/functions/className.util";
import permissionUtil from "../../../../../utils/functions/permission.util";
import ThemeToast from "../../../components/toast";
import {SubscriberDocument} from "../../../../../types/services/subscriber";
import subscriberService from "../../../../../services/subscriber.service";
import {ThemeTableToggleMenu} from "../../../components/table";
import {ThemeFormCheckBox} from "../../../components/form";

type PageState = {
    subscribers: SubscriberDocument[]
    selectedSubscribers: string[]
    isShowToggleMenu: boolean
    checkedRowsClear: boolean
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageSubscribers extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            subscribers: [],
            selectedSubscribers: [],
            isShowToggleMenu: false,
            checkedRowsClear: false,
            isLoading: true
        }
    }

    componentDidMount() {
        this.setPageTitle();
        Thread.start(() => {
            this.getSubscribers();
            this.setState({
                isLoading: false
            })
        })
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t("settings"),
            this.props.router.t("subscribers")
        ])
    }

    getSubscribers() {
        let subscribers = subscriberService.get({}).data;
        this.setState({
            subscribers: subscribers
        });
    }

    onDelete(event: any) {
        event.preventDefault();

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

                subscriberService.delete({
                    _id: this.state.selectedSubscribers
                }).then(resData => {
                    loadingToast.hide();
                    if (resData.status) {
                        this.setState((state: PageState) => {
                            state.subscribers = state.subscribers.filter(item => !state.selectedSubscribers.includes(item._id));
                            state.checkedRowsClear = !this.state.checkedRowsClear;
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

    onSelect(allSelected: boolean, selectedCount: number, selectedRows: PageState["subscribers"]) {
        this.setState((state: PageState) => {
            state.selectedSubscribers = [];
            selectedRows.forEach(item => state.selectedSubscribers.push(item._id))
            state.isShowToggleMenu = selectedCount > 0;
            return state;
        })
    }

    get getTableColumns(): TableColumn<PageState["subscribers"][0]>[] {
        return [
            {
                name: this.props.router.t("email"),
                selector: row => row.email,
                sortable: true,
            },
            {
                name: this.props.router.t("createdDate"),
                selector: row => new Date(row.createdAt).toLocaleDateString(),
                sortable: true
            }
        ];
    }

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-post-term">
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
                                                PermissionId.SubscriberEdit
                                            )
                                        ) ? <ThemeTableToggleMenu
                                            {...this.props}
                                            status={
                                                [
                                                    StatusId.Deleted
                                                ]
                                            }
                                            onChange={(event, statusId) => this.onDelete(event)}
                                            langId={this.props.getSessionData.langId}
                                        /> : null
                                    }
                                </div>
                                <div className="table-responsive">
                                    <DataTable
                                        columns={this.getTableColumns}
                                        data={this.state.subscribers}
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

export default PageSubscribers;
