import V from "library/variable";
import {emptyImage} from "components/chooseImage";
import pathUtil from "./path.util";

export default {
    getUploadedImageSrc(imageName?: string): any {
        return imageName && !V.isEmpty(imageName)
            ? (imageName.isUrl())
                ? imageName
                : pathUtil.uploads.images + imageName
            : emptyImage
    },
}