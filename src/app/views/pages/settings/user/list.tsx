import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../../modules/app/admin/pageProps";
import {
    PermissionId, Status,
    StatusContents,
    UserRoleContents, UserRoleId,
    UserRoles
} from "../../../../../public/static";
import DataTable, {TableColumn} from "react-data-table-component";
import {pageRoutes} from "../../../../routes";
import Swal from "sweetalert2";
import UserDocument from "../../../../../modules/services/user";
import ThemeUsersProfileCard from "../../../components/users/profileCard";
import userService from "../../../../../services/user.service";
import Thread from "../../../../../library/thread";
import Spinner from "../../../tools/spinner";
import imageSourceUtil from "../../../../../utils/functions/imageSource.util";
import classNameUtil from "../../../../../utils/functions/className.util";
import staticContentUtil from "../../../../../utils/functions/staticContent.util";
import permissionUtil from "../../../../../utils/functions/permission.util";
import ThemeToast from "../../../components/toast";

type PageState = {
    users: UserDocument[]
    isViewUserInfo: boolean
    selectedUserId: number
    isLoading: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageUserList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            users: [],
            isViewUserInfo: false,
            selectedUserId: 0,
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
                if(user.userId == this.props.getSessionData.id) {
                    sort = 1;
                }
                return sort;
            })
            state.users = users.map(user => {
                if (user.userRoleId == UserRoleId.Admin) {
                    user.userPermissions = []
                    user.userPermissions = Object.keys(PermissionId).map(permKey => PermissionId[permKey]);
                }
                return user;
            });
            return state;
        });
    }

    onDelete(userId: number) {
        let user = this.state.users.findSingle("userId", userId);
        Swal.fire({
            title: this.props.router.t("deleteAction"),
            html: `<b>'${user.userName}'</b> ${this.props.router.t("deleteItemQuestionWithItemName")}`,
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
                            state.users = state.users.filter(item => userId !== item.userId);
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

    onViewUser(userId: number) {
        this.setState({
            isViewUserInfo: true,
            selectedUserId: userId
        })
    }

    navigateTermPage(type: "edit", itemId = 0) {
        let path = pageRoutes.settings.path() + pageRoutes.settings.user.path() + pageRoutes.settings.user.edit.path(itemId)
        this.props.router.navigate(path, {replace: true});
    }

    get getTableColumns(): TableColumn<PageState["users"][0]>[] {
        return [
            {
                name: this.props.router.t("image"),
                width: "75px",
                cell: row => (
                    <div className="image pt-2 pb-2">
                        <img
                            src={imageSourceUtil.getUploadedImageSrc(row.userImage)}
                            alt={row.userName}
                        />
                    </div>
                )
            },
            {
                name: this.props.router.t("name"),
                selector: row => row.userName,
                sortable: true,
                cell: row => (
                    <b>{row.userName}</b>
                )
            },
            {
                id: "userRole",
                name: this.props.router.t("role"),
                selector: row => UserRoles.findSingle("id", row.userRoleId).rank,
                sortable: true,
                cell: row => (
                    <label className={`badge badge-gradient-${classNameUtil.getUserRolesClassName(row.userRoleId)}`}>
                        {
                            staticContentUtil.getStaticContent(UserRoleContents, "roleId", row.userRoleId)
                        }
                    </label>
                )
            },
            {
                name: this.props.router.t("status"),
                selector: row => Status.findSingle("id", row.userRoleId).order,
                sortable: true,
                cell: row => (
                    <label className={`badge badge-gradient-${classNameUtil.getStatusClassName(row.userStatusId)}`}>
                        {
                            staticContentUtil.getStaticContent(StatusContents, "statusId", row.userStatusId)
                        }
                    </label>
                )
            },
            {
                name: "",
                width: "70px",
                cell: row => (
                    <button
                        onClick={() => this.onViewUser(row.userId)}
                        className="btn btn-gradient-info"
                    ><i className="mdi mdi-eye"></i></button>
                )
            },
            {
                name: "",
                button: true,
                width: "70px",
                cell: row => (UserRoles.findSingle("id", row.userRoleId).rank < UserRoles.findSingle("id", this.props.getSessionData.roleId).rank) &&
                permissionUtil.checkPermissionAndRedirect(
                    this.props.getSessionData.roleId,
                    this.props.getSessionData.permissions,
                    PermissionId.UserEdit,
                    this.props.router.navigate
                ) ? <button
                        onClick={() => this.navigateTermPage("edit", row.userId)}
                        className="btn btn-gradient-warning"
                    ><i className="fa fa-pencil-square-o"></i>
                </button> : null
            },
            {
                name: "",
                button: true,
                width: "70px",
                cell: row => (UserRoles.findSingle("id", row.userRoleId).rank < UserRoles.findSingle("id", this.props.getSessionData.roleId).rank) &&
                permissionUtil.checkPermissionAndRedirect(
                    this.props.getSessionData.roleId,
                    this.props.getSessionData.permissions,
                    PermissionId.UserDelete,
                    this.props.router.navigate
                ) ? <button
                        onClick={() => this.onDelete(row.userId)}
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
                    (this.state.users.findSingle("userId", this.state.selectedUserId))
                        ? <ThemeUsersProfileCard
                            router={this.props.router}
                            onClose={()=> {this.setState({isViewUserInfo: false})}}
                            isShow={this.state.isViewUserInfo}
                            userInfo={this.state.users.findSingle("userId", this.state.selectedUserId)}
                            langId={this.props.getSessionData.langId}
                        />
                        : null
                }
                <div className="grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className="table-user">
                                <div className="table-responsive">
                                    <DataTable
                                        columns={this.getTableColumns}
                                        data={this.state.users}
                                        defaultSortFieldId="userRole"
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

export default PageUserList;
