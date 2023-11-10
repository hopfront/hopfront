import {Stack} from "@mui/joy";
import {VariableWithValue} from "@/app/lib/model/dashboard/VariableWithValue";
import {ForeignKeyFormControlInput} from "@/app/components/input/ForeignKeyFormControlInput";
import {Edit} from "@mui/icons-material";
import {
    FormControlDashboardVariableManual
} from "@/app/dashboards/[dashboardId]/components/FormControlDashboardVariableManual";

export interface DashboardVariableInputProps {
    variable: VariableWithValue
    cacheKey: string
    onValueChange: (value: string) => void
}

export const DashboardVariableInput = ({variable, cacheKey, onValueChange}: DashboardVariableInputProps) => {
    if (variable.variable.foreignKeys?.length > 0) {
        return (
            <>
                {variable.variable.foreignKeys.map(fk => (
                    <ForeignKeyFormControlInput
                        key={fk.schemaRef + fk.propertyName}
                        inputLabel={variable.variable.label ? variable.variable.label : variable.variable.name}
                        updatableValue={{
                            value: variable.value,
                            onValueUpdate: (value) => {
                                onValueChange(value);
                            }
                        }}
                        foreignKeys={variable.variable.foreignKeys}
                        cacheKey={cacheKey}
                        icon={<Edit/>}/>
                ))}
            </>
        );
    } else {
        return (
            <>
                <Stack direction="row">
                    <FormControlDashboardVariableManual
                        variable={variable}
                        onValueChange={onValueChange}
                        cacheKey={cacheKey}/>
                </Stack>
            </>
        );
    }
}