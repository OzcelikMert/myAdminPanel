import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import {
    LanguageId,
    PermissionContents,
    Permissions,
    StatusContents,
    StatusId,
    UserRoleContents
} from "../../../../public/static";
import UserDocument from "../../../../types/services/user";
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import classNameUtil from "../../../../utils/functions/className.util";
import staticContentUtil from "../../../../utils/functions/staticContent.util";
import imageSourceUtil from "../../../../utils/functions/imageSource.util";

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
                <a href={this.props.userInfo.userFacebook} target="_blank">
                    <i className="mdi mdi-facebook"></i>
                </a>
            </li>
            <li>
                <a href={this.props.userInfo.userTwitter} target="_blank">
                    <i className="mdi mdi-twitter"></i>
                </a>
            </li>
            <li>
                <a href={this.props.userInfo.userInstagram} target="_blank">
                    <i className="mdi mdi-instagram"></i>
                </a>
            </li>
        </ul>
    )

    InformationGeneral = () => (
        <>
            <h6 className="pb-1 border-bottom fw-bold text-end">{this.props.router.t("general")}</h6>
            <div className="row">
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("email")}:
                        <h6 className="text-muted d-inline-block ms-1">{this.props.userInfo.userEmail}</h6>
                    </span>
                </div>
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("phone")}:
                        <h6 className="text-muted d-inline-block ms-1">{this.props.userInfo.userPhone}</h6>
                    </span>
                </div>
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("role")}:
                        <label
                            className={`badge badge-gradient-${classNameUtil.getUserRolesClassName(this.props.userInfo.userRoleId)} ms-1`}>
                            {
                                staticContentUtil.getStaticContent(UserRoleContents, "roleId", this.props.userInfo.userRoleId)
                            }
                        </label>
                    </span>
                </div>
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("status")}:
                        <label
                            className={`badge badge-gradient-${classNameUtil.getStatusClassName(this.props.userInfo.userStatusId)} ms-1`}>
                            {
                                staticContentUtil.getStaticContent(StatusContents, "statusId", this.props.userInfo.userStatusId)
                            }
                        </label>
                    </span>
                </div>
                {
                    (this.props.userInfo.userStatusId == StatusId.Banned)
                        ? (
                            <div className="col-sm-12">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <p className="mb-2 fw-bold">{this.props.router.t("banDateEnd")}:
                                            <h6 className="text-muted d-inline-block ms-1">{this.props.userInfo.userBanDateEnd}</h6>
                                        </p>
                                    </div>
                                    <div className="col-sm-12">
                                        <p className="mb-2 fw-bold">{this.props.router.t("banComment")}:
                                            <h6 className="text-muted d-inline-block ms-1">{this.props.userInfo.userBanComment}</h6>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : null
                }
                <div className="col-sm-12">
                    <span className="mb-2 fw-bold">{this.props.router.t("comment")}:
                        <small className="fw-bold ms-1 text-muted">{this.props.userInfo.userComment}</small>
                    </span>
                </div>
            </div>
        </>
    )

    PermissionItem = (props: { id: number }) => (
        <label className="badge badge-outline-info ms-1 mb-1">
            {
                staticContentUtil.getStaticContent(PermissionContents, "permId", props.id)
            }
        </label>
    )

    InformationPermissions = () => (
        <>
            <h6 className="pb-1 border-bottom fw-bold text-end">{this.props.router.t("permissions")}</h6>
            <div>
                {
                    Permissions.findMulti("id", this.props.userInfo.userPermissions).orderBy("groupId", "asc").map(perm =>
                        <this.PermissionItem id={perm.id}/>
                    )
                }
            </div>
        </>
    )

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
                                            src={imageSourceUtil.getUploadedImageSrc(this.props.userInfo.userImage)}
                                            className="user-img"
                                            alt={this.props.userInfo.userName}
                                        />
                                    </div>
                                    <h4 className="fw-bold pt-3">{this.props.userInfo.userName}</h4>
                                    <this.SocialMedia/>
                                </div>
                            </div>
                            <div className="col-sm-8 position-relative">
                                <div className="p-2">
                                    <this.InformationGeneral/>
                                    <this.InformationPermissions/>
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