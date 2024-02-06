import { VariableWithValue } from "@/app/lib/model/dashboard/VariableWithValue";
import { DashboardLocalStorage } from "@/app/lib/localstorage/DashboardLocalStorage";
import {AddCircle} from "@mui/icons-material";
import { Box, Card, Link, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";

interface DashboardVariablePlaceholderProps {
    dashboardId?: string,
    variables: VariableWithValue[],
}

export default function DashboardVariablePlaceholder({ dashboardId, variables }: DashboardVariablePlaceholderProps) {
    const router = useRouter();
    const {registerEvent} = useAnalytics();
    const [shouldShowPlaceholder, setShouldShowPlaceholder] = useState(dashboardId ? DashboardLocalStorage.getVariablePlaceholderVisible(dashboardId) : false);
    const [variablePlaceholderHover, setVariablePlaceholderHover] = useState(false);

    const onVariablePlaceholderDismissed = () => {
        if (!dashboardId) return;
        DashboardLocalStorage.setVariablePlaceholderVisible(dashboardId, false);
        setShouldShowPlaceholder(false);
    }

    const onVariablePlaceholderClicked = () => {
        registerEvent({ name: 'dashboard-variable-placeholder-clicked' });
        router.push(`/dashboards/${dashboardId}/settings`);
    }

    return (
        <>
            {variables.length === 0 && shouldShowPlaceholder &&
                <>
                    <Card
                        onMouseEnter={() => setVariablePlaceholderHover(true)}
                        onMouseLeave={() => setVariablePlaceholderHover(false)}
                        variant='outlined'
                        orientation='horizontal'
                        sx={{
                            pr: 1,
                            width: '246px',
                            height: '36px',
                            backgroundColor: 'primary.softBg',
                            borderRadius: 'var(--joy-radius-sm)',
                            '&:hover': { boxShadow: 'sm', borderColor: 'neutral.outlinedHoverBorder' },
                        }}
                    >

                        <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                justifyContent: 'start'
                            }}>
                                <AddCircle sx={{ width: '16px'}} color="primary"/>
                                <Typography
                                    level='body-sm'
                                    sx={{fontWeight: '500', lineHeight: '10px' }}>
                                    Dashboard variable
                                    <Link
                                        title="Create new dashboard variable"
                                        aria-label="Create new dashboard variable"
                                        underline='none'
                                        overlay
                                        component='button'
                                        onClick={onVariablePlaceholderClicked} />
                                </Typography>
                            </Box>
                            {variablePlaceholderHover &&
                                <Link
                                    title="Do not show again"
                                    onClick={onVariablePlaceholderDismissed}>
                                    <Typography level="body-xs" textColor="#82B7ED">Dismiss</Typography>

                                </Link>}
                        </Box>
                    </Card>
                </>}
        </>
    );
}
