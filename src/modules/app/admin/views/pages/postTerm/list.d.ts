import {PostTermContentDocument, PostTermDocument} from "../../../../../ajax/result/data";

type onSelect = () => void;
type onEdit = () => void;

type ListItemPropsDocument = {
    onSelect: onSelect,
    onEdit: onEdit,
    isChecked: boolean
} & PostTermDocument & PostTermContentDocument