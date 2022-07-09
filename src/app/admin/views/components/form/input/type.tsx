import React, {Component, RefObject} from 'react'

type PageState = {} & any;

type PageProps = {
    title: string,
} & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const ThemeFormType = React.forwardRef((props: PageProps, ref: any ) => {
    let input: JSX.Element;
    switch (props.type) {
        case `textarea`:
            input = <textarea
                {...props}
                className={`field textarea ${typeof props.className !== "undefined" ? props.className : ``}`}
            >{props.value}</textarea>;
            break;
        default:
            input = <input
                {...props}
                className={`field ${typeof props.className !== "undefined" ? props.className : ``}`}
                placeholder=" "
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
