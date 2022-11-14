import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import {LanguageId, Status, StatusId} from "../../../../constants";
import staticContentUtil from "../../../../utils/staticContent.util";
import classNameUtil from "../../../../utils/className.util";
import {PagePropCommonDocument} from "../../../../types/app/pageProps";
import permissionUtil from "../../../../utils/permission.util";

type PageState = {};

type PageProps = {
    status: StatusId[],
    langId: LanguageId,
    onChange: (event: React.MouseEvent<HTMLElement, MouseEvent>, statusId: number) => void
} & PagePropCommonDocument;

class ThemeTableToggleMenu extends Component<PageProps, PageState> {
    render() {
        return (
            <Dropdown align={"end"}>
                <Dropdown.Toggle className="table-toggle-menu">
                    <i className="mdi mdi-menu"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="bg-gradient-light table-dropdown-menu">
                    {
                        Status.findMulti("id", this.props.status).map((item, index) => {
                                if (item.id === StatusId.Deleted) {
                                    if(!permissionUtil.checkPermission(
                                        this.props.getSessionData.roleId,
                                        this.props.getSessionData.permissions,
                                        permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Delete")
                                    )) return null;
                                }else {
                                    if(!permissionUtil.checkPermission(
                                        this.props.getSessionData.roleId,
                                        this.props.getSessionData.permissions,
                                        permissionUtil.getPermissionIdForPostType(this.props.getPageData.searchParams.postTypeId, "Edit")
                                    )) return null;
                                }

                                return (
                                    <Dropdown.Item onClick={(event) => this.props.onChange(event, item.id)} key={index}>
                                        <button
                                            className={`btn btn-gradient-${classNameUtil.getStatusClassName(item.id)} w-100`}>{this.props.router.t(item.langKey)}</button>
                                    </Dropdown.Item>
                                )
                            }
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

export default ThemeTableToggleMenu;