import {RefreshObserverRegistry} from "@/app/lib/model/RefreshObserverRegistry";
import {Dashboard, NEW_DASHBOARD_TITLE} from "@/app/lib/model/dashboard/Dashboard";
import {DashboardPanel} from "@/app/lib/model/dashboard/DashboardPanel";
import {VariableWithValue} from "@/app/lib/model/dashboard/VariableWithValue";
import {DashboardVariablesPanel} from "@/app/dashboards/[dashboardId]/components/variable/DashboardVariablesPanel";
import {
    ArrowDropDown,
    KeyboardArrowRight,
    Refresh,
    Settings
} from "@mui/icons-material";
import {Breadcrumbs, Dropdown, Link, Menu, MenuButton, MenuItem, Skeleton} from "@mui/joy";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {DashboardPanelGrid} from "./DashboardPanelGrid";
import PanelPlaceholder from "./PanelPlaceholder";
import PanelConfigurationModal from "./PanelConfigurationModal";
import UpdatableLabel from "@/app/components/typography/UpdatableLabel";
import {buildNewVariableName} from "../settings/components/DashboardSettingsVariablesSection";
import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";
import {DashboardApi} from "@/app/lib/api/DashboardApi";
import {ConfirmModal, ConfirmModalProps} from "@/app/components/modal/ConfirmModal";
import {PanelCreationModal} from "@/app/dashboards/[dashboardId]/components/PanelCreationModal";

export interface DashboardPageProps {
    dashboard?: Dashboard;
    loading: boolean
    onSave: (dashboard: Dashboard) => void,
}

export interface PanelConfigurationData {
    isOpen: boolean
    panelId: string | undefined
}

const buildVariables = (dashboard: Dashboard | undefined) => {
    return (dashboard?.variables || [])
        .map(v => {
            return {
                variable: v,
                value: undefined,
            } as VariableWithValue;
        });
}

export const DashboardPage = ({dashboard, loading, onSave}: DashboardPageProps) => {
    const router = useRouter();
    const {registerEvent} = useAnalytics();
    const [variables, setVariables] = useState<VariableWithValue[]>([]);
    const [panelConfigurationModalOpen, setPanelConfigurationModalOpen] = useState<PanelConfigurationData>({
        isOpen: false,
        panelId: undefined
    });
    const [confirmModalProps, setConfirmModalProps] = useState<ConfirmModalProps | undefined>();

    const refreshObserverRegistry = useRef<RefreshObserverRegistry>(new RefreshObserverRegistry([]));

    useEffect(() => {
        setVariables(buildVariables(dashboard));
    }, [dashboard, dashboard?.variables]);

    const onSettingsClick = () => {
        registerEvent({
            category: 'dashboard',
            action: 'dashboard-settings-clicked',
            name: dashboard?.id
        });
        dashboard && router.push(`/dashboards/${dashboard.id}/settings`);
    };

    const onRefreshClick = () => {
        registerEvent({
            category: 'dashboard',
            action: 'dashboard-refresh-clicked',
            name: dashboard?.id
        });
        refreshObserverRegistry.current.refreshAll();
    };

    const onNewPanelClick = () => {
        registerEvent({
            category: 'dashboard',
            action: 'dashboard-panel-add-clicked',
            name: dashboard?.id
        });
        setPanelConfigurationModalOpen({isOpen: true, panelId: undefined});
    };

    const onPanelEditClick = (panel: DashboardPanel) => {
        registerEvent({
            category: 'dashboard-panel',
            action: 'dashboard-panel-edit-clicked',
            name: panel.id
        });
        setPanelConfigurationModalOpen({isOpen: true, panelId: panel.id});
    };

    const onPanelDeleteClick = async (panel: DashboardPanel) => {
        if (!dashboard) return;

        registerEvent({
            category: 'dashboard-panel',
            action: 'dashboard-panel-delete-clicked',
            name: panel.id,
        });

        setConfirmModalProps({
            title: `Do you want to delete the panel '${panel.title}'?`,
            onConfirm: () => {
                onSave({...dashboard, panels: dashboard.panels.flatMap(p => p.id === panel.id ? [] : [p])})
                setConfirmModalProps(undefined);

                registerEvent({
                    category: 'dashboard-panel',
                    action: 'dashboard-panel-deleted',
                    name: panel.id
                });
            },
            onCancel: () => setConfirmModalProps(undefined),
        })
    };

    const onSavePanel = (panel: DashboardPanel) => {
        if (!dashboard) return;

        setPanelConfigurationModalOpen({isOpen: false, panelId: undefined});

        if (dashboard.panels.find(p => p.id === panel.id)) {
            onSave({...dashboard, panels: dashboard?.panels.map(p => p.id === panel.id ? panel : p)});
        } else {
            dashboard.panels.push(panel);
            onSave({...dashboard});
        }
    }

    const onNewVariableClicked = () => {
        if (!dashboard) return;
        registerEvent({
            category: 'dashboard',
            action: 'dashboard-variable-add-clicked',
            name: dashboard.id
        });
        const variableName = buildNewVariableName(dashboard);
        router.push(`/dashboards/${dashboard.id}/variables/${variableName}`);
    }

    const onSaveTitle = (title: string) => {
        if (!dashboard) return;
        registerEvent({
            category: 'dashboard',
            action: 'dashboard-title-saved',
        });
        onSave({...dashboard, title: title});
    }

    return (
        <>
            <Breadcrumbs separator={<KeyboardArrowRight/>} sx={{p: 0, pb: 1}}>
                <Link href='/dashboards' color='neutral'>
                    Dashboards
                </Link>
                <Typography><Skeleton
                    loading={!dashboard}>{dashboard?.title || NEW_DASHBOARD_TITLE}</Skeleton></Typography>
            </Breadcrumbs>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between'}}>
                <UpdatableLabel onSave={onSaveTitle}>
                    <Typography level='h1'><Skeleton
                        loading={!dashboard}>{dashboard?.title || NEW_DASHBOARD_TITLE}</Skeleton></Typography>
                </UpdatableLabel>
                <Box display='flex'>
                    <Dropdown>
                        <MenuButton
                            variant="soft"
                            color="primary"
                            disabled={!dashboard}
                            endDecorator={<ArrowDropDown/>}
                            sx={{mr: 1}}>
                            Add
                        </MenuButton>
                        <Menu>
                            <MenuItem onClick={onNewPanelClick}>
                                Panel
                            </MenuItem>
                            <MenuItem onClick={onNewVariableClicked}>
                                Variable
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                    <IconButton
                        disabled={!dashboard}
                        title="Refresh dashboard"
                        variant='plain'
                        color="neutral"
                        onClick={onRefreshClick}
                        aria-label="Refresh dashboard">
                        <Refresh/>
                    </IconButton>
                    <IconButton
                        disabled={!dashboard}
                        title="Settings"
                        variant='plain'
                        color="neutral"
                        onClick={onSettingsClick}
                        aria-label="Go to settings">
                        <Settings/>
                    </IconButton>
                </Box>
            </Box>

            <DashboardVariablesPanel
                dashboardId={dashboard?.id}
                variables={variables}
                onValueChange={updatedVariable => {
                    const updatedVariables = variables.map(variable => {
                        return variable.variable.name === updatedVariable.variable.name
                            ? updatedVariable
                            : variable;
                    });
                    setVariables(updatedVariables)
                }}
                sx={{mb: 2, mt: 1}}/>

            <DashboardPanelGrid
                dashboard={dashboard}
                variables={variables}
                refreshObserverRegistry={refreshObserverRegistry.current}
                onPanelEditClick={onPanelEditClick}
                onPanelDeleteClick={onPanelDeleteClick}/>

            {((dashboard?.panels || []).length === 0 && dashboard) &&
                <PanelPlaceholder onClick={() => {
                    registerEvent({
                        category: 'dashboard',
                        action: 'dashboard-panel-placeholder-clicked',
                        name: dashboard?.id
                    });
                    setPanelConfigurationModalOpen({isOpen: true, panelId: undefined});
                }}/>}

            {(dashboard && panelConfigurationModalOpen.panelId) && <PanelConfigurationModal
                dashboard={dashboard}
                defaultPanel={dashboard.panels.find(p => p.id === panelConfigurationModalOpen.panelId)!}
                isLoading={loading}
                isOpen={panelConfigurationModalOpen.isOpen}
                onSave={onSavePanel}
                onClose={() => setPanelConfigurationModalOpen({isOpen: false, panelId: undefined})}
            />}

            {(dashboard && !panelConfigurationModalOpen.panelId) && <PanelCreationModal
                dashboard={dashboard}
                isLoading={loading}
                isOpen={panelConfigurationModalOpen.isOpen}
                onSave={onSavePanel}
                onClose={() => setPanelConfigurationModalOpen({isOpen: false, panelId: undefined})}
            />}


            <ConfirmModal
                title={confirmModalProps?.title}
                onConfirm={confirmModalProps?.onConfirm}
                onCancel={confirmModalProps?.onCancel}/>
        </>
    );
}