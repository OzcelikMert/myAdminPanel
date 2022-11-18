import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../../types/app/pageProps";
import {PermissionId, StatusId} from "../../../../../constants";
import DataTable, {TableColumn} from "react-data-table-component";
import Swal from "sweetalert2";
import Thread from "../../../../../library/thread";
import Spinner from "../../../tools/spinner";
import permissionUtil from "../../../../../utils/permission.util";
import ThemeToast from "../../../components/toast";
import {SubscriberDocument} from "../../../../../types/services/subscriber";
import subscriberService from "../../../../../services/subscriber.service";
import {ThemeTableToggleMenu} from "../../../components/table";
import {ThemeFormCheckBox} from "../../../components/form";
import ThemeDataTable from "../../../components/table/dataTable";

type PageState = {
    searchKey: string
    subscribers: SubscriberDocument[]
    showingSubscribers: PageState["subscribers"]
    selectedSubscribers: PageState["subscribers"]
    isShowToggleMenu: boolean
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageSubscribers extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            searchKey: "",
            showingSubscribers: [],
            subscribers: [],
            selectedSubscribers: [],
            isShowToggleMenu: false,
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
        }, () => this.onSearch(this.state.searchKey));
    }

    onDelete(event: any) {
        event.preventDefault();
        let selectedSubscribeId = this.state.selectedSubscribers.map(post => post._id);

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
                    _id: selectedSubscribeId
                }).then(resData => {
                    loadingToast.hide();
                    if (resData.status) {
                        this.setState((state: PageState) => {
                            state.subscribers = state.subscribers.filter(item => !selectedSubscribeId.includes(item._id));
                            return state;
                        }, () => {
                            new ThemeToast({
                                type: "success",
                                title: this.props.router.t("successful"),
                                content: this.props.router.t("itemDeleted")
                            })
                            this.onSearch(this.state.searchKey)
                        })
                    }
                })
            }
        })
    }

    onSelect(selectedRows: PageState["subscribers"]) {
        this.setState((state: PageState) => {
            state.selectedSubscribers = selectedRows;
            state.isShowToggleMenu = selectedRows.length > 0;
            return state;
        })
    }

    onSearch(searchKey: string) {
        this.setState({
            searchKey: searchKey,
            showingSubscribers: this.state.subscribers.filter(subscriber => subscriber.email.toLowerCase().search(searchKey) > -1)
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
                                            t={this.props.router.t}
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
                                <ThemeDataTable
                                    columns={this.getTableColumns}
                                    data={this.state.showingSubscribers}
                                    selectedRows={this.state.selectedSubscribers}
                                    t={this.props.router.t}
                                    onSelect={rows => this.onSelect(rows)}
                                    onSearch={searchKey => this.onSearch(searchKey)}
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

export default PageSubscribers;
