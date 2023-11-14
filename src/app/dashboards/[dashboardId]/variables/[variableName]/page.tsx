'use client';

import {ChangeEvent, useEffect, useState} from "react";
import LinearProgress from "@mui/joy/LinearProgress";
import {useParams, useRouter} from "next/navigation";
import Box from "@mui/joy/Box";
import {Breadcrumbs, Button, FormHelperText, Input, Link, List, ListItem, Select} from "@mui/joy";
import {FilterAlt, KeyboardArrowRight} from "@mui/icons-material";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Option from "@mui/joy/Option";
import {ForeignKeyConfigurer} from "@/app/components/foreign-keys/ForeignKeyConfigurer";
import {getRestrictedApiUrls} from "@/app/lib/openapi/utils";
import {
    FormControlDashboardVariableManual
} from "@/app/dashboards/[dashboardId]/components/FormControlDashboardVariableManual";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";
import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";
import {useDashboard} from "@/app/hooks/useDashboard";
import {DashboardApi} from "@/app/lib/api/DashboardApi";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {ConfirmModal, ConfirmModalProps} from "@/app/components/modal/ConfirmModal";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {
    DashboardPanelInputSourceConfigDataVariable
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataVariable";
import {DashboardPanelInput} from "@/app/lib/model/dashboard/DashboardPanelInput";
import {
    DashboardPanelInputSourceConfigDataConstant
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataConstant";

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const {usePageView} = useAnalytics();

    const dashboardId = params['dashboardId'] as string;
    const variableName = params['variableName'];

    const [saving, setSaving] = useState(false);
    const [savingError, setSavingError] = useState<any | undefined>();

    const {dashboard, error: dashboardError, isLoading} = useDashboard(dashboardId);

    const initialVariable = dashboard?.variables.find(v => v.name === variableName);
    const [variable, setVariable] = useState<DashboardVariable | undefined>(initialVariable);
    const [confirmModalProps, setConfirmModalProps] = useState<ConfirmModalProps | undefined>();

    usePageView("dashboard-variable-page");

    useEffect(() => {
        const variable = dashboard?.variables.find(v => v.name === variableName);
        setVariable(variable ? variable : {name: variableName} as DashboardVariable)
    }, [dashboard])

    const restrictedImportUrls = getRestrictedApiUrls();
    const readOnly = restrictedImportUrls.length > 0;

    const onSaveVariable = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!variable || !dashboard) {
            return;
        }

        if (variable.name.trim().length === 0) {
            alert('Variable name cannot be empty');
            return;
        }

        setSaving(true);

        let updatedDashboard;
        if (initialVariable) { // update variable
            updatedDashboard = {
                ...dashboard,
                variables: dashboard.variables.map(v => v.name === initialVariable.name && variable ? variable : v) ?? []
            };
        } else { // create variable
            updatedDashboard = {
                ...dashboard,
                variables: dashboard.variables.concat(variable)
            }
        }

        DashboardApi.updateDashboard(updatedDashboard)
            .then(() => router.push(`/dashboards/${dashboardId}/settings`))
            .catch(error => {
                setSavingError(error);
                setSaving(false);
            });
    };

    const onDeleteVariable = () => {
        if (!initialVariable || !dashboard) {
            return;
        }


        setConfirmModalProps({
            title: 'Do you want to delete this variable?',
            onConfirm: () => {
                setConfirmModalProps(undefined);
                setSaving(true);

                const updatedDashboard: Dashboard = {
                    ...dashboard,
                    panels: dashboard.panels.map(panel => {
                        return {
                            ...panel,
                            config: {
                                ...panel.config,
                                inputs: panel.config.inputs.map(input => {
                                    if (input.sourceConfig.type === "variable") {
                                        const variableConfig = input.sourceConfig.data as DashboardPanelInputSourceConfigDataVariable;

                                        if (variableConfig.variableName === initialVariable.name) {
                                            // we re-configure the panel to not use the deleted variable anymore.
                                            return {
                                                    ...input,
                                                    sourceConfig: {
                                                        type: 'constant',
                                                        data: {
                                                            value: ''
                                                        } as DashboardPanelInputSourceConfigDataConstant
                                                    }
                                                } as DashboardPanelInput;
                                        } else {
                                            return input
                                        }
                                    } else {
                                        return input;
                                    }
                                }),
                            }
                        }
                    }),
                    variables: dashboard.variables.flatMap(v => v.name === initialVariable.name ? [] : [v])
                };

                DashboardApi.updateDashboard(updatedDashboard)
                    .then(() => router.push(`/dashboards/${dashboardId}/settings`))
                    .catch(error => {
                        setSavingError(error);
                        setSaving(false);
                    });
            },
            onCancel: () => setConfirmModalProps(undefined),
        });
    }

    const foreignKeySource = <>
        {`${dashboard?.title} -> ${variable?.name || ''}`}
    </>;

    const inputWithoutForeignKeyPreview = variable && <FormControlDashboardVariableManual
        variable={{
            variable: {
                name: variableName as string,
                foreignKeys: []
            },
            value: undefined,
        }}
        onValueChange={() => null}/>;

    return (
        <>
            {isLoading && <Box><LinearProgress/></Box>}
            {dashboardError && <ErrorAlert error={dashboardError}/>}
            {dashboard &&
                <>
                    <Breadcrumbs separator={<KeyboardArrowRight/>} sx={{p: 0, pb: 1}}>
                        <Link href='/dashboards' color='neutral'>
                            Dashboards
                        </Link>
                        <Link href={`/dashboards/${dashboard.id}`} color='neutral'>
                            {dashboard.title}
                        </Link>
                        <Link href={`/dashboards/${dashboard.id}/settings`} color='neutral'>
                            Settings
                        </Link>
                        <Typography>Variables</Typography>
                        <Typography>{initialVariable?.name ?? variableName ?? '...'}</Typography>
                    </Breadcrumbs>
                    <Box>
                        <Typography level="h1"
                                    sx={{mb: 2}}>{initialVariable?.name ?? variableName ?? '...'}</Typography>
                        <form onSubmit={onSaveVariable}>
                            <FormControl>
                                <FormLabel>Technical name</FormLabel>
                                <Input
                                    sx={{maxWidth: '350px'}}
                                    value={variable?.name ?? variableName}
                                    placeholder="Variable name"
                                    required
                                    onChange={event => {
                                        setVariable({
                                            ...variable,
                                            name: event.currentTarget.value,
                                            foreignKeys: variable?.foreignKeys || []
                                        });
                                    }}/>
                                <FormHelperText>Used for technical features and configuration</FormHelperText>
                            </FormControl>
                            <FormControl sx={{mt: 2}}>
                                <FormLabel>Alias (optionnal)</FormLabel>
                                <Input
                                    sx={{maxWidth: '350px'}}
                                    value={variable?.label}
                                    placeholder="Label name"
                                    onChange={event => {
                                        setVariable({
                                            ...variable,
                                            name: variable?.name || '',
                                            label: event.currentTarget.value,
                                            foreignKeys: variable?.foreignKeys || []
                                        });
                                    }}/>
                                <FormHelperText>Displayed on dashboard instead of the technical name</FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>Type</FormLabel>
                                <Select value={variable?.type || 'text'} onChange={(event, value) => {
                                    setVariable({
                                        ...variable,
                                        name: variable?.name || '',
                                        type: value || 'text',
                                        foreignKeys: variable?.foreignKeys || [],
                                    });
                                }}>
                                    <Option value='text'>Text</Option>
                                    <Option value='number'>Number</Option>
                                    <Option value='date'>Date</Option>
                                </Select>
                            </FormControl>
                            <Typography level="title-md" sx={{mt: 2}}>Foreign Keys</Typography>
                            <Box>
                                <List
                                    variant='outlined'
                                    sx={{
                                        mt: 0.5,
                                        width: 'fit-content',
                                        minWidth: '250px',
                                        maxWidth: '350px',
                                        borderRadius: '8px'
                                    }}>
                                    {(variable?.foreignKeys || []).map((foreignKey, fkIndex) => {
                                        return (
                                            <ListItem key={foreignKey.schemaRef + foreignKey.propertyName}>
                                                <Box sx={{mt: 1}}>
                                                    <ForeignKeyConfigurer
                                                        source={foreignKeySource}
                                                        foreignKey={foreignKey}
                                                        inputWithoutForeignKeyPreview={inputWithoutForeignKeyPreview}
                                                        onForeignKeySelected={updatedForeignKey => {
                                                            if (variable) {
                                                                variable.foreignKeys[fkIndex] = updatedForeignKey;
                                                                setVariable(variable);
                                                            }
                                                        }}
                                                        onDelete={() => {
                                                            if (variable) {
                                                                setVariable({
                                                                    ...variable,
                                                                    foreignKeys: variable.foreignKeys.flatMap((fk, fki) => fki === fkIndex ? [] : fk)
                                                                });
                                                            }
                                                        }}
                                                        readOnly={readOnly}
                                                        foreignKeyIcon={<FilterAlt/>}/>
                                                </Box>
                                            </ListItem>
                                        );
                                    })}
                                    <ListItem>
                                        <Box sx={{mt: 1}}>
                                            <ForeignKeyConfigurer
                                                source={foreignKeySource}
                                                inputWithoutForeignKeyPreview={inputWithoutForeignKeyPreview}
                                                onForeignKeySelected={foreignKey => {
                                                    if (variable) {
                                                        const foreignKeys = variable?.foreignKeys || [];
                                                        foreignKeys.push(foreignKey);
                                                        setVariable({
                                                            ...variable,
                                                            foreignKeys: foreignKeys,
                                                        })
                                                    }
                                                }}
                                                onDelete={() => null}
                                                readOnly={readOnly}
                                                foreignKeyIcon={<FilterAlt/>}/>
                                        </Box>
                                    </ListItem>
                                </List>
                            </Box>
                            <Button type="submit" sx={{mt: 3, mr: 1}}
                                    disabled={saving || readOnly}>{initialVariable ? 'Save' : 'Create'}</Button>
                            {initialVariable && <Button onClick={onDeleteVariable} color="danger" variant="outlined"
                                                        disabled={saving || readOnly}>Delete</Button>}
                        </form>
                        {savingError && <ErrorAlert
                            error={savingError}
                            onClose={() => setSavingError(undefined)}
                            sx={{mt: 1}}/>}
                    </Box>
                </>}

            <ConfirmModal
                title={confirmModalProps?.title}
                onConfirm={confirmModalProps?.onConfirm}
                onCancel={confirmModalProps?.onCancel}/>
        </>
    );
}
