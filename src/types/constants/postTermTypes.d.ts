import {PostTermTypeId} from "../../constants";
import LanguageKeys from "../app/languages";

interface PostTermTypeDocument {
    id: PostTermTypeId,
    order: number,
    langKey: LanguageKeys
}

export {
    PostTermTypeDocument
}
