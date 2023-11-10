'use client';

import {useParams, useRouter} from "next/navigation";
import {Breadcrumbs, Button, Divider, FormControl, Link, Skeleton} from "@mui/joy";
import React, {useState} from "react";
import {Dashboard, NEW_DASHBOARD_TITLE} from "@/app/lib/model/dashboard/Dashboard";
import Box from "@mui/joy/Box";
import {KeyboardArrowRight} from "@mui/icons-material";
import Typography from "@mui/joy/Typography";
import {
    DashboardSettingsVariablesSection
} from "@/app/dashboards/[dashboardId]/settings/components/DashboardSettingsVariablesSection";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";
import {ManualInput, ManualInputValueType} from "@/app/components/input/ManualInput";
import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";
import {DashboardApi} from "@/app/lib/api/DashboardApi";
import {useDashboard} from "@/app/hooks/useDashboard";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {ConfirmModal, ConfirmModalProps} from "@/app/components/modal/ConfirmModal";

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const {usePageView} = useAnalytics();

    const dashboardId = params['dashboardId'] as string;

    const [error, setError] = useState<any | undefined>();
    const {dashboard, error: dashboardError, isLoading} = useDashboard(dashboardId);
    const [isTitleLoading, setTitleLoading] = useState(false);
    const [confirmModalProps, setConfirmModalProps] = useState<ConfirmModalProps | undefined>();

    usePageView("dashboard-settings-page");

    function redirectToVariablePage(variable: DashboardVariable) {
        router.push(`/dashboards/${dashboardId}/variables/${variable.name}`);
    }

    const onVariableAdded = (variable: DashboardVariable) => {
        if (!dashboard) {
            return;
        }

        redirectToVariablePage(variable);
    };

    const onVariableClick = (variable: DashboardVariable) => {
        redirectToVariablePage(variable);
    };

    const onDeleteDashboardClick = () => {
        setConfirmModalProps({
            title: 'Do you want to delete this dashboard?',
            onConfirm: () => {
                DashboardApi.deleteDashboard(dashboardId)
                    .then(() => {
                        setConfirmModalProps(undefined);
                        router.push(`/dashboards`);
                    });
            },
            onCancel: () => setConfirmModalProps(undefined),
        })
    };

    const onTitleChanged = (title: ManualInputValueType) => {
        if (!dashboard) {
            return;
        }

        const updatedDashboard = {...dashboard, title: title as string};

        saveDashboard(updatedDashboard);
    }

    const saveDashboard = (dashboard: Dashboard) => {
        if (!dashboard) {
            return;
        }

        setTitleLoading(true);
        DashboardApi.updateDashboard(dashboard)
            .then(() => {
                setError(undefined);
                setTitleLoading(false);
            })
            .catch(error => {
                setError(error);
                setTitleLoading(false);
            });
    }

    return (
        <Box>
            <Breadcrumbs separator={<KeyboardArrowRight/>} sx={{p: 0, pb: 1}}>
                <Link href='/dashboards' color='neutral'>
                    Dashboards
                </Link>
                <Link href={`/dashboards/${dashboardId}`} color='neutral'>
                    <Typography><Skeleton
                        loading={isLoading}>{dashboard?.title || NEW_DASHBOARD_TITLE}</Skeleton></Typography>
                </Link>
                <Typography>Settings</Typography>
            </Breadcrumbs>

            {error && <ErrorAlert error={error} onClose={() => setError(undefined)}/>}

            <Typography level='h1' gutterBottom>Settings</Typography>

            <Typography level='h4' gutterBottom sx={{mt: 2}}>Title</Typography>
            <FormControl>
                <ManualInput
                    type="text"
                    defaultValue={dashboard?.title}
                    onChange={onTitleChanged}
                    disabled={isLoading || isTitleLoading}
                    debounceMillis={500}
                    sx={{mb: 1, maxWidth: '350px'}}/>
            </FormControl>

            <DashboardSettingsVariablesSection
                dashboard={dashboard}
                onVariableAdded={onVariableAdded}
                onVariableClick={onVariableClick}/>

            <Divider sx={{mt: 4}}/>
            <Typography level='h4' sx={{mt: 1}} gutterBottom>Danger Zone</Typography>
            <Button disabled={!dashboard} color="danger" onClick={onDeleteDashboardClick}>
                Delete Dashboard
            </Button>

            <ConfirmModal
                title={confirmModalProps?.title}
                onConfirm={confirmModalProps?.onConfirm}
                onCancel={confirmModalProps?.onCancel}/>
        </Box>
    );
}
