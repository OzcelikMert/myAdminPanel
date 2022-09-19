import {ThemeGroupTypeDocument} from "../types/constants/themeGroupTypes";

enum ThemeGroupTypeId {
    Text = 1,
    TextArea,
    Image
}

const ThemeGroupTypes: Array<ThemeGroupTypeDocument> = [
    {id: ThemeGroupTypeId.Text, langKey: "text"},
    {id: ThemeGroupTypeId.TextArea, langKey: "textArea"},
    {id: ThemeGroupTypeId.Image, langKey: "image"},
]

export {ThemeGroupTypes, ThemeGroupTypeId}