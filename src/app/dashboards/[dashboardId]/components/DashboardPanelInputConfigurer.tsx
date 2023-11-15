import React, {SyntheticEvent, useState} from "react";
import {DashboardPanelInput} from "@/app/lib/model/dashboard/DashboardPanelInput";
import {DashboardPanelInputSourceConfigType} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigType";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {
    DashboardPanelInputConstantSourceConfigurer
} from "@/app/dashboards/[dashboardId]/components/DashboardPanelInputConstantSourceConfigurer";
import {
    DashboardPanelInputSourceConfigDataConstant
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataConstant";
import {
    DashboardPanelInputVariableSourceConfigurer
} from "@/app/dashboards/[dashboardId]/components/variable/DashboardPanelInputVariableSourceConfigurer";
import {
    DashboardPanelInputSourceConfigDataVariable
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataVariable";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";

export interface DashboardPanelInputConfigurerProps {
    dashboard: Dashboard
    input: DashboardPanelInput
    onChange: (input: DashboardPanelInput) => void
    onVariableCreated: (variable: DashboardVariable) => void
}

export const DashboardPanelInputConfigurer = ({dashboard, input, onChange, onVariableCreated}: DashboardPanelInputConfigurerProps) => {
    const [sourceConfigType, setSourceConfigType] =
        useState<DashboardPanelInputSourceConfigType>(input.sourceConfig.type);

    const onSourceConfigTypeChange = (event: SyntheticEvent | null, newSourceConfigType: DashboardPanelInputSourceConfigType | null) => {
        if (newSourceConfigType) {
            setSourceConfigType(newSourceConfigType);
        }
    };

    const onConstantSourceDataChange = (data: DashboardPanelInputSourceConfigDataConstant) => {
        onChange({
            name: input.name,
            sourceConfig: {
                type: "constant",
                data: data
            }
        });
    };

    const onVariableSourceDataChange = (data: DashboardPanelInputSourceConfigDataVariable) => {
        onChange({
            name: input.name,
            sourceConfig: {
                type: "variable",
                data: data
            }
        });
    };

    const sourceConfigurer = () => {
        switch (sourceConfigType) {
            case "constant":
                return <DashboardPanelInputConstantSourceConfigurer
                    data={input.sourceConfig.data as DashboardPanelInputSourceConfigDataConstant}
                    onChange={onConstantSourceDataChange}/>;
            case "variable":
                return <DashboardPanelInputVariableSourceConfigurer
                    dashboard={dashboard}
                    inputName={input.name}
                    data={input.sourceConfig.data as DashboardPanelInputSourceConfigDataVariable}
                    onChange={onVariableSourceDataChange}
                    onVariableCreated={onVariableCreated}/>
            default:
                return null;
        }
    }

    return (
        <tr>
            <td>{input.name}</td>
            <td>
                <Select value={sourceConfigType} onChange={onSourceConfigTypeChange}>
                    <Option value="constant">Constant</Option>
                    <Option value="variable">Dashboard Variable</Option>
                </Select>
            </td>
            <td>
                {sourceConfigurer()}
            </td>
        </tr>
    );
}