import {UpdatableValue} from "@/app/lib/model/UpdatableValue";
import {Switch} from "@mui/joy";
import {OpenAPIV3} from "openapi-types";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import {useState} from "react";
import Box from "@mui/joy/Box";

export interface BooleanInputProps {
    updatableValue: UpdatableValue<boolean>
    schemaObject: NonArraySchemaObject
}

export const BooleanInput = ({updatableValue, schemaObject}: BooleanInputProps) => {
    const [checked, setChecked] = useState(updatableValue.value || false);

    return (
        <Box>
            <Switch
                checked={checked}
                onChange={event => {
                    setChecked(event.target.checked);
                    updatableValue.onValueUpdate(event.target.checked);
                }}/>
        </Box>

    );
}