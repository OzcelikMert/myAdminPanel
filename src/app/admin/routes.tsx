import React, {Component, Suspense} from 'react';
import {
    Routes,
    Route,
    Navigate, RouteObject, matchRoutes, useLocation,
} from "react-router-dom";
import Spinner from './views/tools/spinner';
import {PagePropCommonDocument} from "../../modules/views/pages/pageProps";

import PageLogin from "./views/pages/login";
import PageDashboard from "./views/pages/dashboard";
import PageGalleryList from "./views/pages/gallery/list";
import PageGalleryUpload from "./views/pages/gallery/upload";
import PagePostList from "./views/pages/post/list";
import PagePostAdd from "./views/pages/post/add";
import PagePostTermAdd from "./views/pages/postTerm/add";
import PagePostTermList from "./views/pages/postTerm/list";
import PageUserAdd from "./views/pages/settings/user/add";
import PageUserList from "./views/pages/settings/user/list";
import PageSettingsSEO from "./views/pages/settings/seo";
import PageSettingsGeneral from "./views/pages/settings/general";

export const pageRoutes = {
    login: {
        path() {
            return "/login"
        }
    },
    dashboard: {
        path() {
            return "/dashboard"
        }
    },
    themeContent: {
        path() {
            return "/theme-content/"
        }
    },
    gallery: {
        path() {
            return "/gallery/"
        },
        upload: {
            path() {
                return "upload"
            }
        },
        list: {
            path() {
                return "list"
            }
        },
    },
    post: {
        path(postTypeId: string | number = ":postTypeId") {
            return `post/${postTypeId}/`
        },
        add: {
            path() {
                return `add`
            }
        },
        edit: {
            path(postId: string | number = ":postId") {
                return `edit/${postId}`
            }
        },
        list: {
            path() {
                return `list`
            }
        },
    },
    postTerm: {
        path(postTypeId: string | number = ":postTypeId", termTypeId: string | number = ":termTypeId") {
            return `${pageRoutes.post.path(postTypeId)}term/${termTypeId}/`
        },
        add: {
            path() {
                return `add`
            }
        },
        edit: {
            path(termId: string | number = ":termId") {
                return `edit/${termId}`
            }
        },
        list: {
            path() {
                return `list`
            }
        },
    },
    settings: {
        path() {
            return `/settings/`
        },
        user: {
            path() {
                return `user/`
            },
            add: {
                path() {
                    return "add"
                }
            },
            edit: {
                path(userId: string | number = ":userId") {
                    return `edit/${userId}`
                }
            },
            list: {
                path() {
                    return "list"
                }
            },
        },
        seo: {
            path() {
                return "seo"
            }
        },
        general: {
            path() {
                return "general"
            }
        },
    }
}

type PageState = {} & any;

type PageProps = {} & PagePropCommonDocument;

class AppRoutes extends Component<PageProps, PageState> {
    render() {
        return (
            <Suspense fallback={<Spinner/>}>
                <Routes>
                    <Route path={pageRoutes.login.path()} element={<PageLogin router={this.props.router}/>}/>

                    <Route path={pageRoutes.dashboard.path()} element={<PageDashboard router={this.props.router}/>}/>

                    <Route path={pageRoutes.gallery.path()}>
                        <Route path={pageRoutes.gallery.upload.path()}
                               element={<PageGalleryUpload router={this.props.router}/>}/>
                        <Route path={pageRoutes.gallery.list.path()}
                               element={<PageGalleryList router={this.props.router}/>}/>
                    </Route>

                    {
                        [pageRoutes.post.path(), pageRoutes.themeContent.path() + pageRoutes.post.path()].map((path, index) =>
                            <Route path={path} key={index}>
                                <Route path={pageRoutes.post.add.path()}
                                       element={<PagePostAdd router={this.props.router}/>}/>
                                <Route path={pageRoutes.post.edit.path()}
                                       element={<PagePostAdd router={this.props.router}/>}/>
                                <Route path={pageRoutes.post.list.path()}
                                       element={<PagePostList router={this.props.router}/>}/>
                            </Route>
                        )
                    }

                    {
                        [pageRoutes.postTerm.path(), pageRoutes.themeContent.path() + pageRoutes.postTerm.path()].map((path, index) =>
                            <Route path={path} key={index}>
                                <Route path={pageRoutes.postTerm.add.path()}
                                       element={<PagePostTermAdd router={this.props.router}/>}/>
                                <Route path={pageRoutes.postTerm.edit.path()}
                                       element={<PagePostTermAdd router={this.props.router}/>}/>
                                <Route path={pageRoutes.postTerm.list.path()}
                                       element={<PagePostTermList router={this.props.router}/>}/>
                            </Route>
                        )
                    }

                    <Route path={pageRoutes.settings.path()}>
                        <Route path={pageRoutes.settings.user.path()}>
                            <Route path={pageRoutes.settings.user.add.path()}
                                   element={<PageUserAdd router={this.props.router}/>}/>
                            <Route path={pageRoutes.settings.user.edit.path()}
                                   element={<PageUserAdd router={this.props.router}/>}/>
                            <Route path={pageRoutes.settings.user.list.path()}
                                   element={<PageUserList router={this.props.router}/>}/>
                        </Route>
                        <Route path={pageRoutes.settings.seo.path()}
                               element={<PageSettingsSEO router={this.props.router}/>}/>
                        <Route path={pageRoutes.settings.general.path()}
                               element={<PageSettingsGeneral router={this.props.router}/>}/>
                    </Route>

                    <Route path="*" element={<Navigate to={pageRoutes.dashboard.path()}/>}/>
                </Routes>
            </Suspense>
        );
    }
}

export default AppRoutes;