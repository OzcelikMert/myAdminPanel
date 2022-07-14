import React, {Component, FormEvent} from 'react'
import {PagePropCommonDocument} from "../../../../../../modules/views/pages/pageProps";
import {ThemeForm, ThemeFormSelect, ThemeFormTags, ThemeFormType} from "../../../components/form";
import HandleForm from "../../../../../../library/react/handles/form";
import Services from "../../../../../../services";
import {SettingPutParamDocument} from "../../../../../../modules/services/put/setting";
import {
    PermissionContents, PermissionId,
    Permissions,
    SettingId, StatusContents, StatusId,
    UserRoleContents,
    UserRoleId
} from "../../../../../../public/static";
import V, {DateMask} from "../../../../../../library/variable";
import {UsersGetParamDocument} from "../../../../../../modules/services/get/user";
import {UserDocument} from "../../../../../../modules/ajax/result/data";
import {GlobalFunctions} from "../../../../../../config/global";
import Spinner from "../../../tools/spinner";
import ThemeChooseImage from "../../../components/chooseImage";
import {UserPostParamDocument} from "../../../../../../modules/services/post/user";
import {UserPutParamDocument} from "../../../../../../modules/services/put/user";

type PageState = {
    isLoading: boolean,
    isSubmitting: boolean
    isImageChanging: boolean
    isSelectionImage: boolean
    data: {
        email: string
        roleId: number
        statusId: number
        permissionId: number[]
    }
    formData: {
        userId: number
        image: string
        name: string
        comment: string
        phone: string
        facebook: string
        instagram: string
        twitter: string
    }
};

type PageProps = {} & PagePropCommonDocument;

export class PageSettingsProfile extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            isLoading: true,
            isSubmitting: false,
            isImageChanging: false,
            isSelectionImage: false,
            data: {
                email: "",
                roleId: 0,
                statusId: 0,
                permissionId: []
            },
            formData: {
                userId: this.props.getPageData.searchParams.userId,
                image: "",
                name: "",
                comment: "",
                phone: "",
                facebook: "",
                instagram: "",
                twitter: ""
            }
        }
    }

    componentDidMount() {
        this.setPageTitle();
        this.getUser();
    }

    setPageTitle() {
        this.props.setBreadCrumb([this.props.router.t("settings"), this.props.router.t("profile")])
    }

    getUser() {
        let params: UsersGetParamDocument = {
            userId: this.props.getSessionData.id,
            requestType: "list"
        };
        let resData = Services.Get.users(params);
        if (resData.status) {
            const user: UserDocument = resData.data[0];
            this.setState((state: PageState) => {
                state.data = {
                    email: user.userEmail,
                    roleId: user.userRoleId,
                    statusId: user.userStatusId,
                    permissionId: user.userPermissions
                };

                if (user.userRoleId == UserRoleId.Admin) {
                    state.data.permissionId = Object.keys(PermissionId).map(permKey => PermissionId[permKey]);
                }

                state.formData = {
                    userId: user.userId,
                    image: user.userImage,
                    name: user.userName,
                    comment: user.userComment,
                    phone: user.userPhone,
                    facebook: user.userFacebook,
                    instagram: user.userInstagram,
                    twitter: user.userTwitter
                }

                return state;
            })
        }
        this.setState({
            isLoading: false
        })
    }

    onChangeImage(image: string) {
        this.setState({
            isSubmitting: true,
            isImageChanging: true
        }, () => {
            let params: UserPutParamDocument = {
                userId: this.state.formData.userId,
                image: image
            };
            Services.Put.user(params).then(resData => {
                this.setState((state: PageState) => {
                    state.isSubmitting = false;
                    state.isImageChanging = false;
                    state.formData.image = image;
                    return state;
                }, () => {
                    this.props.setSessionData({
                        image: image
                    })
                });
            });
        })
        this.setState((state: PageState) => {
            state.formData.image = image;
            return state
        })
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        this.setState({
            isSubmitting: true
        }, () => {
            let params: UserPutParamDocument = Object.assign({}, this.state.formData);

            Services.Put.user(params).then(resData => {
                this.setState({
                    isSubmitting: false
                }, () => {
                    this.props.setSessionData({
                        name: this.state.formData.name
                    })
                });
            });
        })
    }

    ProfileInformation = () => (
        <div className="grid-margin stretch-card">
            <div className="card">
                <div className="card-body">
                    <h6 className="pb-1 border-bottom fw-bold text-start">General</h6>
                    <div className="row">
                        <div className="col-sm-12">
                            <span className="mb-2 fw-bold">Email:
                                <h6 className="text-muted d-inline-block ms-1">{this.state.data.email}</h6>
                            </span>
                        </div>
                        <div className="col-sm-12">
                            <span className="mb-2 fw-bold">Role:
                                <label
                                    className={`badge badge-gradient-${GlobalFunctions.getUserRolesClassName(this.state.data.roleId)} ms-1`}>
                                    {
                                        GlobalFunctions.getStaticContent(UserRoleContents, "roleId", this.state.data.roleId, this.props.getSessionData.langId)
                                    }
                                </label>
                            </span>
                        </div>
                        <div className="col-sm-12">
                            <span className="mb-2 fw-bold">Status:
                                <label
                                    className={`badge badge-gradient-${GlobalFunctions.getStatusClassName(this.state.data.statusId)} ms-1`}>
                                    {
                                        GlobalFunctions.getStaticContent(StatusContents, "statusId", this.state.data.statusId, this.props.getSessionData.langId)
                                    }
                                </label>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    Permissions = () => {
        const PermissionItem = (props: { id: number }) => (
            <label className="badge badge-outline-info ms-1 mb-1">
                {
                    GlobalFunctions.getStaticContent(PermissionContents, "permId", props.id, this.props.getSessionData.langId)
                }
            </label>
        )

        return (
            <div className="grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h6 className="pb-1 border-bottom fw-bold text-start">Permissions</h6>
                        {
                            Permissions.findMulti("id", this.state.data.permissionId).orderBy("groupId", "asc").map(perm =>
                                <PermissionItem id={perm.id}/>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }

    Image = () => (
        <div className="grid-margin stretch-card">
            <div className="card">
                <div className="card-body">
                    {
                        this.state.isImageChanging
                            ? <Spinner/>
                            : <div className="d-flex flex-column align-items-center text-center">
                                <img
                                    className="rounded-circle"
                                    width="200"
                                    height="200"
                                    src={GlobalFunctions.getUploadedImageSrc(this.state.formData.image)}
                                    alt={this.props.getSessionData.name}
                                />
                                <button
                                    className="btn btn-gradient-dark w-25 mt-2"
                                    onClick={() => this.setState({isSelectionImage: true})}
                                >
                                    <i className="fa fa-pencil-square-o"></i>
                                </button>
                            </div>
                    }
                </div>
            </div>
        </div>
    )

    Content = () => (
        <div className="grid-margin stretch-card">
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12">
                            <ThemeForm
                                isActiveSaveButton={true}
                                saveButtonText={this.props.router.t("save")}
                                saveButtonLoadingText={this.props.router.t("loading")}
                                isSubmitting={this.state.isSubmitting}
                                formAttributes={{onSubmit: (event) => this.onSubmit(event)}}
                            >
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <ThemeFormType
                                            title={`${this.props.router.t("name")}*`}
                                            name="name"
                                            type="text"
                                            required={true}
                                            value={this.state.formData.name}
                                            onChange={e => HandleForm.onChangeInput(e, this)}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <ThemeFormType
                                            title={this.props.router.t("comment")}
                                            name="comment"
                                            type="textarea"
                                            value={this.state.formData.comment}
                                            onChange={e => HandleForm.onChangeInput(e, this)}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <ThemeFormType
                                            title={`${this.props.router.t("phone")}`}
                                            name="phone"
                                            type="tel"
                                            value={this.state.formData.phone}
                                            onChange={e => HandleForm.onChangeInput(e, this)}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <ThemeFormType
                                            title="Facebook"
                                            name="facebook"
                                            type="url"
                                            value={this.state.formData.facebook}
                                            onChange={e => HandleForm.onChangeInput(e, this)}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <ThemeFormType
                                            title="Instagram"
                                            name="instagram"
                                            type="url"
                                            value={this.state.formData.instagram}
                                            onChange={e => HandleForm.onChangeInput(e, this)}
                                        />
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <ThemeFormType
                                            title="Twitter"
                                            name="twitter"
                                            type="url"
                                            value={this.state.formData.twitter}
                                            onChange={e => HandleForm.onChangeInput(e, this)}
                                        />
                                    </div>
                                </div>
                            </ThemeForm>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    render() {
        return this.state.isLoading ? <Spinner/> : (
            <div className="page-settings">
                <ThemeChooseImage
                    {...this.props}
                    isShow={this.state.isSelectionImage}
                    onHide={() => this.setState({isSelectionImage: false})}
                    result={this.state.formData.image}
                    onSelected={images => this.onChangeImage(images[0])}
                    isMulti={false}
                />
                <div className="row">
                    <div className="col-md-3">
                        <this.Image/>
                    </div>
                    <div className="col-md-5">
                        <this.Content/>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-md-12">
                                <this.ProfileInformation/>
                            </div>
                            <div className="col-md-12">
                                <this.Permissions/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PageSettingsProfile;
