import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import {
    LanguageId, PermissionGroups,
    Permissions, Status,
    StatusId, UserRoles,
} from "constants/index";
import UserDocument from "types/services/user";
import {PagePropCommonDocument} from "types/app/pageProps";
import classNameUtil from "utils/className.util";
import imageSourceUtil from "utils/imageSource.util";
import {ThemeFieldSet} from "../form";
import {PermissionDocument, PermissionGroupDocument} from "types/constants";

type PageState = {};

type PageProps = {
    router: PagePropCommonDocument["router"];
    isShow: boolean
    onClose: any
    userInfo: UserDocument
    langId: LanguageId
};

class ThemeUsersProfileCard extends Component<PageProps, PageState> {
    SocialMedia = () => (
        <ul className="social-link list-unstyled">
            <li>
                <a href={this.props.userInfo.facebook} target="_blank">
                    <i className="mdi mdi-facebook"></i>
                </a>
            </li>
            <li>
                <a href={this.props.userInfo.twitter} target="_blank">
                    <i className="mdi mdi-twitter"></i>
                </a>
            </li>
            <li>
                <a href={this.props.userInfo.instagram} target="_blank">
                    <i className="mdi mdi-instagram"></i>
                </a>
            </li>
        </ul>
    )

    General = () => (
        <>
            <h6 className="pb-1 border-bottom fw-bold text-end">{this.props.router.t("general")}</h6>
            <div className="row">
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("email")}:
                        <h6 className="text-muted d-inline-block ms-1">{this.props.userInfo.email}</h6>
                    </span>
                </div>
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("phone")}:
                        <h6 className="text-muted d-inline-block ms-1">{this.props.userInfo.phone}</h6>
                    </span>
                </div>
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("role")}:
                        <label
                            className={`badge badge-gradient-${classNameUtil.getUserRolesClassName(this.props.userInfo.roleId)} ms-1`}>
                            {
                                this.props.router.t(UserRoles.findSingle("id", this.props.userInfo.roleId)?.langKey ?? "[noLangAdd]")
                            }
                        </label>
                    </span>
                </div>
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("status")}:
                        <label
                            className={`badge badge-gradient-${classNameUtil.getStatusClassName(this.props.userInfo.statusId)} ms-1`}>
                            {
                                this.props.router.t(Status.findSingle("id", this.props.userInfo.statusId)?.langKey ?? "[noLangAdd]")
                            }
                        </label>
                    </span>
                </div>
                {
                    (this.props.userInfo.statusId == StatusId.Banned)
                        ? (
                            <div className="col-sm-12">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <p className="mb-2 fw-bold">{this.props.router.t("banDateEnd")}:
                                            <h6 className="text-muted d-inline-block ms-1">{this.props.userInfo.banDateEnd}</h6>
                                        </p>
                                    </div>
                                    <div className="col-sm-12">
                                        <p className="mb-2 fw-bold">{this.props.router.t("banComment")}:
                                            <h6 className="text-muted d-inline-block ms-1">{this.props.userInfo.banComment}</h6>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : null
                }
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("comment")}:
                        <small className="fw-bold ms-1 text-muted">{this.props.userInfo.comment}</small>
                    </span>
                </div>
            </div>
        </>
    )

    Permissions = () => {
        let permissions = Permissions.findMulti("id", this.props.userInfo.permissions);
        let permissionGroups = PermissionGroups.findMulti("id", permissions.map(permission => permission.groupId));
        permissionGroups = permissionGroups.filter((group, index) => permissionGroups.indexOfKey("id", group.id) === index);

        const PermissionGroup = (props: PermissionGroupDocument) => (
            <div className="col-md-12 mt-3">
                <ThemeFieldSet legend={this.props.router.t(props.langKey)}>
                    <div className="row">
                        {
                            permissions.findMulti("groupId", props.id).map(permission =>
                                <PermissionItem {...permission}/>
                            )
                        }
                    </div>
                </ThemeFieldSet>
            </div>
        )

        const PermissionItem = (props: PermissionDocument) => (
            <div className="col-3 mt-2">
                <label className="badge badge-outline-info ms-1 mb-1">
                    {
                        this.props.router.t(props.langKey)
                    }
                </label>
            </div>
        )

        return (
            <>
                <h6 className="pb-1 border-bottom fw-bold text-end">{this.props.router.t("permissions")}</h6>
                <div className="row">
                    {
                        permissionGroups.orderBy("order", "asc").map(group =>
                            <PermissionGroup {...group} />
                        )
                    }
                </div>
            </>
        )
    }

    render() {
        return (
            <Modal
                size="lg"
                centered
                show={this.props.isShow}
                backdrop={true}
                onHide={this.props.onClose}
            >
                <Modal.Body className="m-0 p-0">
                    <div className="card user-card">
                        <div className="row ms-0 me-0 user-card-body">
                            <div className="col-sm-4 user-profile bg-gradient-primary">
                                <h5 className="exit-icon" onClick={this.props.onClose}>
                                    <i className="mdi mdi-close"></i>
                                </h5>
                                <div className="card-block text-center text-light mt-5">
                                    <div className="mb-4">
                                        <img
                                            src={imageSourceUtil.getUploadedImageSrc(this.props.userInfo.image)}
                                            className="user-img"
                                            alt={this.props.userInfo.name}
                                        />
                                    </div>
                                    <h4 className="fw-bold pt-3">{this.props.userInfo.name}</h4>
                                    <this.SocialMedia/>
                                </div>
                            </div>
                            <div className="col-sm-8 position-relative card-profile-title">
                                <div className="p-2">
                                    <this.General/>
                                    <this.Permissions/>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        )
    }
}

export default ThemeUsersProfileCard;