import {StatusId} from "constants/index";
import LanguageKeys from "../app/languages";

interface StatusDocument {
    id: StatusId,
    order: number,
    langKey: LanguageKeys
}

export {
    StatusDocument
}
