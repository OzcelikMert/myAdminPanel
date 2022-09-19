import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import {LanguageId, Status, StatusId} from "../../../../constants";
import staticContentUtil from "../../../../utils/functions/staticContent.util";
import classNameUtil from "../../../../utils/functions/className.util";
import {PagePropCommonDocument} from "../../../../types/app/pageProps";

type PageState = {};

type PageProps = {
    t: PagePropCommonDocument["router"]["t"]
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
                        Status.findMulti("id", this.props.status).map((item, index) =>
                            <Dropdown.Item onClick={(event) => this.props.onChange(event, item.id)} key={index}>
                                <button className={`btn btn-gradient-${classNameUtil.getStatusClassName(item.id)} w-100`}>{this.props.t(item.langKey)}</button>
                            </Dropdown.Item>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

export default ThemeTableToggleMenu;