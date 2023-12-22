import { DashboardVariableInput } from "@/app/dashboards/[dashboardId]/components/variable/DashboardVariableInput";
import { VariableWithValue } from "@/app/lib/model/dashboard/VariableWithValue";
import { SxProps } from "@mui/joy/styles/types";
import { Box, Skeleton, Stack } from "@mui/joy";
import DashboardVariablePlaceholder from "./DashboardVariablePlaceholder.1";
import Typography from "@mui/joy/Typography";
import { useContext } from "react";
import { AdminContext, shouldShowAdminContent } from "@/app/context/AdminContext";

export interface DashboardVariablesPanelProps {
    dashboardId?: string
    variables: VariableWithValue[]
    onValueChange: (variable: VariableWithValue) => void
    sx?: SxProps
}

export const DashboardVariablesPanel = ({ dashboardId, variables, onValueChange, sx }: DashboardVariablesPanelProps) => {
    const adminContext = useContext(AdminContext);

    if (!dashboardId) {
        return <Box sx={sx}><Typography level="h2"><Skeleton loading={true}>Variable Placeholder</Skeleton></Typography></Box>
    }

    return (
        <Box sx={sx}>
            {shouldShowAdminContent(adminContext) &&
                <DashboardVariablePlaceholder dashboardId={dashboardId} variables={variables} />}
            <Stack direction="row" spacing={2} flexWrap='wrap' useFlexGap>
                {variables.map(variable => {
                    return (
                        <DashboardVariableInput
                            key={variable.variable.name}
                            variable={variable}
                            cacheKey={`dashboard:${dashboardId}:variable:${variable.variable.name}:value`}
                            onValueChange={value => {
                                onValueChange({
                                    variable: variable.variable,
                                    value: value,
                                })
                            }} />
                    );
                })}
            </Stack>
        </Box>
    );
}