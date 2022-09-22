import {ThemeGroupTypeDocument} from "../types/constants";

enum ThemeGroupTypeId {
    Text = 1,
    TextArea,
    Image,
    Button,
    Icon
}

const ThemeGroupTypes: Array<ThemeGroupTypeDocument> = [
    {id: ThemeGroupTypeId.Text, langKey: "text"},
    {id: ThemeGroupTypeId.TextArea, langKey: "textArea"},
    {id: ThemeGroupTypeId.Image, langKey: "image"},
    {id: ThemeGroupTypeId.Button, langKey: "button"},
    {id: ThemeGroupTypeId.Icon, langKey: "icon"},
]

export {ThemeGroupTypes, ThemeGroupTypeId}