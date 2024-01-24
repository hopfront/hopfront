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

export const DashboardPanelInputConfigurer = ({
                                                  dashboard,
                                                  input,
                                                  onChange,
                                                  onVariableCreated
                                              }: DashboardPanelInputConfigurerProps) => {
    const [sourceConfigType, setSourceConfigType] =
        useState<DashboardPanelInputSourceConfigType>(input.sourceConfig.type);

    const sourceConfigurer = () => {
        switch (sourceConfigType) {
            case "constant":
                return <DashboardPanelInputConstantSourceConfigurer
                    data={input.sourceConfig.data as DashboardPanelInputSourceConfigDataConstant}
                    onChange={(data: DashboardPanelInputSourceConfigDataConstant) => {
                        onChange({
                            name: input.name,
                            sourceConfig: {
                                type: "constant",
                                data: data
                            }
                        });
                    }}/>;
            case "variable":
                return <DashboardPanelInputVariableSourceConfigurer
                    dashboard={dashboard}
                    inputName={input.name}
                    data={input.sourceConfig.data as DashboardPanelInputSourceConfigDataVariable}
                    onChange={(data: DashboardPanelInputSourceConfigDataVariable) => {
                        onChange({
                            name: input.name,
                            sourceConfig: {
                                type: "variable",
                                data: data
                            }
                        });
                    }}
                    onVariableCreated={createdVariable => {
                        onVariableCreated(createdVariable);
                        onChange({
                            name: input.name,
                            sourceConfig: {
                                type: "variable",
                                data: {
                                    variableName: createdVariable.name,
                                }
                            }
                        })
                    }}/>
            default:
                return null;
        }
    }

    return (
        <tr>
            <td>{input.name}</td>
            <td>
                <Select
                    value={sourceConfigType}
                    onChange={(_: SyntheticEvent | null, newSourceConfigType: DashboardPanelInputSourceConfigType | null) => {
                        if (newSourceConfigType) {
                            if (newSourceConfigType === "constant") {
                                onChange({
                                    name: input.name,
                                    sourceConfig: {
                                        type: 'constant',
                                        data: {
                                            value: ''
                                        } as DashboardPanelInputSourceConfigDataConstant
                                    }
                                });
                            } else if (newSourceConfigType === "variable") {
                                onChange({
                                    name: input.name,
                                    sourceConfig: {
                                        type: 'variable',
                                        data: {
                                            variableName: input.name
                                        } as DashboardPanelInputSourceConfigDataVariable
                                    }
                                });
                            }

                            setSourceConfigType(newSourceConfigType);
                        }
                    }}>
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