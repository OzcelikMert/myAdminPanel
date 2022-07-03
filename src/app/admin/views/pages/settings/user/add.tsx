import React, {Component, FormEvent} from 'react'
import {Tab, Tabs} from "react-bootstrap";
import moment from "moment";
import {PagePropCommonDocument} from "../../../../../../modules/views/pages/pageProps";
import {GlobalFunctions} from "../../../../../../config/global";
import {
    PermissionContents,
    PermissionGroups,
    PermissionGroupsContents,
    Permissions, PostTermTypeContents, PostTypeContents,
    StatusId,
    UserRoleId, UserRoles
} from "../../../../../../public/static";
import HandleForm from "../../../../../../library/react/handles/form";
import {ThemeFieldSet, ThemeForm, ThemeFormCheckBox, ThemeFormSelect, ThemeFormType} from "../../../components/form";
import SweetAlert from "react-sweetalert2";
import V, {DateMask} from "../../../../../../library/variable";
import {pageRoutes} from "../../../../routes";
import {UserPostParamDocument} from "../../../../../../modules/services/post/user";
import {UserPutParamDocument} from "../../../../../../modules/services/put/user";
import Services from "../../../../../../services";
import {UsersGetParamDocument} from "../../../../../../modules/services/get/user";
import {UserDocument} from "../../../../../../modules/ajax/result/data";

type PageState = {
    formActiveKey: string
    userRoles: { value: number, label: string }[]
    status: { value: number, label: string }[]
    mainTitle: string,
    isSubmitting: boolean
    formData: {
        userId: number
        image: string
        name: string
        email: string
        password: string
        roleId: number
        statusId: number
        banDateEnd: string
        banComment: string
        permissionId: number[]
    },
    isSuccessMessage: boolean
};

type PageProps = {} & PagePropCommonDocument;

export class PageUserAdd extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            formActiveKey: "general",
            userRoles: [],
            status: [],
            mainTitle: "",
            isSubmitting: false,
            formData: {
                userId: 0,
                image: "",
                name: "",
                email: "",
                password: "",
                roleId: 0,
                statusId: 0,
                banDateEnd: new Date().getStringWithMask(DateMask.DATE),
                banComment: "",
                permissionId: []
            },
            isSuccessMessage: false
        }
    }

    componentDidMount() {
        this.setPageTitle();
        this.getRoles();
        this.getStatus();
        if (this.props.getPageData.searchParams.userId > 0) {
            this.getUser();
        }
    }

    setPageTitle() {
        let titles: string[] = [
            this.props.router.t("settings"),
            this.props.router.t("users"),
            this.props.router.t((this.state.formData.userId) > 0 ? "edit" : "add")
        ];
        if(this.state.formData.userId > 0) {
            titles.push(this.state.mainTitle)
        }
        this.props.setBreadCrumb(titles);
    }

    getStatus() {
        this.setState((state: PageState) => {
            state.status = GlobalFunctions.getStatusForSelect([
                StatusId.Active,
                StatusId.Pending,
                StatusId.Disabled,
                StatusId.Banned
            ], this.props.getSessionData.langId);
            state.formData.statusId = StatusId.Active;
            return state;
        })
    }

    getRoles() {
        this.setState((state: PageState) => {
            state.userRoles = GlobalFunctions.getUserRolesForSelect([
                UserRoleId.User,
                UserRoleId.Author,
                UserRoleId.Editor
            ], this.props.getSessionData.langId);
            state.formData.roleId = UserRoleId.User;
            return state;
        })
    }

    getUser() {
        let params: UsersGetParamDocument = {
            userId: this.props.getPageData.searchParams.userId,
            requestType: "list"
        };
        let resData = Services.Get.users(params);
        if (resData.status) {
            if (resData.data.length > 0) {
                const user: UserDocument = resData.data[0];
                this.setState((state: PageState) => {
                    state.formData = {
                        userId: user.userId,
                        image: user.userImage,
                        name: user.userName,
                        email: user.userEmail,
                        password: "",
                        roleId: user.userRoleId,
                        statusId: user.userStatusId,
                        banDateEnd: user.userBanDateEnd,
                        banComment: user.userBanComment,
                        permissionId: user.userPermissions
                    }

                    if(this.props.getPageData.langId == this.props.getPageData.mainLangId) {
                        state.mainTitle = state.formData.name;
                    }
                    return state;
                })
            } else {
                this.navigateTermPage();
            }
        }
    }

    navigateTermPage() {
        let path = pageRoutes.settings.path() + pageRoutes.settings.user.path() + pageRoutes.settings.user.list.path();
        this.props.router.navigate(path, {replace: true});
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        let params: UserPostParamDocument & UserPutParamDocument = Object.assign({
            userId: this.props.getPageData.searchParams.userId,
        }, this.state.formData);

        ((V.isEmpty(params.userId))
            ? Services.Post.user(params)
            : Services.Put.user(params)).then(resData => {
                this.setState((state: PageState) => {
                    if (resData.status) {
                        state.isSuccessMessage = true;
                    }

                    state.isSubmitting = false;
                    return state;
                })
        });
    }

    onPermissionSelected(isSelected: boolean, permId: number) {
        this.setState((state: PageState) => {
            if (isSelected) {
                state.formData.permissionId.push(permId);
            } else {
                let findIndex = state.formData.permissionId.indexOfKey("", permId);
                if (findIndex > -1) state.formData.permissionId.remove(findIndex);
            }
            return state;
        })
    }

    onChangeUserRole(roleId: number) {
        let role = UserRoles.findSingle("id", roleId);
        let permsForRole = Permissions.filter(perm => perm.defaultRoleRank <= role.rank);
        this.setState((state: PageState) => {
            state.formData.permissionId = [];
            permsForRole.forEach(perm => {
                state.formData.permissionId.push(perm.id);
            })
            return state;
        });
    }

    onCloseSuccessMessage() {
        this.setState({
            isSuccessMessage: false
        });
        this.navigateTermPage()
    }

    Messages = () => {
        return (
            <SweetAlert
                show={this.state.isSuccessMessage}
                title={this.props.router.t("successful")}
                text={`${this.props.router.t((V.isEmpty(this.props.getPageData.searchParams.userId)) ? "itemAdded" : "itemEdited")}!`}
                icon="success"
                timer={1000}
                timerProgressBar={true}
                didClose={() => this.onCloseSuccessMessage()}
            />
        )
    }

    TabPermissions = (props: any) => {
        return (
            <div className="row">
                {
                    PermissionGroups.map((group, index) => (
                        <ThemeFieldSet
                            key={index}
                            legend={GlobalFunctions.getStaticContent(PermissionGroupsContents, "groupId", group.id, this.props.getSessionData.langId)}
                        >
                            {
                                Permissions.findMulti("groupId", group.id).map((perm, index) => (
                                        <div className="col-md-4" key={index}>
                                            <ThemeFormCheckBox
                                                key={index}
                                                title={GlobalFunctions.getStaticContent(PermissionContents, "permId", perm.id, this.props.getSessionData.langId)}
                                                name="permissionId"
                                                checked={this.state.formData.permissionId.includes(perm.id)}
                                                onChange={e => this.onPermissionSelected(e.target.checked, perm.id)}
                                            />
                                        </div>
                                ))
                            }
                        </ThemeFieldSet>
                    ))
                }
            </div>
        );
    }

    TabOptions = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormSelect
                        title={this.props.router.t("status")}
                        name="statusId"
                        options={this.state.status}
                        value={this.state.status?.findSingle("value", this.state.formData.statusId)}
                        onChange={(item: any, e) => HandleForm.onChangeSelect(e.name, item.value, this)}
                    />
                </div>
                {
                    this.state.formData.statusId == StatusId.Banned ?
                        <div className="col-md-7 mb-3">
                            <div className="mb-3">
                                <ThemeFormType
                                    title={`${this.props.router.t("banDateEnd").toCapitalizeCase()}*`}
                                    type="date"
                                    name="banDateEnd"
                                    value={moment(this.state.formData.banDateEnd).format("YYYY-MM-DD")}
                                    onChange={(event) => HandleForm.onChangeInput(event, this)}
                                />
                            </div>
                            <div className="mb-3">
                                <ThemeFormType
                                    title={this.props.router.t("banComment").toCapitalizeCase()}
                                    name="banComment"
                                    type="textarea"
                                    value={this.state.formData.banComment}
                                    onChange={e => HandleForm.onChangeInput(e, this)}
                                />
                            </div>
                        </div> : null
                }
            </div>
        );
    }

    TabGeneral = () => {
        return (
            <div className="row">
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={`${this.props.router.t("name")}*`}
                        name="name"
                        type="text"
                        required={true}
                        value={this.state.formData.name}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={`${this.props.router.t("email")}*`}
                        name="email"
                        type="email"
                        required={true}
                        autoComplete={"new-password"}
                        value={this.state.formData.email}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormType
                        title={`${this.props.router.t("password")}*`}
                        name="password"
                        type="password"
                        autoComplete={"new-password"}
                        required={V.isEmpty(this.props.getPageData.searchParams.userId)}
                        value={this.state.formData.password}
                        onChange={e => HandleForm.onChangeInput(e, this)}
                    />
                </div>
                <div className="col-md-7 mb-3">
                    <ThemeFormSelect
                        title={this.props.router.t("role")}
                        name="roleId"
                        placeholder={this.props.router.t("chooseRole").toCapitalizeCase()}
                        options={this.state.userRoles}
                        value={this.state.userRoles?.findSingle("value", this.state.formData.roleId)}
                        onChange={(item: any, e) => {
                            HandleForm.onChangeSelect(e.name, item.value, this);
                            this.onChangeUserRole(item.value);
                        }}
                    />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="page-user">
                <this.Messages/>
                <div className="navigate-buttons mb-3">
                    <button className="btn btn-gradient-dark btn-lg btn-icon-text"
                            onClick={() => this.navigateTermPage()}>
                        <i className="mdi mdi-arrow-left"></i> {this.props.router.t("returnBack")}
                    </button>
                </div>
                <div className="gird-margin stretch-card">
                    <div className="card">
                        <ThemeForm
                            isActiveSaveButton={true}
                            saveButtonText={this.props.router.t("save")}
                            saveButtonLoadingText={this.props.router.t("loading")}
                            isSubmitting={this.state.isSubmitting}
                            formAttributes={{onSubmit: (event) => this.onSubmit(event), autoComplete: "new-password"}}
                        >
                            <div className="card-body">
                                <div className="theme-tabs">
                                    <Tabs
                                        onSelect={(key: any) => this.setState({formActiveKey: key})}
                                        activeKey={this.state.formActiveKey}
                                        className="mb-5"
                                        transition={false}>
                                        <Tab eventKey="general" title={this.props.router.t("general")}>
                                            <this.TabGeneral/>
                                        </Tab>
                                        <Tab eventKey="options" title={this.props.router.t("options")}>
                                            <this.TabOptions/>
                                        </Tab>
                                        <Tab eventKey="permissions" title={this.props.router.t("permissions")}>
                                            <this.TabPermissions/>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </ThemeForm>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageUserAdd;
