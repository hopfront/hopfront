import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { OpenAPIV3 } from "openapi-types";
import { SyntheticEvent } from "react";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import { Monospace } from "@/app/components/typography/Monospace";
import { ManualInput, ManualInputValueType } from "@/app/components/input/ManualInput";
import { InputMenu } from "@/app/components/input/InputMenu";
import SmartManualInput from "./SmartManualInput";
import { ForeignKey } from "@/app/lib/dto/OpenApiExtensions";

export interface IntegerInputProps {
    updatableValue: UpdatableValue<number>
    schemaObject: NonArraySchemaObject
    debounceMillis?: number
    required?: boolean
    readOnly?: boolean
    menu?: InputMenu
    foreignKeys: ForeignKey[]
}

export const IntegerInput = ({ updatableValue, schemaObject, debounceMillis, required, readOnly, menu, foreignKeys }: IntegerInputProps) => {
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
            <SmartManualInput
                foreignKeys={foreignKeys}
                updatableValue={updatableValue}
                type="number"
                debounceMillis={debounceMillis}
                required={required}
                readOnly={readOnly}
                placeholder={schemaObject.example ? schemaObject.example.toString() : undefined}
                menu={menu}
                min={schemaObject.minimum ? (schemaObject.minimum + (schemaObject.exclusiveMinimum ? 1 : 0)) : undefined}
                max={schemaObject.maximum ? (schemaObject.maximum - (schemaObject.exclusiveMaximum ? 1 : 0)) : undefined} />
        );
    }
}