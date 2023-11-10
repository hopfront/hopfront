import { ApiSpec } from "@/app/lib/dto/ApiSpec";

const BROWSE_FILTER_KEY = 'com.hopfront.browse-filter';

export class BrowseLocalStorage {

    public static setFilter(filter: ApiSpec | undefined) {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(BROWSE_FILTER_KEY, JSON.stringify(filter));
    }

    public static getFilter(): ApiSpec | undefined {
        if (typeof window === 'undefined') {
            return;
        }

        const value = localStorage.getItem(BROWSE_FILTER_KEY)
        if (!value || value === 'undefined') {
            return;
        } else {
            return JSON.parse(value) as ApiSpec;
        }
    }
}