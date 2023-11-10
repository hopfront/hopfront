import {
    DashboardPanelInputSourceConfigDataConstant
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataConstant";
import {
    DashboardPanelInputSourceConfigDataVariable
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataVariable";
import {DashboardPanelInputSourceConfigType} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigType";

export interface DashboardPanelInputSourceConfig {
    type: DashboardPanelInputSourceConfigType
    data: DashboardPanelInputSourceConfigDataConstant | DashboardPanelInputSourceConfigDataVariable
}