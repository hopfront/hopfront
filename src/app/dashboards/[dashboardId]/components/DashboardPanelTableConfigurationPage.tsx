import {
    DashboardPanel
} from "@/app/lib/model/dashboard/DashboardPanel";
import {Button, Input, Table} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {useState} from "react";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import Box from "@mui/joy/Box";
import {OperationSelect} from "@/app/components/select/OperationSelect";
import {ApiSpecSelect} from "@/app/components/select/ApiSpecSelect";
import {useApiContext} from "@/app/hooks/useApiContext";
import {DashboardPanelInputConfigurer} from "@/app/dashboards/[dashboardId]/components/DashboardPanelInputConfigurer";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {getOperationDefaultInputs} from "@/app/lib/openapi/utils";
import {
    DashboardPanelInputSourceConfigDataConstant
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataConstant";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";

export interface DashboardPanelTableConfigurationPageProps {
    dashboard: Dashboard
    defaultPanel: DashboardPanel
    isLoading: boolean
    onSave: (panel: DashboardPanel) => void
    onVariableCreated: (variable: DashboardVariable) => void
}

export const DashboardPanelTableConfigurationPage = ({
                                                         dashboard,
                                                         defaultPanel,
                                                         isLoading,
                                                         onSave,
                                                         onVariableCreated,
                                                     }: DashboardPanelTableConfigurationPageProps) => {

    const [currentPanel, setCurrentPanel] = useState(defaultPanel);
    const {data: apiContext} = useApiContext(currentPanel.config.apiSpecId);

    if (currentPanel.type !== "Visualization") {
        throw new Error("Cannot configure dashboard panel which is not a visualization");
    }

    const onOperationSelected = (operation: StandaloneOperation | undefined) => {
        const updatedConfig = {...currentPanel.config};
        updatedConfig.operationId = operation ? operation.getOperationId() : undefined;
        updatedConfig.inputs = getOperationDefaultInputs(operation, undefined).parameters.map(p => {
            return {
                name: p.parameter.name,
                sourceConfig: {
                    type: "constant",
                    data: {
                        value: p.value,
                    } as DashboardPanelInputSourceConfigDataConstant,
                }
            }
        })

        setCurrentPanel({...currentPanel, config: updatedConfig});
    };
    return (
        <>
            <Box sx={{mt: 3}}>
                <Typography level='title-sm' gutterBottom>Title</Typography>
                <Input
                    sx={{width: '350px', mb: 3}}
                    type="text"
                    placeholder="Panel title"
                    value={currentPanel.title}
                    onChange={event => setCurrentPanel({...currentPanel, title: event.currentTarget.value})}/>


                <Typography level='title-sm' gutterBottom>Data from</Typography>
                <ApiSpecSelect
                    defaultApiSpecId={currentPanel.config.apiSpecId}
                    onApiSpecSelected={spec => setCurrentPanel({
                        ...currentPanel,
                        config: {...currentPanel.config, apiSpecId: spec?.id}
                    })}
                    sx={{mb: 1, width: '350px'}}/>
                {apiContext && <OperationSelect
                    defaultOperationId={currentPanel.config.operationId}
                    onOperationSelected={onOperationSelected}
                    apiSpec={apiContext.apiSpec}
                    sx={{mb: 3}}/>}


                {currentPanel.config.inputs.length > 0 &&
                    <Typography level='title-sm' gutterBottom>Required information</Typography>}
                <Table sx={{mb: 2}}>
                    <tbody>
                    {currentPanel.config.inputs.map(input => {
                        return (
                            <DashboardPanelInputConfigurer
                                key={input.name}
                                dashboard={dashboard}
                                input={input}
                                onChange={changedInput => {
                                    const updatedInputs = currentPanel.config.inputs.map(existingInput => {
                                        return existingInput.name === input.name
                                            ? changedInput
                                            : existingInput;
                                    });

                                    setCurrentPanel({
                                        ...currentPanel,
                                        config: {...currentPanel.config, inputs: updatedInputs}
                                    })
                                }}
                                onVariableCreated={onVariableCreated}/>
                        );
                    })}
                    </tbody>
                </Table>

                <Button
                    loading={isLoading}
                    sx={{mr: 1}}
                    onClick={() => onSave(currentPanel)}>
                    Save
                </Button>
            </Box>
        </>
    );
};