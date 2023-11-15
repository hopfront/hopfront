'use client';

import {useEffect, useState} from "react";
import LinearProgress from "@mui/joy/LinearProgress";
import {useParams, useRouter} from "next/navigation";
import Box from "@mui/joy/Box";
import {Breadcrumbs, Link} from "@mui/joy";
import {KeyboardArrowRight} from "@mui/icons-material";
import Typography from "@mui/joy/Typography";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";
import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";
import {useDashboard} from "@/app/hooks/useDashboard";
import {DashboardApi} from "@/app/lib/api/DashboardApi";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {
    DashboardPanelInputSourceConfigDataVariable
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataVariable";
import {DashboardPanelInput} from "@/app/lib/model/dashboard/DashboardPanelInput";
import {
    DashboardPanelInputSourceConfigDataConstant
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataConstant";
import {DashboardVariableConfig} from "@/app/dashboards/[dashboardId]/components/variable/DashboardVariableConfig";
import {EventType, useSnackbar} from "@/app/hooks/useSnackbar";

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const {usePageView} = useAnalytics();

    const dashboardId = params['dashboardId'] as string;
    const variableName = params['variableName'];

    const {showSnackbar, Snackbar} = useSnackbar();
    const [saving, setSaving] = useState(false);
    const {dashboard, error: dashboardError, isLoading, mutate} = useDashboard(dashboardId);
    const [variable, setVariable] = useState<DashboardVariable>(dashboard?.variables.find(v => v.name === variableName) || {name: variableName} as DashboardVariable);

    usePageView("dashboard-variable-page");

    useEffect(() => {
        const variable = dashboard?.variables.find(v => v.name === variableName);
        setVariable(variable ? variable : {name: variableName} as DashboardVariable)
    }, [dashboard])

    const onSaveVariable = (variable: DashboardVariable) => {
        if (!dashboard) {
            return;
        }

        setSaving(true);

        let updatedDashboard;

        const existingVariable = dashboard.variables.find(v => v.name === variableName);

        if (existingVariable) { // update variable
            updatedDashboard = {
                ...dashboard,
                variables: dashboard.variables.map(v => v.name === existingVariable.name && variable ? variable : v) ?? []
            };
        } else { // create variable
            updatedDashboard = {
                ...dashboard,
                variables: dashboard.variables.concat(variable)
            }
        }

        DashboardApi.updateDashboard(updatedDashboard)
            .then(() => router.push(`/dashboards/${dashboardId}/settings`))
            .then(() => mutate())
            .catch(error => showSnackbar(EventType.Error, `Failed to save variable: ${error.toLocaleString()}`))
            .finally(() => setSaving(false));
    };

    const onDeleteVariable = (variable: DashboardVariable) => {
        if (!dashboard) {
            return;
        }

        setSaving(true);

        const existingVariable = dashboard.variables.find(v => v.name === variableName);

        const updatedDashboard: Dashboard = {
            ...dashboard,
            panels: dashboard.panels.map(panel => {
                return {
                    ...panel,
                    config: {
                        ...panel.config,
                        inputs: panel.config.inputs.map(input => {
                            if (input.sourceConfig.type === "variable") {
                                const variableConfig = input.sourceConfig.data as DashboardPanelInputSourceConfigDataVariable;

                                if (variableConfig.variableName === existingVariable?.name) {
                                    // we re-configure the panel to not use the deleted variable anymore.
                                    return {
                                        ...input,
                                        sourceConfig: {
                                            type: 'constant',
                                            data: {
                                                value: ''
                                            } as DashboardPanelInputSourceConfigDataConstant
                                        }
                                    } as DashboardPanelInput;
                                } else {
                                    return input
                                }
                            } else {
                                return input;
                            }
                        }),
                    }
                }
            }),
            variables: dashboard.variables.flatMap(v => v.name === variable.name ? [] : [v])
        };

        DashboardApi.updateDashboard(updatedDashboard)
            .then(() => router.push(`/dashboards/${dashboardId}/settings`))
            .then(() => mutate())
            .catch(error => showSnackbar(EventType.Error, `Failed to delete variable: ${error.toLocaleString()}`))
            .finally(() => setSaving(false));
    }

    return (
        <>
            {isLoading && <Box><LinearProgress/></Box>}
            {dashboardError && <ErrorAlert error={dashboardError}/>}
            {dashboard &&
                <>
                    <Breadcrumbs separator={<KeyboardArrowRight/>} sx={{p: 0, pb: 1}}>
                        <Link href='/dashboards' color='neutral'>
                            Dashboards
                        </Link>
                        <Link href={`/dashboards/${dashboard.id}`} color='neutral'>
                            {dashboard.title}
                        </Link>
                        <Link href={`/dashboards/${dashboard.id}/settings`} color='neutral'>
                            Settings
                        </Link>
                        <Typography>Variables</Typography>
                        <Typography>{variableName ?? '...'}</Typography>
                    </Breadcrumbs>
                    <Box>
                        <DashboardVariableConfig
                            dashboardTitle={dashboard?.title || '...'}
                            defaultVariable={variable}
                            onSave={onSaveVariable}
                            disabled={saving}
                            onDelete={onDeleteVariable}/>
                    </Box>
                </>}

            {Snackbar}
        </>
    );
}
