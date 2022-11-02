import React, {Component} from 'react';
import {Dropdown} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {Trans} from 'react-i18next';
import {PagePropCommonDocument} from "../../../types/app/pageProps";
import {pageRoutes} from "../../routes";
import authService from "../../../services/auth.service";
import {LanguageDocument} from "../../../types/constants";
import {Languages} from "../../../constants";
import localStorageUtil from "../../../utils/localStorage.util";
import pathUtil from "../../../utils/path.util";
import imageSourceUtil from "../../../utils/functions/imageSource.util";

type PageState = {};

type PageProps = {} & PagePropCommonDocument;

class Navbar extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {}

    }

    toggleOffCanvas() {
        (document.querySelector('.sidebar-offcanvas') as HTMLCanvasElement).classList.toggle('active');
    }

    profileEvents(event: "profile" | "lock" | "signOut" | "changePassword") {
        switch(event) {
            case "profile":
                this.props.router.navigate(pageRoutes.settings.path() + pageRoutes.settings.profile.path(), {replace: true})
                break;
            case "changePassword":
                this.props.router.navigate(pageRoutes.settings.path() + pageRoutes.settings.changePassword.path(), {replace: true})
                break;
            case "lock":
                authService.logOut().then(resData => {
                    if(resData.status) {
                        this.props.setSessionData({
                            id: ""
                        }, () => {
                            this.props.router.navigate(pageRoutes.lock.path(), {replace: true})
                        })
                    }
                })
                break;
            case "signOut":
                authService.logOut().then(resData => {
                    if(resData.status) {
                        this.props.setSessionData({
                            id: ""
                        }, () => {
                            this.props.router.navigate(pageRoutes.login.path(), {replace: true})
                        })
                    }
                })
                break;
        }
    }

    onChangeLanguage(langId: number) {
        let language = Languages.findSingle("id", langId);
        if(language) {
            localStorageUtil.adminLanguage.set(langId);
            window.location.reload();
        }
    }

    Notifications = () => (
        <Dropdown align={"end"}>
            <Dropdown.Toggle className="nav-link count-indicator">
                <i className="mdi mdi-bell-outline"></i>
                <span className="count-symbol bg-danger"></span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu navbar-dropdown preview-list">
                <h6 className="p-3 mb-0"><Trans>Notifications</Trans></h6>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item"
                               onClick={evt => evt.preventDefault()}>
                    <div className="preview-thumbnail">
                        <div className="preview-icon bg-success">
                            <i className="mdi mdi-calendar"></i>
                        </div>
                    </div>
                    <div
                        className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                        <h6 className="preview-subject font-weight-normal mb-1"><Trans>Event
                            today</Trans></h6>
                        <p className="text-gray ellipsis mb-0">
                            <Trans>Just a reminder that you have an event today</Trans>
                        </p>
                    </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item"
                               onClick={evt => evt.preventDefault()}>
                    <div className="preview-thumbnail">
                        <div className="preview-icon bg-warning">
                            <i className="mdi mdi-settings"></i>
                        </div>
                    </div>
                    <div
                        className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                        <h6 className="preview-subject font-weight-normal mb-1">
                            <Trans>Settings</Trans></h6>
                        <p className="text-gray ellipsis mb-0">
                            <Trans>Update dashboard</Trans>
                        </p>
                    </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <Dropdown.Item className="dropdown-item preview-item"
                               onClick={evt => evt.preventDefault()}>
                    <div className="preview-thumbnail">
                        <div className="preview-icon bg-info">
                            <i className="mdi mdi-link-variant"></i>
                        </div>
                    </div>
                    <div
                        className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                        <h6 className="preview-subject font-weight-normal mb-1"><Trans>Launch
                            Admin</Trans></h6>
                        <p className="text-gray ellipsis mb-0">
                            <Trans>New admin wow</Trans>!
                        </p>
                    </div>
                </Dropdown.Item>
                <div className="dropdown-divider"></div>
                <h6 className="p-3 mb-0 text-center cursor-pointer"><Trans>See all
                    notifications</Trans></h6>
            </Dropdown.Menu>
        </Dropdown>
    )

    LanguageItem = (props: LanguageDocument) => {
        return (
            <Dropdown.Item onClick={evt => this.onChangeLanguage(props.id)}>
                <div className="language-flag">
                    <img src={pathUtil.uploads.flags + props.image} alt={props.title}/>
                </div>
                <div className="ms-2 d-flex align-items-start flex-column justify-content-center">
                    <span>{props.title}</span>
                </div>
            </Dropdown.Item>
        )
    }

    LanguageSelectedItem = (props: LanguageDocument) => {
        return (
            <div className="selected-language">
                <img src={pathUtil.uploads.flags + props.image} alt={props.title}/>
            </div>
        )
    }

    Languages = () => (
        <Dropdown align={"end"}>
            <Dropdown.Toggle className="nav-link">
                {
                    <this.LanguageSelectedItem {...Languages.findSingle("id", localStorageUtil.adminLanguage.get)} />
                }
            </Dropdown.Toggle>

            <Dropdown.Menu className="navbar-dropdown">
                <div className="dropdown-divider"></div>
                {
                    Languages.map(language => (
                        <>
                            <this.LanguageItem {...language} />
                            <div className="dropdown-divider"></div>
                        </>
                    ))
                }
            </Dropdown.Menu>
        </Dropdown>
    )

    Messages = () => (
        <Dropdown align={"end"}>
            <Dropdown.Toggle className="nav-link count-indicator">
                <i className="mdi mdi-email-outline"></i>
                {
                    //<span className="count-symbol bg-warning"></span>
                }
            </Dropdown.Toggle>

            <Dropdown.Menu className="preview-list navbar-dropdown">
                <h6 className="p-3 mb-0">{this.props.router.t("messages")}</h6>
                <div className="dropdown-divider"></div>
                {
                   /* <Dropdown.Item className="dropdown-item preview-item"
                                   onClick={evt => evt.preventDefault()}>
                        <div className="preview-thumbnail">
                            <img src={require("../../../../assets/images/faces/face4.jpg")} alt="user"
                                 className="profile-pic"/>
                        </div>
                        <div
                            className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                            <h6 className="preview-subject ellipsis mb-1 font-weight-normal"><Trans>Mark
                                send you a message</Trans></h6>
                            <p className="text-gray mb-0">
                                1 <Trans>Minutes ago</Trans>
                            </p>
                        </div>
                    </Dropdown.Item>
                    <div className="dropdown-divider"></div> */
                }
            </Dropdown.Menu>
        </Dropdown>
    )

    Profile = () => (
        <Dropdown align={"end"}>
            <Dropdown.Toggle className="nav-link">
                <div className="nav-profile-img">
                    <img
                        src={imageSourceUtil.getUploadedImageSrc(this.props.getSessionData.image)}
                         alt={this.props.getSessionData.name}
                    />
                    <span className="availability-status online"></span>
                </div>
                <div className="nav-profile-text">
                    <p className="mb-1 text-black">
                        {
                            this.props.getSessionData.name
                        }
                    </p>
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu  className="navbar-dropdown">
                <Dropdown.Item onClick={evt => this.profileEvents("profile")}>
                    <i className="mdi mdi-account-circle me-2 text-primary"></i>
                    {this.props.router.t("profile")}
                </Dropdown.Item>
                <Dropdown.Item onClick={evt => this.profileEvents("changePassword")}>
                    <i className="mdi mdi-key me-2 text-primary"></i>
                    {this.props.router.t("changePassword").toCapitalizeCase()}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.profileEvents("lock")}>
                    <i className="mdi mdi-lock me-2 text-primary"></i>
                    {this.props.router.t("lock")}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => this.profileEvents("signOut")}>
                    <i className="mdi mdi-logout me-2 text-primary"></i>
                    {this.props.router.t("signOut")}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )

    render() {
        return (
            <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
                <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
                    <Link className="navbar-brand brand-logo" to="/"><img
                        src={require('../../../assets/images/admin/ozcelikLogo.png')} alt="logo"/></Link>
                    <Link className="navbar-brand brand-logo-mini" to="/"><img
                        src={require('../../../assets/images/admin/ozcelikLogoMini.png')} alt="logo"/></Link>
                </div>
                <div className="navbar-menu-wrapper d-flex align-items-stretch">
                    <button className="navbar-toggler navbar-toggler align-self-center" type="button"
                            onClick={() => document.body.classList.toggle('sidebar-icon-only')}>
                        <span className="mdi mdi-menu"></span>
                    </button>
                    <ul className="navbar-nav navbar-nav-right">
                        <li className="nav-item nav-languages">
                            <this.Languages/>
                        </li>
                        <li className="nav-item nav-profile">
                            <this.Profile/>
                        </li>
                    </ul>
                    <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={() => this.toggleOffCanvas()}>
                        <span className="mdi mdi-menu"></span>
                    </button>
                </div>
            </nav>
        );
    }
}

export default Navbar;
