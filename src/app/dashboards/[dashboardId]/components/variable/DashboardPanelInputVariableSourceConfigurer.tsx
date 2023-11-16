import React, {useState} from "react";
import {Select, Option, Button, Stack} from "@mui/joy";
import {
    DashboardPanelInputSourceConfigDataVariable
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataVariable";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import Typography from "@mui/joy/Typography";
import {
    CreateDashboardVariableModal
} from "@/app/dashboards/[dashboardId]/components/variable/CreateDashboardVariableModal";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";

export interface DashboardPanelInputVariableSourceConfigurerProps {
    dashboard: Dashboard
    inputName: string
    data: DashboardPanelInputSourceConfigDataVariable
    onChange: (data: DashboardPanelInputSourceConfigDataVariable) => void
    onVariableCreated: (variable: DashboardVariable) => void
}

export const DashboardPanelInputVariableSourceConfigurer = ({
                                                                dashboard,
                                                                inputName,
                                                                data,
                                                                onChange,
                                                                onVariableCreated
                                                            }: DashboardPanelInputVariableSourceConfigurerProps) => {
    const [variableCreationOpen, setVariableCreationOpen] = useState(false);


    return (
        <>
            <Stack direction="row">
                {(dashboard.variables || []).length > 0 && <Select
                    sx={{
                        minWidth: 200
                    }}
                    value={data.variableName}
                    onChange={(_, value) => {
                        value && onChange({variableName: value});
                    }}>
                    {dashboard.variables.map(v => {
                        return (<Option key={v.name} value={v.name}>{v.name}</Option>);
                    })}
                </Select>}
                <Button
                    sx={{ml: 1}}
                    variant="outlined"
                    onClick={() => setVariableCreationOpen(true)}>
                    <Typography noWrap>Create variable</Typography>
                </Button>
            </Stack>
            <CreateDashboardVariableModal
                open={variableCreationOpen}
                onClose={() => setVariableCreationOpen(false)}
                onSave={variable => {
                    setVariableCreationOpen(false);
                    onVariableCreated(variable);
                }}
                dashboardTitle={dashboard.title}
                inputName={inputName}/>
        </>
    );

}