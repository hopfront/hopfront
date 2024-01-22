import { Monospace } from "@/app/components/typography/Monospace";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { OpenAPIV3 } from "openapi-types";
import { SyntheticEvent } from "react";
import { ManualInput } from "./ManualInput";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;

export interface IntegerInputProps {
    updatableValue: UpdatableValue<number>
    schemaObject: NonArraySchemaObject
    required?: boolean
    readOnly?: boolean
    onFocus?: React.FocusEventHandler
    onBlur?: React.FormEventHandler
}

export const IntegerInput = ({
    updatableValue,
    schemaObject,
    required,
    readOnly,
    onFocus,
    onBlur
}: IntegerInputProps) => {
    const enumValues = schemaObject.enum as number[];

    if (enumValues) {
        const onSelectChange = (event: SyntheticEvent | null, newValue: string | null) => {
            updatableValue.onValueUpdate(newValue ? parseInt(newValue) : undefined);
        };

        return (
            <Select
                placeholder={schemaObject.example} onChange={onSelectChange}
                defaultValue={updatableValue.value?.toString()}
                renderValue={option => {
                    if (!option) {
                        return null;
                    }

                    return <Monospace>{option.value}</Monospace>
                }}>
                {enumValues.map(enumValue => {
                    return <Option key={enumValue} value={enumValue}><Monospace>{enumValue}</Monospace></Option>;
                })}
            </Select>
        );
    } else {
        return (
            <ManualInput
                updatableValue={updatableValue}
                type="number"
                required={required}
                readOnly={readOnly}
                placeholder={schemaObject.example ? schemaObject.example.toString() : undefined}
                min={schemaObject.minimum ? (schemaObject.minimum + (schemaObject.exclusiveMinimum ? 1 : 0)) : undefined}
                max={schemaObject.maximum ? (schemaObject.maximum - (schemaObject.exclusiveMaximum ? 1 : 0)) : undefined}
                onFocus={onFocus}
                onBlur={onBlur} />
        )
    }
}