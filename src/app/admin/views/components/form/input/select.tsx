import React, {Component} from 'react'
import Select from "react-select";
import {StateManagerProps} from "react-select/dist/declarations/src/useStateManager";

type PageState = {} & any;

type PageProps = {
    title?: string
} & StateManagerProps;



class ThemeFormSelect extends Component<PageProps, PageState> {
    render () {
        return (
            <label className="theme-input static">
                <span className="label">{this.props.title}</span>
                <div className="field">
                    <Select
                        name={this.props.name}
                        closeMenuOnSelect={this.props.closeMenuOnSelect}
                        defaultValue={this.props.defaultValue}
                        value={this.props.value}
                        onChange={this.props.onChange}
                        options={this.props.options}
                        placeholder={this.props.placeholder}
                        isMulti={this.props.isMulti}
                    />
                </div>
            </label>
        )
    }
}

export default ThemeFormSelect;
