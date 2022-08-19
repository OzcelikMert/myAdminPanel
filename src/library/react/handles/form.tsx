import React, {Component, ComponentState} from "react";

class HandleForm {
    static onChangeInput(event: React.ChangeEvent<any>, component: Component) {
        component.setState((state: any) => {
            let value: any = null;
            if(event.target.type === "checkbox") {
                value = event.target.checked ? 1 : 0;
            }else{
                value = event.target.value;
            }
            state.formData[event.target.name] = value;
            return state;
        })
    }

    static onChangeSelect(key: any, value: any, component: Component) {
        component.setState((state: any) => {
            if(Array.isArray(value)){
                state.formData[key] = [];
                value.forEach(item => {
                    let data = (typeof item.value !== "undefined") ? item.value : item;
                    state.formData[key].push(data);
                })
            }else {
                state.formData[key] = value;
            }
            return state;
        });
    }
}

export default HandleForm;