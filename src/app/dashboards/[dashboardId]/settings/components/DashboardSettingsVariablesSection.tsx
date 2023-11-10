import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import Typography from "@mui/joy/Typography";
import {Button, LinearProgress, List, ListItem, ListItemButton} from "@mui/joy";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";
import {useState} from "react";
import {InfoAlert} from "@/app/components/alert/InfoAlert";
import {DashboardLocalStorage} from "@/app/lib/localstorage/DashboardLocalStorage";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";

export interface DashboardSettingsVariablesListProps {
    dashboard?: Dashboard
    onVariableAdded: (variable: DashboardVariable) => void
    onVariableClick: (variable: DashboardVariable) => void
}

export const buildNewVariableName = (dashboard: Dashboard): string => {
    let variableNameIndex = 0;

    while (dashboard.variables.find(v => v.name === `variable${variableNameIndex}`)) {
        variableNameIndex++;
    }

    return `variable${variableNameIndex}`
}

export const DashboardSettingsVariablesSection = ({
                                                      dashboard,
                                                      onVariableAdded,
                                                      onVariableClick
                                                  }: DashboardSettingsVariablesListProps) => {
    const [error, setError] = useState<any | undefined>();
    const [alertInfoVisible, setAlertInfoVisible] =
        useState(dashboard ? DashboardLocalStorage.getVariableAlertInfoVisible(dashboard.id) : false);

    const onAddClick = () => {
        if (!dashboard) return;

        const newVariable = {
            name: buildNewVariableName(dashboard),
        } as DashboardVariable;

        onVariableAdded(newVariable);
    }

    const onAlertInfoClose = () => {
        if (!dashboard) return;
        DashboardLocalStorage.setVariableAlertInfoVisible(dashboard.id, false);
        setAlertInfoVisible(false);
    }

    if (error) {
        return <ErrorAlert error={error} onClose={() => setError(undefined)}/>;
    }

    return (
        <>
            <Typography level="h4" gutterBottom sx={{mt: 2}}>Dashboard variables</Typography>

            {alertInfoVisible &&
                <InfoAlert title="What do dashboard variables do?" onClose={onAlertInfoClose}>
                    <Typography level="body-sm" color="primary">
                        Dashboard variables make your dashboards more dynamic and interactive. <br/>
                        Replace fixed data like &quot;customer IDs&quot; with a dashboard variable that you can change
                        right from your dashboard view. <br/>
                        Use the same dashboard variable across multiple panels for easier management.
                    </Typography>
                </InfoAlert>}

            <Typography
                id="decorated-variables-list"
                level="body-xs"
                textTransform="uppercase"
                fontWeight="lg"
                sx={{mt: 2}}
            >
                Variables
            </Typography>
            <List
                aria-labelledby="decorated-variables-list"
                variant='outlined'
                sx={{borderRadius: '8px', maxWidth: '350px'}}>

                {!dashboard && <ListItem><LinearProgress/></ListItem>}
                {dashboard && dashboard.variables.map(variable => (
                    <ListItem key={variable.name}>
                        <ListItemButton onClick={() => onVariableClick(variable)}>
                            <Typography>
                                <Typography
                                    fontFamily="monospace"
                                    overflow='hidden'
                                    textOverflow='ellipsis'>
                                    {variable.name}
                                </Typography></Typography>
                            {variable.label && <Typography level="body-xs" sx={{ml: 1}}>({variable.label})</Typography>}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Button
                disabled={!dashboard}
                onClick={onAddClick}
                sx={{mt: 2}}>
                Add Variable
            </Button>
        </>
    );
}