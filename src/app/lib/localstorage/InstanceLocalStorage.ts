import { tryGetFromLocalStorage, trySetToLocalStorage } from "./utils"

const SHOULD_SHOW_ALERT_ON_TOKEN_EXPIRED_KEY = 'com.hopfront.should-show-alert-on-token-expired'

export class InstanceLocalStorage {
    public static setShouldShowAlertOnTokenExpired(shouldShow: boolean) {
        trySetToLocalStorage(SHOULD_SHOW_ALERT_ON_TOKEN_EXPIRED_KEY, JSON.stringify(shouldShow))
    }

    public static getShouldShowAlertOnTokenExpired(): boolean {
        const shouldShow = tryGetFromLocalStorage<boolean>(SHOULD_SHOW_ALERT_ON_TOKEN_EXPIRED_KEY)
        return shouldShow ?? false;
    }
}