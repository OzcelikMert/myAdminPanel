import React, {Component} from 'react'

type PageState = {};

type PageProps = {
    legend?: string
};

class ThemeFieldSet extends Component<PageProps, PageState> {
    render () {
        return (
            <div className="input static">
                <span className="label">{this.props.legend}</span>
                <div className="field row d-flex">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default ThemeFieldSet;
