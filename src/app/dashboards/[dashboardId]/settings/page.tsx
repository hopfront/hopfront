'use client';

import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs, Button, Divider, FormControl, Link, Skeleton } from "@mui/joy";
import React, { useContext, useState } from "react";
import { Dashboard, NEW_DASHBOARD_TITLE } from "@/app/lib/model/dashboard/Dashboard";
import Box from "@mui/joy/Box";
import { KeyboardArrowRight } from "@mui/icons-material";
import Typography from "@mui/joy/Typography";
import {
    DashboardSettingsVariablesSection
} from "@/app/dashboards/[dashboardId]/settings/components/DashboardSettingsVariablesSection";
import { DashboardVariable } from "@/app/lib/model/dashboard/DashboardVariable";
import { ManualInput, ManualInputValueType } from "@/app/components/input/ManualInput";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { DashboardApi } from "@/app/lib/api/DashboardApi";
import { useDashboard } from "@/app/hooks/useDashboard";
import { ConfirmModal, ConfirmModalProps } from "@/app/components/modal/ConfirmModal";
import { EventType, useSnackbar } from "@/app/hooks/useSnackbar";
import { AdminContext, shouldShowAdminContent } from "@/app/context/AdminContext";
import { ErrorAlert } from "@/app/components/operation/response/ErrorAlert";
import { CenteredThreeDotsLoader } from "@/app/components/misc/CenteredThreeDotsLoader";

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const adminContext = useContext(AdminContext);
    const { usePageView } = useAnalytics();

    const dashboardId = params['dashboardId'] as string;

    const { dashboard, error: dashboardError, isLoading, mutate } = useDashboard(dashboardId);
    const [isTitleLoading, setTitleLoading] = useState(false);
    const { showSnackbar, Snackbar } = useSnackbar();
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

    const onVariableDeleted = (variable: DashboardVariable) => {
        if (!dashboard) {
            return;
        }

        DashboardApi.updateDashboard({
            ...dashboard,
            variables: (dashboard?.variables || []).flatMap(v => v.name === variable.name ? [] : [v]),
        })
            .then(() => mutate())
            .then(() => showSnackbar(EventType.Success, 'Variable deleted successfully'))
            .catch(error => showSnackbar(EventType.Error, `Failed to delete variable: ${error.toLocaleString()}`));
    }

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

        setTitleLoading(true);
        DashboardApi.updateDashboard({ ...dashboard, title: title } as Dashboard)
            .then(() => {
                showSnackbar(EventType.Success, `Dashboard title updated successfully`);
            })
            .catch(error => {
                showSnackbar(EventType.Error, `Failed to update dashboard title: ${error.toLocaleString()}`);
            })
            .finally(() => setTitleLoading(false));
    }

    if (adminContext.isLoading) {
        return <CenteredThreeDotsLoader />
    }

    if (!shouldShowAdminContent(adminContext)) {
        router.replace('/403');
        return <CenteredThreeDotsLoader />
    }

    if (dashboardError) {
        return (
            <ErrorAlert
                error={dashboardError}
                onClose={() => router.push('/dashboards')}
            />
        )
    }

    return (
        <>
            <Breadcrumbs separator={<KeyboardArrowRight />} sx={{ p: 0, pb: 1 }}>
                <Link href='/dashboards' color='neutral'>
                    Dashboards
                </Link>
                <Link href={`/dashboards/${dashboardId}`} color='neutral'>
                    <Typography><Skeleton
                        loading={isLoading}>{dashboard?.title || NEW_DASHBOARD_TITLE}</Skeleton></Typography>
                </Link>
                <Typography>Settings</Typography>
            </Breadcrumbs>

            <Typography level='h1' gutterBottom>Settings</Typography>

            <Typography level='h4' gutterBottom sx={{ mt: 2 }}>Title</Typography>
            <FormControl>
                <ManualInput
                    type="text"
                    defaultValue={dashboard?.title}
                    onChange={onTitleChanged}
                    disabled={isLoading || isTitleLoading}
                    sx={{ mb: 1, maxWidth: '350px' }} />
            </FormControl>

            <DashboardSettingsVariablesSection
                dashboard={dashboard}
                onVariableAdded={onVariableAdded}
                onVariableDeleted={onVariableDeleted}
                onVariableClick={onVariableClick} />

            <Divider sx={{ mt: 4 }} />
            <Typography level='h4' sx={{ mt: 1 }} gutterBottom>Danger Zone</Typography>
            <Button
                disabled={!dashboard}
                variant="outlined"
                color="danger"
                onClick={onDeleteDashboardClick}>
                Delete Dashboard
            </Button>

            <ConfirmModal
                title={confirmModalProps?.title}
                onConfirm={confirmModalProps?.onConfirm}
                onCancel={confirmModalProps?.onCancel} />

            {Snackbar}
        </>
    );
}
