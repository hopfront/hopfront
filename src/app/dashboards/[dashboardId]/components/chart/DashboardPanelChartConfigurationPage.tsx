import {
    DashboardPanel
} from "@/app/lib/model/dashboard/DashboardPanel";
import {Button, Input, Table} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import React, {useState} from "react";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import Box from "@mui/joy/Box";
import {OperationSelect} from "@/app/components/select/OperationSelect";
import {ApiSpecSelect} from "@/app/components/select/ApiSpecSelect";
import {DashboardPanelInputConfigurer} from "@/app/dashboards/[dashboardId]/components/DashboardPanelInputConfigurer";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {
    getOperationDefaultInputs, getSchemaPropertyType, getStandaloneOperation
} from "@/app/lib/openapi/utils";
import {
    DashboardPanelInputSourceConfigDataConstant
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataConstant";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {ChartDataConfigurer} from "@/app/dashboards/[dashboardId]/components/chart/ChartDataConfigurer";
import {DashboardPanelChartConfig} from "@/app/lib/model/dashboard/DashboardPanelChartConfig";
import {useApiContext} from "@/app/hooks/useApiContext";
import Card from "@mui/joy/Card";
import {
    ResponseSchemaProperty,
    ResponseSchemaPropertySelector
} from "@/app/components/input/ResponseSchemaPropertySelector";
import {ButtonRow} from "@/app/components/button/ButtonRow";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";

export interface DashboardPanelChartConfigurationPageProps {
    dashboard: Dashboard
    defaultPanel: DashboardPanel
    isLoading: boolean
    onSave: (panel: DashboardPanel) => void
    onCancel: () => void
    onVariableCreated: (variable: DashboardVariable) => void
}

export const DashboardPanelChartConfigurationPage = ({
                                                         dashboard,
                                                         defaultPanel,
                                                         isLoading,
                                                         onSave,
                                                         onCancel,
                                                         onVariableCreated,
                                                     }: DashboardPanelChartConfigurationPageProps) => {

    const [panel, setPanel] = useState<DashboardPanel>(defaultPanel);
    const panelChartConfig = panel.config as DashboardPanelChartConfig;

    const {data: apiContext} = useApiContext(panelChartConfig.apiSpecId);
    const operation = (apiContext && panelChartConfig.operationId)
        ? getStandaloneOperation(panelChartConfig.operationId, apiContext.apiSpec)
        : undefined;

    const onApiSpecSelected = (apiSpec: ApiSpec | undefined) => {
        setPanel({
            ...panel,
            config: {
                apiSpecId: apiSpec?.id,
                operationId: undefined,
                inputs: [],
                chartDataConfig: undefined
            } as DashboardPanelChartConfig,
        });
    };

    const onOperationSelected = (operation: StandaloneOperation | undefined) => {
        setPanel({
            ...panel,
            config: {
                ...panel.config,
                operationId: operation?.getOperationId(),
                inputs: getOperationDefaultInputs(operation, undefined).parameters.map(p => {
                    return {
                        name: p.parameter.name,
                        sourceConfig: {
                            type: "constant",
                            data: {
                                value: p.value,
                            } as DashboardPanelInputSourceConfigDataConstant,
                        }
                    }
                }),
                chartDataConfig: undefined
            },
        });
    };

    const onResponseSchemaPropertySelected = (schemaProperty: ResponseSchemaProperty) => {
        setPanel({
            ...panel,
            config: {
                ...panel.config,
                chartDataConfig: {
                    responseSchemaProperty: schemaProperty,
                    xAxes: [],
                    series: []
                }
            }
        })
    };

    const saveButtonDisabled = (): boolean => {
        if (!panelChartConfig.chartDataConfig) {
            return true;
        }

        if (panelChartConfig.chartDataConfig.series.length === 0) {
            return true;
        }

        return false;
    };

    return (
        <>
            <Box sx={{mt: 3}}>
                <Typography level='title-sm' gutterBottom>Title</Typography>
                <Input
                    sx={{width: '350px', mb: 3}}
                    type="text"
                    placeholder="Panel title"
                    value={panel.title}
                    onChange={event => setPanel({...panel, title: event.target.value})}/>

                <Card>
                    <Typography level='title-md' gutterBottom>Data Source</Typography>
                    <ApiSpecSelect
                        defaultApiSpecId={panel.config.apiSpecId}
                        onApiSpecSelected={onApiSpecSelected}/>

                    {apiContext && <OperationSelect
                        defaultOperationId={panel.config.operationId}
                        onOperationSelected={onOperationSelected}
                        apiSpec={apiContext.apiSpec}/>}

                    {panel.config.inputs.length > 0 && <>
                        <Card>
                            <Typography level='body-sm'>Inputs</Typography>
                            <Table sx={{mb: 2}}>
                                <tbody>
                                {panel.config.inputs.map(input => {
                                    return (
                                        <DashboardPanelInputConfigurer
                                            key={input.name}
                                            dashboard={dashboard}
                                            input={input}
                                            onChange={changedInput => {
                                                const updatedInputs = panel.config.inputs.map(existingInput => {
                                                    return existingInput.name === input.name
                                                        ? changedInput
                                                        : existingInput;
                                                });

                                                setPanel({
                                                    ...panel,
                                                    config: {
                                                        ...panel.config,
                                                        inputs: updatedInputs,
                                                    }
                                                })
                                            }}
                                            onVariableCreated={onVariableCreated}/>
                                    );
                                })}
                                </tbody>
                            </Table>
                        </Card>
                    </>}

                    {operation && <ResponseSchemaPropertySelector
                        defaultSchemaProperty={panelChartConfig.chartDataConfig?.responseSchemaProperty}
                        schemaPropertyPredicate={schemaProperty => {
                            const schemaPropertyType = getSchemaPropertyType(schemaProperty, operation.apiSpec);
                            return schemaPropertyType === "array";
                        }}
                        onResponseSchemaPropertySelected={onResponseSchemaPropertySelected}
                        operation={operation}/>}
                </Card>

                {(apiContext && panelChartConfig.chartDataConfig?.responseSchemaProperty) && <Box sx={{mt: 2}}>
                    <Card sx={{mt: 2}}>
                        <Typography level="title-md">Chart Configuration</Typography>
                        <ChartDataConfigurer
                            responseSchemaProperty={panelChartConfig.chartDataConfig.responseSchemaProperty}
                            defaultChartDataConfig={(panel.config as DashboardPanelChartConfig).chartDataConfig}
                            onChartDataConfigured={configuredChartData => {
                                setPanel({
                                    ...panel,
                                    config: {
                                        ...panel.config,
                                        chartDataConfig: configuredChartData,
                                    }
                                });
                            }}
                            apiSpec={apiContext.apiSpec}/>
                    </Card>
                </Box>}

                <ButtonRow align="right" sx={{mt: 4}}>
                    <Button
                        disabled={saveButtonDisabled()}
                        loading={isLoading}
                        onClick={() => onSave(panel)}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={onCancel}>Cancel</Button>
                </ButtonRow>
            </Box>
        </>
    );
};