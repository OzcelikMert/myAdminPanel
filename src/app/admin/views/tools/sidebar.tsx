import React, {Component} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {Collapse} from 'react-bootstrap';
import {Trans} from 'react-i18next';
import {PostTypeId, PostTypes, UserRoleContents} from "../../../../public/static";
import router, {pageRoutes} from "../../routes";
import {PagePropCommonDocument} from "../../../../modules/views/pages/pageProps";
import {GlobalFunctions, GlobalPaths} from '../../../../config/global';
import V from "../../../../library/variable";
import {emptyImage} from "../components/chooseImage";

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
                        {path: pageRoutes.gallery.upload.path(), icon: `upload`, title: this.props.router.t("upload")},
                        {path: pageRoutes.gallery.list.path(), title: this.props.router.t("list")}
                    ]
                },
                {
                    path: pageRoutes.navigate.path(),
                    icon: `navigation-variant`,
                    title: this.props.router.t("navigates"),
                    state: `navigates`,
                    subPaths: [
                        {path: pageRoutes.navigate.add.path(), title: this.props.router.t("add")},
                        {path: pageRoutes.navigate.list.path(), title: this.props.router.t("list")}
                    ]
                },
                {
                    path: pageRoutes.post.path(PostTypeId.Page),
                    icon: `note-multiple`,
                    title: this.props.router.t("pages"),
                    state: `pages`,
                    subPaths: [
                        {path: pageRoutes.post.add.path(), title: this.props.router.t("add")},
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
                                {path: pageRoutes.post.add.path(), title: this.props.router.t("add")},
                                {path: pageRoutes.post.list.path(), title: this.props.router.t("list")}
                            ]
                        },
                        {
                            path: pageRoutes.post.path(PostTypeId.Portfolio),
                            title: this.props.router.t("portfolios"),
                            state: `portfolios`,
                            subPaths: [
                                {path: pageRoutes.post.add.path(), title: this.props.router.t("add")},
                                {path: pageRoutes.post.list.path(), title: this.props.router.t("list")}
                            ]
                        },
                        {
                            path: pageRoutes.post.path(PostTypeId.Slider),
                            title: this.props.router.t("sliders"),
                            state: `sliders`,
                            subPaths: [
                                {path: pageRoutes.post.add.path(), title: this.props.router.t("add")},
                                {path: pageRoutes.post.list.path(), title: this.props.router.t("list")}
                            ]
                        },
                        {
                            path: pageRoutes.post.path(PostTypeId.Reference),
                            title: this.props.router.t("references"),
                            state: `references`,
                            subPaths: [
                                {path: pageRoutes.post.add.path(), title: this.props.router.t("add")},
                                {path: pageRoutes.post.list.path(), title: this.props.router.t("list")}
                            ]
                        }
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
                                {path: pageRoutes.settings.user.add.path(), title: this.props.router.t("add")},
                                {path: pageRoutes.settings.user.list.path(), title: this.props.router.t("list")}
                            ]
                        },
                        {path: pageRoutes.settings.seo.path(), icon: `magnify`, title: this.props.router.t("seo")},
                        {path: pageRoutes.settings.general.path(), title: this.props.router.t("general")},
                    ]
                },
            ]
        }
    }

    Item = (props: SideBarPath) => {
        let self = this;

        function HasChild(_props: SideBarPath) {
            return (
                <Link className={`nav-link ${self.isPathActive(_props.path) ? 'active' : ''}`} to={_props.path}>
                    <span
                        className={`menu-title text-capitalize ${self.isPathActive(_props.path) ? 'active' : ''}`}><Trans>{_props.title}</Trans></span>
                    <i className={`mdi mdi-${_props.icon} menu-icon`}></i>
                </Link>
            );
        }

        function HasChildren(_props: SideBarPath) {
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

    onRouteChanged() {
        let self = this;
        (document.querySelector('#sidebar') as HTMLDivElement).classList.remove('active');
        this.setStateMenuOpens(self.sidebarData.Paths);
    }

    isPathActive(path: any) {
        return this.props.router.location.pathname.search(path) > -1;
    }

    render() {
        return (
            <nav className="sidebar sidebar-offcanvas" id="sidebar">
                <ul className="nav">
                    <li className="nav-item nav-profile">
                        <a href="!#" className="nav-link" onClick={evt => evt.preventDefault()}>
                            <div className="nav-profile-image">
                                <img
                                    src={
                                    this.props.getSessionData.image && !V.isEmpty(this.props.getSessionData.image)
                                        ? (this.props.getSessionData.image.isUrl())
                                            ? this.props.getSessionData.image
                                            : GlobalPaths.uploads.images + this.props.getSessionData.image
                                        : emptyImage
                                    }
                                    alt={this.props.getSessionData.name}
                                />
                                <span
                                    className="login-status online"></span> {/* change to offline or busy as needed */}
                            </div>
                            <div className="nav-profile-text">
                <span className="font-weight-bold mb-2">
                    {
                        this.props.getSessionData.name
                    }
                </span>
                                <span className="text-secondary text-small">
                    <label
                        className={`badge badge-gradient-${GlobalFunctions.getUserRolesClassName(this.props.getSessionData.roleId)} float-end`}>
                        {
                            GlobalFunctions.getStaticContent(
                                UserRoleContents,
                                "roleId",
                                this.props.getSessionData.roleId,
                                this.props.getSessionData.langId
                            )
                        }
                    </label>
                </span>
                            </div>
                        </a>
                    </li>

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