import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {Button, FormHelperText, Input, List, ListItem, Select} from "@mui/joy";
import Option from "@mui/joy/Option";
import Box from "@mui/joy/Box";
import {ForeignKeyConfigurer} from "@/app/components/foreign-keys/ForeignKeyConfigurer";
import {FilterAlt} from "@mui/icons-material";
import {DashboardVariable} from "@/app/lib/model/dashboard/DashboardVariable";
import {useState} from "react";
import {
    FormControlDashboardVariableManual
} from "@/app/dashboards/[dashboardId]/components/variable/FormControlDashboardVariableManual";
import {ConfirmModal, ConfirmModalProps} from "@/app/components/modal/ConfirmModal";
import {WarningAlert} from "@/app/components/alert/WarningAlert";

const VARIABLE_TECH_NAME_REGEX = new RegExp("^([a-zA-Z0-9_-]){0,50}$");

export interface DashboardVariableConfigProps {
    dashboardTitle: string
    defaultVariable: DashboardVariable
    onSave: (variable: DashboardVariable) => void
    onDelete?: (variable: DashboardVariable) => void
    disabled: boolean
}

export const DashboardVariableConfig = ({
                                            dashboardTitle,
                                            defaultVariable,
                                            onSave,
                                            onDelete,
                                            disabled
                                        }: DashboardVariableConfigProps) => {

    const [variable, setVariable] = useState<DashboardVariable>(defaultVariable);
    const [confirmModalProps, setConfirmModalProps] = useState<ConfirmModalProps | undefined>();

    const foreignKeySource = <>
        {`${dashboardTitle} -> ${variable?.name || ''}`}
    </>;

    const inputWithoutForeignKeyPreview = variable && <FormControlDashboardVariableManual
        variable={{
            variable: {
                name: variable.name,
                foreignKeys: []
            },
            value: undefined,
        }}
        onValueChange={() => null}/>;

    const onSaveVariable = () => {
        if (!variable) {
            return;
        }

        if (variable.name.trim().length === 0) {
            alert('Variable name cannot be empty');
            return;
        }

        return variable && onSave(variable);
    }

    const onDeleteClick = () => {
        if (!onDelete || !variable) {
            return;
        }

        setConfirmModalProps({
            title: 'Do you want to delete this variable?',
            onConfirm: () => onDelete(variable),
            onCancel: () => setConfirmModalProps(undefined)
        });
    }

    return (
        <>
            <Typography
                level="h1"
                sx={{mb: 2}}>
                {defaultVariable.name}
            </Typography>

            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                    value={variable.name}
                    placeholder="Variable name"
                    required
                    onChange={event => {
                        const newVariableName = event.currentTarget.value;

                        if (VARIABLE_TECH_NAME_REGEX.test(newVariableName)) {
                            setVariable({
                                ...variable,
                                name: newVariableName,
                                foreignKeys: variable.foreignKeys || []
                            });
                        }
                    }}/>
                <FormHelperText>The name of the variable. (Max. 50 characters, no special character allowed)</FormHelperText>
            </FormControl>
            <FormControl sx={{mt: 2}}>
                <FormLabel>Label</FormLabel>
                <Input
                    value={variable.label}
                    placeholder="Label name"
                    onChange={event => {
                        setVariable({
                            ...variable,
                            name: variable.name || '',
                            label: event.currentTarget.value,
                            foreignKeys: variable.foreignKeys || []
                        });
                    }}/>
                <FormHelperText>Optional display name</FormHelperText>
            </FormControl>
            <FormControl sx={{mt: 2}}>
                <FormLabel>Type</FormLabel>
                <Select value={variable.type || 'text'} onChange={(event, value) => {
                    setVariable({
                        ...variable,
                        name: variable.name,
                        type: value || 'text',
                        foreignKeys: [],
                    });
                }}>
                    <Option value='text'>Text</Option>
                    <Option value='number'>Number</Option>
                    <Option value='date'>Date</Option>
                    <Option value='foreignKey'>Foreign Key</Option>
                </Select>
            </FormControl>
            {variable.type === 'foreignKey' && <Box>
                <Typography level="title-md" sx={{mt: 2}}>Foreign Keys</Typography>
                <List variant="outlined">
                    {(variable.foreignKeys || []).length <= 0 && <>
                        <ListItem>
                            <WarningAlert title="No Foreign Key configured yet."/>
                        </ListItem>
                    </>}
                    {(variable.foreignKeys || []).map((foreignKey, fkIndex) => {
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
                                        readOnly={false}
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
                                readOnly={false}
                                foreignKeyIcon={<FilterAlt/>}/>
                        </Box>
                    </ListItem>
                </List>
            </Box>}

            <Button
                sx={{mt: 3, mr: 1}}
                onClick={() => onSaveVariable()}
                disabled={disabled || (variable.type === 'foreignKey' && (variable.foreignKeys || []).length === 0) || !variable.name}>
                Save
            </Button>

            {onDelete && <Button
                onClick={onDeleteClick}
                color="danger"
                variant="outlined"
                disabled={disabled}>
                Delete
            </Button>}

            <ConfirmModal
                title={confirmModalProps?.title}
                onConfirm={confirmModalProps?.onConfirm}
                onCancel={confirmModalProps?.onCancel}/>
        </>
    )
}