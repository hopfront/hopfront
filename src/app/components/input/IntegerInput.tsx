import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { OpenAPIV3 } from "openapi-types";
import { SyntheticEvent } from "react";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import { Monospace } from "@/app/components/typography/Monospace";
import { ManualInput, ManualInputValueType } from "@/app/components/input/ManualInput";
import { InputMenu } from "@/app/components/input/InputMenu";

export interface IntegerInputProps {
    updatableValue: UpdatableValue<number>
    schemaObject: NonArraySchemaObject
    debounceMillis?: number
    required?: boolean
    readOnly?: boolean
    menu?: InputMenu
}

export const IntegerInput = ({ updatableValue, schemaObject, debounceMillis, required, readOnly, menu }: IntegerInputProps) => {
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
        const onInputChange = (value: ManualInputValueType) => {
            updatableValue.onValueUpdate(value as number);
        };

        return (
            <ManualInput
                type="number"
                defaultValue={updatableValue.value}
                debounceMillis={debounceMillis}
                required={required}
                readOnly={readOnly}
                placeholder={schemaObject.example ? schemaObject.example.toString() : undefined}
                onChange={onInputChange}
                menu={menu}
                min={schemaObject.minimum ? (schemaObject.minimum + (schemaObject.exclusiveMinimum ? 1 : 0)) : undefined}
                max={schemaObject.maximum ? (schemaObject.maximum - (schemaObject.exclusiveMaximum ? 1 : 0)) : undefined} />
        );
    }
}