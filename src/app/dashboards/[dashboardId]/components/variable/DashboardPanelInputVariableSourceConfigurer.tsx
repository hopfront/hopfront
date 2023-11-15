import React from "react";
import {Select, Option} from "@mui/joy";
import {
    DashboardPanelInputSourceConfigDataVariable
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataVariable";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import Typography from "@mui/joy/Typography";

export interface DashboardPanelInputVariableSourceConfigurerProps {
    dashboard: Dashboard
    data: DashboardPanelInputSourceConfigDataVariable
    onChange: (data: DashboardPanelInputSourceConfigDataVariable) => void
}

export const DashboardPanelInputVariableSourceConfigurer = ({dashboard, data, onChange}: DashboardPanelInputVariableSourceConfigurerProps) => {
    if (dashboard.variables.length > 0) {
        return (
            <>
                <Select
                    value={data.variableName}
                    onChange={(_, value) => {
                        if (value) {
                            onChange({
                                variableName: value
                            });
                        }
                    }}>
                    {dashboard.variables.map(v => {
                        return (<Option key={v.name} value={v.name}>{v.name}</Option>);
                    })}
                </Select>
            </>
        );
    } else {
        return <Typography>No dashboard variable has been configured.</Typography>
    }
}