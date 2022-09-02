import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Collapse} from 'react-bootstrap';
import {Trans} from 'react-i18next';
import {PermissionId, PostTypeId, UserRoleContents} from "../../../public/static";
import {pageRoutes} from "../../routes";
import {PagePropCommonDocument} from "../../../types/app/pageProps";
import permissionUtil from "../../../utils/functions/permission.util";
import imageSourceUtil from "../../../utils/functions/imageSource.util";
import classNameUtil from "../../../utils/functions/className.util";
import staticContentUtil from "../../../utils/functions/staticContent.util";

type PageState = {
    isMenuOpen: {
        pages: boolean,
        blogs: boolean,
        portfolios: boolean,
        sliders: boolean,
        references: boolean,
        settings: boolean,
        users: boolean,
        gallery: boolean,
        themeContents: boolean,
        navigates,
    }
};

type PageProps = {} & PagePropCommonDocument;

interface SideBarPath {
    path: string,
    title: string,
    icon?: string,
    state?: string,
    subPaths?: Array<SideBarPath>
    permId?: PermissionId
}

class Sidebar extends Component<PageProps, PageState> {
    state = {
        isMenuOpen: {
            pages: false,
            blogs: false,
            portfolios: false,
            sliders: false,
            references: false,
            settings: false,
            users: false,
            gallery: false,
            themeContents: false,
            navigates: false
        }
    };

    componentDidMount() {
        this.onRouteChanged();
        const body = document.querySelector('body') as HTMLBodyElement;
        document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

            el.addEventListener('mouseover', function () {
                if (body.classList.contains('sidebar-icon-only')) {
                    el.classList.add('hover-open');
                }
            });
            el.addEventListener('mouseout', function () {
                if (body.classList.contains('sidebar-icon-only')) {
                    el.classList.remove('hover-open');
                }
            });
        });
    }

    componentDidUpdate(prevProps: any) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        let self = this;
        (document.querySelector('#sidebar') as HTMLDivElement).classList.remove('active');
        this.setStateMenuOpens(self.sidebarData.Paths);
    }

    setStateMenuOpens(paths: Array<SideBarPath>, activePath: string | null = null) {
        paths.forEach(item => {
            if ((activePath !== null && activePath.search(item.path) > -1) || (activePath === null && this.isPathActive(item.path))) {
                if (typeof item.state !== "undefined") {
                    let status = true;
                    // @ts-ignore
                    if (this.state.isMenuOpen[item.state] && activePath !== null && activePath.endsWith(item.path)) status = false;
                    this.setState((state: any) => { // @ts-ignore
                        state.isMenuOpen[item.state] = status;
                        return state;
                    })
                    if (typeof item.subPaths !== "undefined") {
                        this.setStateMenuOpens(item.subPaths, activePath);
                    }
                }
            } else {
                if (typeof item.state !== "undefined") {
                    this.setState((state: any) => { // @ts-ignore
                        state.isMenuOpen[item.state] = false;
                        return state;
                    })
                }
            }
        });
    }

    toggleMenuState(activePath: string) {
        this.setStateMenuOpens(this.sidebarData.Paths, activePath);
    }

    isPathActive(path: any) {
        return this.props.router.location.pathname.search(path) > -1;
    }

    navigateProfile() {
        this.props.router.navigate(pageRoutes.settings.path() + pageRoutes.settings.profile.path(), {replace: true})
    }

    get sidebarData(): { Paths: Array<SideBarPath> } {
        return {
            Paths: [
                {path: pageRoutes.dashboard.path(), icon: `home`, title: this.props.router.t("dashboard")},
                {
                    path: pageRoutes.gallery.path(),
                    icon: `image-multiple`,
                    title: this.props.router.t("gallery"),
                    state: `gallery`,
                    subPaths: [
                        {
                            path: pageRoutes.gallery.upload.path(),
                            icon: `upload`,
                            title: this.props.router.t("upload"),
                            permId: PermissionId.GalleryEdit,
                        },
                        {path: pageRoutes.gallery.list.path(), title: this.props.router.t("list")}
                    ]
                },
                {
                    path: pageRoutes.navigate.path(),
                    icon: `navigation-variant`,
                    title: this.props.router.t("navigates"),
                    state: `navigates`,
                    subPaths: [
                        {
                            path: pageRoutes.navigate.add.path(),
                            title: this.props.router.t("add"),
                            permId: PermissionId.NavigateAdd
                        },
                        {path: pageRoutes.navigate.list.path(), title: this.props.router.t("list")}
                    ]
                },
                {
                    path: pageRoutes.post.path(PostTypeId.Page),
                    icon: `note-multiple`,
                    title: this.props.router.t("pages"),
                    state: `pages`,
                    subPaths: [
                        {
                            path: pageRoutes.post.add.path(),
                            title: this.props.router.t("add"),
                            permId: PermissionId.PageAdd
                        },
                        {path: pageRoutes.post.list.path(), title: this.props.router.t("list")}
                    ]
                },
                {
                    path: pageRoutes.themeContent.path(),
                    icon: `shape`,
                    title: this.props.router.t("themeContents"),
                    state: `themeContents`,
                    subPaths: [
                        {
                            path: pageRoutes.post.path(PostTypeId.Blog),
                            title: this.props.router.t("blogs"),
                            state: `blogs`,
                            subPaths: [
                                {
                                    path: pageRoutes.post.add.path(),
                                    title: this.props.router.t("add"),
                                    permId: PermissionId.BlogAdd
                                },
                                {path: pageRoutes.post.list.path(), title: this.props.router.t("list")}
                            ]
                        },
                        {
                            path: pageRoutes.post.path(PostTypeId.Portfolio),
                            title: this.props.router.t("portfolios"),
                            state: `portfolios`,
                            subPaths: [
                                {
                                    path: pageRoutes.post.add.path(),
                                    title: this.props.router.t("add"),
                                    permId: PermissionId.PortfolioAdd
                                },
                                {path: pageRoutes.post.list.path(), title: this.props.router.t("list")}
                            ]
                        },
                        {
                            path: pageRoutes.post.path(PostTypeId.Slider),
                            title: this.props.router.t("sliders"),
                            state: `sliders`,
                            subPaths: [
                                {
                                    path: pageRoutes.post.add.path(),
                                    title: this.props.router.t("add"),
                                    permId: PermissionId.SliderAdd
                                },
                                {path: pageRoutes.post.list.path(), title: this.props.router.t("list")}
                            ]
                        },
                        {
                            path: pageRoutes.post.path(PostTypeId.Reference),
                            title: this.props.router.t("references"),
                            state: `references`,
                            subPaths: [
                                {
                                    path: pageRoutes.post.add.path(),
                                    title: this.props.router.t("add"),
                                    permId: PermissionId.ReferenceAdd
                                },
                                {path: pageRoutes.post.list.path(), title: this.props.router.t("list")}
                            ]
                        },
                    ]
                },
                {
                    path: pageRoutes.settings.path(),
                    icon: `cog`,
                    title: this.props.router.t("settings"),
                    state: `settings`,
                    subPaths: [
                        {
                            path: pageRoutes.settings.user.path(),
                            icon: `account-multiple`,
                            title: this.props.router.t("users"),
                            state: `users`,
                            subPaths: [
                                {
                                    path: pageRoutes.settings.user.add.path(),
                                    title: this.props.router.t("add"),
                                    permId: PermissionId.UserAdd
                                },
                                {path: pageRoutes.settings.user.list.path(), title: this.props.router.t("list")}
                            ]
                        },
                        {
                            path: pageRoutes.settings.seo.path(),
                            icon: `magnify`,
                            title: this.props.router.t("seo"),
                            permId: PermissionId.SeoEdit
                        },
                        {
                            path: pageRoutes.settings.general.path(),
                            title: this.props.router.t("general"),
                            permId: PermissionId.SettingEdit
                        },
                        {
                            path: pageRoutes.settings.profile.path(),
                            icon: `account`,
                            title: this.props.router.t("profile")
                        },
                        {path: pageRoutes.settings.changePassword.path(), title: this.props.router.t("changePassword")}
                    ]
                },
            ]
        }
    }

    Item = (props: SideBarPath) => {
        let self = this;

        function HasChild(_props: SideBarPath) {
            if (_props.permId && !permissionUtil.checkPermission(
                self.props.getSessionData.roleId,
                self.props.getSessionData.permissions,
                _props.permId
            )) return null;
            return (
                <Link className={`nav-link ${self.isPathActive(_props.path) ? 'active' : ''}`} to={_props.path}>
                    <span
                        className={`menu-title text-capitalize ${self.isPathActive(_props.path) ? 'active' : ''}`}><Trans>{_props.title}</Trans></span>
                    <i className={`mdi mdi-${_props.icon} menu-icon`}></i>
                </Link>
            );
        }

        function HasChildren(_props: SideBarPath) {
            if (_props.permId && !permissionUtil.checkPermission(
                self.props.getSessionData.roleId,
                self.props.getSessionData.permissions,
                _props.permId
            )) return null;
            // @ts-ignore
            let state = (typeof _props.state === "undefined") ? false : self.state.isMenuOpen[_props.state];
            return (
                <span>
            <div
                className={`nav-link ${state ? 'menu-expanded' : ''} ${self.isPathActive(_props.path) ? 'active' : ''}`}
                onClick={() => self.toggleMenuState(_props.path)} data-toggle="collapse">
              <span
                  className={`menu-title text-capitalize ${self.isPathActive(_props.path) ? 'active' : ''}`}><Trans>{_props.title}</Trans></span>
              <i className="menu-arrow"></i>
              <i className={`mdi mdi-${_props.icon} menu-icon`}></i>
            </div>
            <Collapse in={state}>
              <ul className="nav flex-column sub-menu">
                {
                    // @ts-ignore
                    _props.subPaths.map((item, index) => {
                        if (item.permId && !permissionUtil.checkPermission(
                            self.props.getSessionData.roleId,
                            self.props.getSessionData.permissions,
                            item.permId
                        )) return null;
                        item.path = _props.path + item.path;
                        return (
                            <li className="nav-item" key={index}>
                                {
                                    (typeof item.subPaths === "undefined") ? <HasChild key={index} {...item}/> :
                                        <HasChildren key={index} {...item} />
                                }
                            </li>
                        );
                    })
                }
              </ul>
            </Collapse>
          </span>
            );
        }

        return (
            <li className={`nav-item ${self.isPathActive(props.path) ? 'active' : ''}`}>
                {
                    (typeof props.subPaths === "undefined") ? <HasChild {...props}/> : <HasChildren {...props} />
                }
            </li>
        )
    }

    render() {
        return (
            <nav className="sidebar sidebar-offcanvas" id="sidebar">
                <ul className="nav pt-5">
                    {
                        this.sidebarData.Paths.map((item, index) => {
                            return <this.Item
                                key={index}
                                {...item}
                            />
                        })
                    }
                </ul>
            </nav>
        );
    }
}

export default Sidebar;