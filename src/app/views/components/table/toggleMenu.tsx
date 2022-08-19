import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import {LanguageId, Status, StatusContents, StatusId} from "../../../../public/static";
import staticContentUtil from "../../../../utils/functions/staticContent.util";
import classNameUtil from "../../../../utils/functions/className.util";

type PageState = {};

type PageProps = {
    status: StatusId[],
    langId: LanguageId,
    onChange: (event:   React.MouseEvent<HTMLElement, MouseEvent>, statusId: number) => void
};

class ThemeTableToggleMenu extends Component<PageProps, PageState> {
    render () {
        return (
            <Dropdown align={"end"}>
                <Dropdown.Toggle className="table-toggle-menu">
                    <i className="mdi mdi-menu"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="bg-gradient-light table-dropdown-menu">
                    {
                        this.props.status.map((item, index) =>
                            <Dropdown.Item onClick={(event) => this.props.onChange(event, item)} key={index}>
                                <button className={`btn btn-gradient-${classNameUtil.getStatusClassName(item)} w-100`}>
                                    {
                                        staticContentUtil.getStaticContent(StatusContents, "statusId", item)
                                    }
                                </button>
                            </Dropdown.Item>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

export default ThemeTableToggleMenu;