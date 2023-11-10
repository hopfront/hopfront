import {DashboardPanel} from "@/app/lib/model/dashboard/DashboardPanel";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";

export interface Dashboard {
    id: string
    title: string
    variables: DashboardVariable[]
    panels: DashboardPanel[]
}


export const NEW_DASHBOARD_ID = 'new-dashboard';

export const NEW_DASHBOARD_TITLE = 'New Dashboard';

export const buildNewDashboard = (): Dashboard => {
  return {
      id: NEW_DASHBOARD_ID,
      title: NEW_DASHBOARD_TITLE,
      variables: [],
      panels: [],
  }
}