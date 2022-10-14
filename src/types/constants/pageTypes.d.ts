import {PageTypeId} from "../../constants";
import LanguageKeys from "../app/languages";

interface PageTypeDocument {
    id: PageTypeId,
    order: number,
    langKey: LanguageKeys
}

export {
    PageTypeDocument
}
