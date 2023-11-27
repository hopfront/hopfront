import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { tryGetFromLocalStorage, trySetToLocalStorage } from "./utils";

const BROWSE_FILTER_KEY = 'com.hopfront.browse-filter';
const ONLY_DISPLAY_TECHNICAL_NAMES_KEY = 'com.hopfront.only-display-technical-names';

export class BrowseLocalStorage {

    public static setFilter(filter: ApiSpec | undefined) {
        trySetToLocalStorage(BROWSE_FILTER_KEY, JSON.stringify(filter));
    }

    public static getFilter(): ApiSpec | undefined {
        const value = tryGetFromLocalStorage<string>(BROWSE_FILTER_KEY);

        if (!value || value === 'undefined') {
            return;
        } else {
            return JSON.parse(value) as ApiSpec;
        }
    }

    public static getIsOnlyDisplayTechnicalNames(): boolean {
        const value = tryGetFromLocalStorage<boolean>(ONLY_DISPLAY_TECHNICAL_NAMES_KEY);
        return value ?? false;
    }

    public static setOnlyDisplayTechnicalNames(onlyDisplayTechnicalNames: boolean) {
        trySetToLocalStorage(ONLY_DISPLAY_TECHNICAL_NAMES_KEY, JSON.stringify(onlyDisplayTechnicalNames));
    }
}