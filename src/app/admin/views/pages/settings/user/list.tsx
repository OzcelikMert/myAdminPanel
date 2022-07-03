import React, {Component} from 'react'
import {PagePropCommonDocument} from "../../../../../../modules/views/pages/pageProps";
import {PostDocument, UserDocument} from "../../../../../../modules/ajax/result/data";
import {GlobalFunctions, GlobalPaths} from "../../../../../../config/global";
import {
    PostTermTypeId,
    PostTypeContents, Status,
    StatusContents,
    StatusId,
    UserRoleContents,
    UserRoles
} from "../../../../../../public/static";
import Services from "../../../../../../services";
import DataTable, {TableColumn} from "react-data-table-component";
import {UsersGetParamDocument} from "../../../../../../modules/services/get/user";
import {pageRoutes} from "../../../../routes";
import Swal from "sweetalert2";
import {UserDeleteParamDocument} from "../../../../../../modules/services/delete/user";
import ThemeUsersProfileCard from "../../../components/users/profileCard";
import V from "../../../../../../library/variable";
import {emptyImage} from "../../../components/chooseImage";

type PageState = {
    users: UserDocument[]
    isViewUserInfo: boolean
    selectedUserId: number
};

type PageProps = {} & PagePropCommonDocument;

export class PageUserList extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            users: [],
            isViewUserInfo: false,
            selectedUserId: 0
        }
    }

    componentDidMount() {
        this.setPageTitle();
        this.getUsers();
    }

    setPageTitle() {
        this.props.setBreadCrumb([
            this.props.router.t("settings"),
            this.props.router.t("users"),
            this.props.router.t("list"),
        ])
    }

    getUsers() {
        let params: UsersGetParamDocument = {
            requestType: "list"
        };
        let users: PageState["users"] = Services.Get.users(params).data;
        this.setState((state: PageState) => {
            state.users = users.filter(user => user.userId != this.props.getSessionData.id);
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
                let params: UserDeleteParamDocument = {
                    userId: userId
                }
                Services.Delete.user(params).then(resData => {
                    if (resData.status) {
                        this.setState((state: PageState) => {
                            state.users = state.users.filter(item => userId !== item.userId);
                            return state;
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
                            src={
                                !V.isEmpty(row.userImage)
                                    ? (row.userImage.isUrl())
                                        ? row.userImage
                                        : GlobalPaths.uploads.images + row.userImage
                                    : emptyImage
                            }
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
                    <label className={`badge badge-gradient-${GlobalFunctions.getUserRolesClassName(row.userRoleId)}`}>
                        {
                            GlobalFunctions.getStaticContent(UserRoleContents, "roleId", row.userRoleId, this.props.getSessionData.langId)
                        }
                    </label>
                )
            },
            {
                name: this.props.router.t("status"),
                selector: row => Status.findSingle("id", row.userRoleId).order,
                sortable: true,
                cell: row => (
                    <label className={`badge badge-gradient-${GlobalFunctions.getStatusClassName(row.userStatusId)}`}>
                        {
                            GlobalFunctions.getStaticContent(StatusContents, "statusId", row.userStatusId, this.props.getSessionData.langId)
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
                cell: row => (UserRoles.findSingle("id", row.userRoleId).rank < UserRoles.findSingle("id", this.props.getSessionData.roleId).rank)
                    ? <button
                        onClick={() => this.navigateTermPage("edit", row.userId)}
                        className="btn btn-gradient-warning"
                    ><i className="fa fa-pencil-square-o"></i></button>
                    : null
            },
            {
                name: "",
                button: true,
                width: "70px",
                cell: row => (UserRoles.findSingle("id", row.userRoleId).rank < UserRoles.findSingle("id", this.props.getSessionData.roleId).rank)
                    ? <button
                        onClick={() => this.onDelete(row.userId)}
                        className="btn btn-gradient-danger"
                    ><i className="mdi mdi-trash-can-outline"></i></button>
                    : null
            }
        ];
    }

    render() {
        return (
            <div className="page-user">
                {
                    (this.state.users.findSingle("userId", this.state.selectedUserId))
                        ? <ThemeUsersProfileCard
                            onClose={()=> {this.setState({isViewUserInfo: false})}}
                            isShow={this.state.isViewUserInfo}
                            userInfo={this.state.users.findSingle("userId", this.state.selectedUserId)}
                            langId={this.props.getSessionData.langId}
                        />
                        : null
                }
                <div className="gird-margin stretch-card">
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
