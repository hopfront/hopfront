import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {DashboardVariableConfig} from "@/app/dashboards/[dashboardId]/components/variable/DashboardVariableConfig";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";

export interface CreateDashboardVariableModalProps {
    open: boolean
    onClose: () => void
    onSave: (variable: DashboardVariable) => void
    dashboardTitle: string
    inputName: string
}

export const CreateDashboardVariableModal = ({open, onClose, onSave, dashboardTitle, inputName}: CreateDashboardVariableModalProps) => {
    return (
        <ResponsiveModal open={open} onClose={onClose}>
            <DashboardVariableConfig
                dashboardTitle={dashboardTitle}
                defaultVariable={{name: inputName} as DashboardVariable}
                onSave={variable => onSave(variable)}
                disabled={false}/>
        </ResponsiveModal>
    );
}