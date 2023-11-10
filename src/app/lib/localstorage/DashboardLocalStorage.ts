const getVariablePlaceholderKey = (dashboardId: string) => {
    return `com.hopfront.variable-placeholder:${dashboardId}`;
}

const getVariableAlertInfoKey = (dashboardId: string) => {
    return `com.hopfront.variable-alert-info:${dashboardId}`;
}

export class DashboardLocalStorage {

    public static setVariablePlaceholderVisible(dashboardId: string, visible: boolean) {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(getVariablePlaceholderKey(dashboardId), JSON.stringify(visible));
    }

    public static getVariablePlaceholderVisible(dashboardId: string): boolean {
        if (typeof window === 'undefined') {
            return false;
        }

        return (localStorage.getItem(getVariablePlaceholderKey(dashboardId)) ?? 'true') === 'true';
    }

    public static setVariableAlertInfoVisible(dashboardId: string, visible: boolean) {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(getVariableAlertInfoKey(dashboardId), JSON.stringify(visible));
    }

    public static getVariableAlertInfoVisible(dashboardId: string): boolean {
        if (typeof window === 'undefined') {
            return false;
        }

        return (localStorage.getItem(getVariableAlertInfoKey(dashboardId)) ?? 'true') === 'true';
    }
}