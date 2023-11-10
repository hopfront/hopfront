import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {
    buildDashboardNewPanelId,
    buildNewVisualizationPanel,
    DashboardPanel
} from "@/app/lib/model/dashboard/DashboardPanel";
import {useState} from "react";
import PanelConfigurationModal from "@/app/dashboards/[dashboardId]/components/PanelConfigurationModal";

export interface PanelCreationModalProps {
    dashboard: Dashboard
    isLoading: boolean
    isOpen: boolean
    onSave: (panel: DashboardPanel) => void
    onClose: () => void
}

export const PanelCreationModal = ({dashboard, isLoading, isOpen, onSave, onClose}: PanelCreationModalProps) => {
    const [panel, setPanel] =
        useState(buildNewVisualizationPanel(buildDashboardNewPanelId(dashboard), 'New panel'));

    return (
        <PanelConfigurationModal
            dashboard={dashboard}
            defaultPanel={panel}
            isLoading={isLoading}
            isOpen={isOpen}
            onSave={savedPanel => {
                setPanel(savedPanel);
                onSave(savedPanel);
            }}
            onClose={onClose}/>
    );
}