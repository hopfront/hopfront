import { ConfirmModal, ConfirmModalProps } from "@/app/components/modal/ConfirmModal";
import EditableLabel from "@/app/components/typography/EditableLabel";
import { PanelCreationModal } from "@/app/dashboards/[dashboardId]/components/PanelCreationModal";
import { DashboardVariablesPanel } from "@/app/dashboards/[dashboardId]/components/variable/DashboardVariablesPanel";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { RefreshObserverRegistry } from "@/app/lib/model/RefreshObserverRegistry";
import { Dashboard, NEW_DASHBOARD_TITLE } from "@/app/lib/model/dashboard/Dashboard";
import { DashboardPanel } from "@/app/lib/model/dashboard/DashboardPanel";
import { DashboardVariable } from "@/app/lib/model/dashboard/DashboardVariable";
import { VariableWithValue } from "@/app/lib/model/dashboard/VariableWithValue";
import {
    ArrowDropDown,
    KeyboardArrowRight,
    Refresh,
    Settings
} from "@mui/icons-material";
import { Breadcrumbs, Dropdown, Link, Menu, MenuButton, MenuItem, Skeleton } from "@mui/joy";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { buildNewVariableName } from "../settings/components/DashboardSettingsVariablesSection";
import { DashboardPanelGrid } from "./DashboardPanelGrid";
import PanelConfigurationModal from "./PanelConfigurationModal";
import PanelPlaceholder from "./PanelPlaceholder";
import { AdminContext, shouldShowAdminContent } from "@/app/context/AdminContext";
import { WarningAlert } from "@/app/components/alert/WarningAlert";

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

export const DashboardPage = ({ dashboard, loading, onSave }: DashboardPageProps) => {
    const router = useRouter();
    const adminContext = useContext(AdminContext);
    const showAdminContent = shouldShowAdminContent(adminContext);
    const { registerEvent } = useAnalytics();
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
            name: 'dashboard-settings-clicked',
            props: {
                dashboardId: dashboard?.id || '?'
            }
        });
        dashboard && router.push(`/dashboards/${dashboard.id}/settings`);
    };

    const onRefreshClick = () => {
        registerEvent({
            name: 'dashboard-refresh-clicked',
            props: {
                dashboardId: dashboard?.id || '?'
            }
        });
        refreshObserverRegistry.current.refreshAll();
    };

    const onNewPanelClick = () => {
        registerEvent({
            name: 'dashboard-panel-add-clicked',
            props: {
                dashboardId: dashboard?.id || '?'
            }
        });
        setPanelConfigurationModalOpen({ isOpen: true, panelId: undefined });
    };

    const onPanelEditClick = (panel: DashboardPanel) => {
        registerEvent({
            name: 'dashboard-panel-edit-clicked',
            props: {
                dashboardId: dashboard?.id || '?'
            }
        });
        setPanelConfigurationModalOpen({ isOpen: true, panelId: panel.id });
    };

    const onPanelDeleteClick = async (panel: DashboardPanel) => {
        if (!dashboard) return;

        registerEvent({
            name: 'dashboard-panel-delete-clicked',
            props: {
                dashboardId: dashboard?.id || '?'
            }
        });

        setConfirmModalProps({
            title: `Do you want to delete the panel '${panel.title}'?`,
            onConfirm: () => {
                onSave({ ...dashboard, panels: dashboard.panels.flatMap(p => p.id === panel.id ? [] : [p]) })
                setConfirmModalProps(undefined);

                registerEvent({
                    name: 'dashboard-panel-deleted',
                    props: {
                        dashboardId: dashboard?.id || '?'
                    }
                });
            },
            onCancel: () => setConfirmModalProps(undefined),
        })
    };

    const onSavePanel = (panel: DashboardPanel) => {
        if (!dashboard) return;

        setPanelConfigurationModalOpen({ isOpen: false, panelId: undefined });

        if (dashboard.panels.find(p => p.id === panel.id)) {
            onSave({ ...dashboard, panels: dashboard?.panels.map(p => p.id === panel.id ? panel : p) });
        } else {
            dashboard.panels.push(panel);
            onSave({ ...dashboard });
        }
    }

    const onNewVariableClicked = () => {
        if (!dashboard) return;
        registerEvent({
            name: 'dashboard-variable-add-clicked',
            props: {
                dashboardId: dashboard?.id || '?'
            }
        });
        const variableName = buildNewVariableName(dashboard);
        router.push(`/dashboards/${dashboard.id}/variables/${variableName}`);
    }

    const onSaveTitle = (title: string) => {
        if (!dashboard) return;
        registerEvent({
            name: 'dashboard-title-saved',
            props: {
                dashboardId: dashboard?.id || '?'
            }
        });
        onSave({ ...dashboard, title: title });
    }

    const onPanelTitleChanged = (panel: DashboardPanel) => {
        if (!dashboard) return;
        registerEvent({
            name: 'dashboard-panel-title-saved',
            props: {
                dashboardId: dashboard?.id || '?'
            }
        });
        onSave({ ...dashboard, panels: dashboard.panels.map(p => p.id === panel.id ? panel : p) });
    }

    const onVariableCreated = (variable: DashboardVariable) => {
        onSave({
            ...dashboard,
            variables: (dashboard?.variables || []).concat(variable)
        } as Dashboard);
    };

    return (
        <>
            <Breadcrumbs separator={<KeyboardArrowRight />} sx={{ p: 0, pb: 1 }}>
                <Link href='/dashboards' color='neutral'>
                    Dashboards
                </Link>
                <Typography><Skeleton
                    loading={!dashboard}>{dashboard?.title || NEW_DASHBOARD_TITLE}</Skeleton></Typography>
            </Breadcrumbs>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <EditableLabel onSave={onSaveTitle}>
                    <Typography level='h1'><Skeleton
                        loading={!dashboard}>{dashboard?.title || NEW_DASHBOARD_TITLE}</Skeleton></Typography>
                </EditableLabel>
                <Box display='flex'>
                    {showAdminContent && <Dropdown>
                        <MenuButton
                            variant="soft"
                            color="primary"
                            disabled={!dashboard}
                            endDecorator={<ArrowDropDown />}
                            sx={{ mr: 1 }}>
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
                    </Dropdown>}
                    <IconButton
                        disabled={!dashboard}
                        title="Refresh dashboard"
                        variant='plain'
                        color="neutral"
                        onClick={onRefreshClick}
                        aria-label="Refresh dashboard">
                        <Refresh />
                    </IconButton>
                    {showAdminContent && <IconButton
                        disabled={!dashboard}
                        title="Settings"
                        variant='plain'
                        color="neutral"
                        onClick={onSettingsClick}
                        aria-label="Go to settings">
                        <Settings />
                    </IconButton>}
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
                sx={{ mb: 2, mt: 1 }} />

            <DashboardPanelGrid
                dashboard={dashboard}
                variables={variables}
                refreshObserverRegistry={refreshObserverRegistry.current}
                onPanelEditClick={onPanelEditClick}
                onPanelDeleteClick={onPanelDeleteClick}
                onPanelTitleChanged={onPanelTitleChanged} />

            {((dashboard?.panels || []).length === 0 && dashboard) &&
                <>
                    {showAdminContent ?
                        <PanelPlaceholder onClick={() => {
                            registerEvent({
                                name: 'dashboard-panel-placeholder-clicked',
                                props: {
                                    dashboardId: dashboard?.id || '?'
                                }
                            });
                            setPanelConfigurationModalOpen({ isOpen: true, panelId: undefined });
                        }} /> :
                        <WarningAlert title={'You are not an administrator.'}>
                            <Typography>Log in as an administrator or contact your administrator to configure this dashboard.</Typography>
                        </WarningAlert>}
                </>
            }

            {(dashboard && panelConfigurationModalOpen.panelId) && <PanelConfigurationModal
                dashboard={dashboard}
                defaultPanel={dashboard.panels.find(p => p.id === panelConfigurationModalOpen.panelId)!}
                isLoading={loading}
                isOpen={panelConfigurationModalOpen.isOpen}
                onSave={onSavePanel}
                onClose={() => setPanelConfigurationModalOpen({ isOpen: false, panelId: undefined })}
                onVariableCreated={onVariableCreated}
            />}

            {(dashboard && !panelConfigurationModalOpen.panelId) && <PanelCreationModal
                dashboard={dashboard}
                isLoading={loading}
                isOpen={panelConfigurationModalOpen.isOpen}
                onSave={onSavePanel}
                onClose={() => setPanelConfigurationModalOpen({ isOpen: false, panelId: undefined })}
                onVariableCreated={onVariableCreated}
            />}


            <ConfirmModal
                title={confirmModalProps?.title}
                onConfirm={confirmModalProps?.onConfirm}
                onCancel={confirmModalProps?.onCancel} />
        </>
    );
}