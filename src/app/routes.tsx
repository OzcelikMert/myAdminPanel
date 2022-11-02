import React, {Component, Suspense} from 'react';
import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Spinner from './views/tools/spinner';
import {PagePropCommonDocument} from "../types/app/pageProps";

import PageLogin from "./views/pages/login";
import PageLock from "./views/pages/lock";
import PageSettingsProfile from "./views/pages/settings/profile";
import PageChangePassword from "./views/pages/settings/changePassword";
import PageDashboard from "./views/pages/dashboard";
import PageGalleryList from "./views/pages/gallery/list";
import PageGalleryUpload from "./views/pages/gallery/upload";
import PagePostList from "./views/pages/post/list";
import PagePostAdd from "./views/pages/post/add";
import PagePostTermAdd from "./views/pages/post/term/add";
import PagePostTermList from "./views/pages/post/term/list";
import PageUserAdd from "./views/pages/settings/user/add";
import PageUserList from "./views/pages/settings/user/list";
import PageSettingsSEO from "./views/pages/settings/seo";
import PageSettingsGeneral from "./views/pages/settings/general";
import PageSubscribers from "./views/pages/settings/subscribers";
import PageComponentAdd from "./views/pages/component/add";
import PageComponentList from "./views/pages/component/list";
import PageSettingsContactForms from "./views/pages/settings/contactForms";
import PageSettingsStaticLanguages from "./views/pages/settings/staticLanguages";

export const pageRoutes = {
    login: {
        path() {
            return "/login"
        }
    },
    lock: {
        path() {
            return "/lock"
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
    component: {
        path() {
            return `component/`
        },
        add: {
            path() {
                return "add"
            }
        },
        edit: {
            path(componentId: string | number = ":componentId") {
                return `edit/${componentId}`
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
        profile: {
            path() {
                return "profile"
            }
        },
        changePassword: {
            path() {
                return "changePassword"
            }
        },
        subscribers: {
            path() {
                return "subscribers"
            }
        },
        contactForms: {
            path() {
                return "contactForms"
            }
        },
        staticLanguages: {
            path() {
                return "staticLanguages"
            }
        },
    }
}

type PageState = {} & any;

type PageProps = {
    isPageLoading: boolean
} & PagePropCommonDocument;

class AppRoutes extends Component<PageProps, PageState> {
    render() {
        return this.props.isPageLoading ? <Spinner/> : (
            <Suspense fallback={<Spinner/>}>
                <Routes>
                    <Route path={pageRoutes.login.path()} element={<PageLogin {...this.props}/>}/>

                    <Route path={pageRoutes.lock.path()} element={<PageLock {...this.props}/>}/>

                    <Route path={pageRoutes.dashboard.path()} element={<PageDashboard {...this.props}/>}/>

                    <Route path={pageRoutes.gallery.path()}>
                        <Route path={pageRoutes.gallery.upload.path()}
                               element={<PageGalleryUpload {...this.props}/>}/>
                        <Route path={pageRoutes.gallery.list.path()}
                               element={<PageGalleryList {...this.props}/>}/>
                    </Route>

                    {
                        [pageRoutes.post.path(), pageRoutes.themeContent.path() + pageRoutes.post.path()].map((path, index) =>
                            <Route path={path} key={index}>
                                <Route path={pageRoutes.post.add.path()}
                                       element={<PagePostAdd {...this.props}/>}/>
                                <Route path={pageRoutes.post.edit.path()}
                                       element={<PagePostAdd {...this.props}/>}/>
                                <Route path={pageRoutes.post.list.path()}
                                       element={<PagePostList {...this.props}/>}/>
                            </Route>
                        )
                    }

                    {
                        [pageRoutes.postTerm.path(), pageRoutes.themeContent.path() + pageRoutes.postTerm.path()].map((path, index) =>
                            <Route path={path} key={index}>
                                <Route path={pageRoutes.postTerm.add.path()}
                                       element={<PagePostTermAdd {...this.props}/>}/>
                                <Route path={pageRoutes.postTerm.edit.path()}
                                       element={<PagePostTermAdd {...this.props}/>}/>
                                <Route path={pageRoutes.postTerm.list.path()}
                                       element={<PagePostTermList {...this.props}/>}/>
                            </Route>
                        )
                    }

                    <Route path={pageRoutes.component.path()}>
                        <Route path={pageRoutes.component.add.path()}
                               element={<PageComponentAdd {...this.props}/>}/>
                        <Route path={pageRoutes.component.edit.path()}
                               element={<PageComponentAdd {...this.props}/>}/>
                        <Route path={pageRoutes.component.list.path()}
                               element={<PageComponentList {...this.props}/>}/>
                    </Route>

                    <Route path={pageRoutes.settings.path()}>
                        <Route path={pageRoutes.settings.user.path()}>
                            <Route path={pageRoutes.settings.user.add.path()}
                                   element={<PageUserAdd {...this.props}/>}/>
                            <Route path={pageRoutes.settings.user.edit.path()}
                                   element={<PageUserAdd {...this.props}/>}/>
                            <Route path={pageRoutes.settings.user.list.path()}
                                   element={<PageUserList {...this.props}/>}/>
                        </Route>
                        <Route path={pageRoutes.settings.seo.path()}
                               element={<PageSettingsSEO {...this.props}/>}/>
                        <Route path={pageRoutes.settings.general.path()}
                               element={<PageSettingsGeneral {...this.props}/>}/>
                        <Route path={pageRoutes.settings.profile.path()}
                               element={<PageSettingsProfile {...this.props}/>}/>
                        <Route path={pageRoutes.settings.changePassword.path()}
                               element={<PageChangePassword {...this.props}/>}/>
                        <Route path={pageRoutes.settings.subscribers.path()}
                               element={<PageSubscribers {...this.props}/>}/>
                        <Route path={pageRoutes.settings.contactForms.path()}
                               element={<PageSettingsContactForms {...this.props}/>}/>
                        <Route path={pageRoutes.settings.staticLanguages.path()}
                               element={<PageSettingsStaticLanguages {...this.props}/>}/>
                    </Route>

                    <Route path="*" element={<Navigate to={pageRoutes.dashboard.path()}/>}/>
                </Routes>
            </Suspense>
        );
    }
}

export default AppRoutes;