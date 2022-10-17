import {ThemeGroupTypeDocument} from "../types/constants";

enum ComponentInputTypeId {
    Text = 1,
    TextArea,
    Image,
    Button,
    Icon
}

const ComponentInputTypes: Array<ThemeGroupTypeDocument> = [
    {id: ComponentInputTypeId.Text, langKey: "text"},
    {id: ComponentInputTypeId.TextArea, langKey: "textArea"},
    {id: ComponentInputTypeId.Image, langKey: "image"},
    {id: ComponentInputTypeId.Button, langKey: "button"},
    {id: ComponentInputTypeId.Icon, langKey: "icon"},
]

export {ComponentInputTypes, ComponentInputTypeId}