import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../../types/app/pageProps";
import {PermissionId, Status, UserRoleId, UserRoles} from "../../../../../constants";
import DataTable, {TableColumn} from "react-data-table-component";
import Swal from "sweetalert2";
import UserDocument from "../../../../../types/services/user";
import ThemeUsersProfileCard from "../../../components/users/profileCard";
import userService from "../../../../../services/user.service";
import Thread from "../../../../../library/thread";
import Spinner from "../../../tools/spinner";
import imageSourceUtil from "../../../../../utils/imageSource.util";
import classNameUtil from "../../../../../utils/className.util";
import permissionUtil from "../../../../../utils/permission.util";
import ThemeToast from "../../../components/toast";
import PagePaths from "../../../../../constants/pagePaths";
import ThemeDataTable from "../../../components/table/dataTable";

type PageState = {
    searchKey: string
    users: UserDocument[]
    showingUsers: PageState["users"]
    isViewUserInfo: boolean
    selectedUserId: string
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageUserList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            searchKey: "",
            showingUsers: [],
            users: [],
            isViewUserInfo: false,
            selectedUserId: "",
            isLoading: true
        }
    }

    componentDidMount() {
        this.setPageTitle();
        Thread.start(() => {
            this.getUsers();
            this.setState({
                isLoading: false
            })
        })
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t("settings"),
            this.props.router.t("users"),
            this.props.router.t("list"),
        ])
    }

    getUsers() {
        let users = userService.get({}).data;
        this.setState((state: PageState) => {
            state.users = state.users.sort(user => {
                let sort = 0;
                if(user._id == this.props.getSessionData.id) {
                    sort = 1;
                }
                return sort;
            })
            state.users = users.filter(user => user.roleId != UserRoleId.SuperAdmin);
            return state;
        }, () => this.onSearch(this.state.searchKey));
    }

    onDelete(userId: string) {
        let user = this.state.users.findSingle("_id", userId);
        Swal.fire({
            title: this.props.router.t("deleteAction"),
            html: `<b>'${user.name}'</b> ${this.props.router.t("deleteItemQuestionWithItemName")}`,
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
                userService.delete({
                    userId: userId
                }).then(resData => {
                    loadingToast.hide();
                    if (resData.status) {
                        this.setState((state: PageState) => {
                            state.users = state.users.filter(item => userId !== item._id);
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

    onViewUser(userId: string) {
        this.setState({
            isViewUserInfo: true,
            selectedUserId: userId
        })
    }

    onSearch(searchKey: string) {
        this.setState({
            searchKey: searchKey,
            showingUsers: this.state.users.filter(user => user.name.toLowerCase().search(searchKey) > -1)
        })
    }

    navigateTermPage(type: "edit", itemId = "") {
        let path = PagePaths.settings().user().edit(itemId)
        this.props.router.navigate(path, {replace: true});
    }

    get getTableColumns(): TableColumn<PageState["users"][0]>[] {
        return [
            {
                name: this.props.router.t("image"),
                width: "100px",
                cell: row => (
                    <div className="image mt-2 mb-2">
                        <img
                            src={imageSourceUtil.getUploadedImageSrc(row.image)}
                            alt={row.name}
                        />
                        <span className={`availability-status ${row.isOnline ? "online" : "offline"}`}></span>
                    </div>
                )
            },
            {
                name: this.props.router.t("name"),
                selector: row => row.name,
                sortable: true,
                cell: row => (
                    <b>{row.name}</b>
                )
            },
            {
                id: "userRole",
                name: this.props.router.t("role"),
                selector: row => UserRoles.findSingle("id", row.roleId).rank,
                sortable: true,
                cell: row => (
                    <label className={`badge badge-gradient-${classNameUtil.getUserRolesClassName(row.roleId)}`}>
                        {
                            this.props.router.t(UserRoles.findSingle("id", row.roleId).langKey)
                        }
                    </label>
                )
            },
            {
                name: this.props.router.t("status"),
                selector: row => Status.findSingle("id", row.statusId).order,
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
                name: "",
                width: "70px",
                cell: row => (
                    <button
                        onClick={() => this.onViewUser(row._id)}
                        className="btn btn-gradient-info"
                    ><i className="mdi mdi-eye"></i></button>
                )
            },
            {
                name: "",
                button: true,
                width: "70px",
                cell: row => (UserRoles.findSingle("id", row.roleId).rank < UserRoles.findSingle("id", this.props.getSessionData.roleId).rank) &&
                permissionUtil.checkPermission(
                    this.props.getSessionData.roleId,
                    this.props.getSessionData.permissions,
                    PermissionId.UserEdit
                ) ? <button
                        onClick={() => this.navigateTermPage("edit", row._id)}
                        className="btn btn-gradient-warning"
                    ><i className="fa fa-pencil-square-o"></i>
                </button> : null
            },
            {
                name: "",
                button: true,
                width: "70px",
                cell: row => (UserRoles.findSingle("id", row.roleId).rank < UserRoles.findSingle("id", this.props.getSessionData.roleId).rank) &&
                permissionUtil.checkPermission(
                    this.props.getSessionData.roleId,
                    this.props.getSessionData.permissions,
                    PermissionId.UserDelete
                ) ? <button
                        onClick={() => this.onDelete(row._id)}
                        className="btn btn-gradient-danger"
                    ><i className="mdi mdi-trash-can-outline"></i>
                </button> : null
            }
        ];
    }

    render() {
        return this.state.isLoading ? <Spinner /> : (
            <div className="page-user">
                {
                    (this.state.users.findSingle("_id", this.state.selectedUserId))
                        ? <ThemeUsersProfileCard
                            router={this.props.router}
                            onClose={()=> {this.setState({isViewUserInfo: false})}}
                            isShow={this.state.isViewUserInfo}
                            userInfo={this.state.users.findSingle("_id", this.state.selectedUserId)}
                            langId={this.props.getSessionData.langId}
                        />
                        : null
                }
                <div className="grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-user">
                                <ThemeDataTable
                                    columns={this.getTableColumns}
                                    data={this.state.showingUsers}
                                    t={this.props.router.t}
                                    onSearch={searchKey => this.onSearch(searchKey)}
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

export default PageUserList;
