import React, {Component, RefObject} from 'react'

type PageState = {} & any;

type PageProps = {
    title: string,
    name?: string,
    type: `text` | `password` | `textarea` | `phone` | `email` | `number` | `date` | `url` | `file`,
    placeHolder?: string,
    className?: string,
    required?: boolean,
    onChange?: React.ChangeEventHandler<any>,
    onBlur?: React.ChangeEventHandler<any>,
    value?: any,
    autoComplete?: "on" | "off" | "new-password"
    maxLength?: number,
    defaultValue?: any
};

const ThemeFormType = React.forwardRef((props: PageProps, ref: any ) => {
    let input: JSX.Element;
    switch (props.type) {
        case `textarea`:
            input = <textarea
                name={props.name}
                className={`field textarea ${typeof props.className !== "undefined" ? props.className : ``}`}
                placeholder=" "
                required={props.required}
                onChange={props.onChange}
                maxLength={props.maxLength}
                ref={ref}
                defaultValue={props.defaultValue}
                value={props.value}
                autoComplete={props.autoComplete}
                onBlur={props.onBlur}
            >{props.value}</textarea>;
            break;
        default:
            input = <input
                name={props.name}
                autoComplete={props.autoComplete}
                className={`field ${typeof props.className !== "undefined" ? props.className : ``}`}
                type={props.type}
                placeholder=" "
                required={props.required}
                onChange={props.onChange}
                onBlur={props.onBlur}
                defaultValue={props.defaultValue}
                maxLength={props.maxLength}
                ref={ref}
                value={props.value}
            />;
            break;
    }
    return (
        <label className="theme-input">
            {input}
            <span className="label">{props.title}</span>
        </label>
    );
});

export default ThemeFormType;
