import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { OpenAPIV3 } from "openapi-types";
import { HTMLInputTypeAttribute, SyntheticEvent } from "react";
import { Monospace } from "../typography/Monospace";
import { ManualInput, ManualInputValueType } from "./ManualInput";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;

export interface StringInputProps {
    name?: string,
    updatableValue: UpdatableValue<string>
    schemaObject: NonArraySchemaObject
    required?: boolean
    readOnly?: boolean
    onFocus?: React.FocusEventHandler
    onBlur?: React.FormEventHandler
}

export const StringInput = ({
    updatableValue,
    schemaObject,
    required,
    readOnly,
    onFocus,
    onBlur
}: StringInputProps) => {
    const enumValues = schemaObject.enum as string[];

    if (enumValues) {
        const onSelectChange = (event: SyntheticEvent | null, newValue: string | null) => {
            updatableValue.onValueUpdate(newValue ? newValue : undefined);
        };

        return (
            <Select
                onChange={onSelectChange}
                defaultValue={updatableValue.value?.toString()}
                renderValue={option => {
                    if (!option) {
                        return null;
                    }

                    return <Monospace>{option.value}</Monospace>
                }}>
                {enumValues.map(enumValue => {
                    return (<Option key={enumValue} value={enumValue}><Monospace>{enumValue}</Monospace></Option>);
                })}
            </Select>
        );
    } else {
        const inputType = (): HTMLInputTypeAttribute => {
            switch (schemaObject.format) {
                case "binary":
                    return "file";
                case "date":
                    return "date"
                case "date-time":
                    return "datetime-local"
                case "email":
                    return "email"
                case "password":
                    return "password";
                default:
                    return "text";
            }
        }

        switch (schemaObject.format) {
            default: {
                return (
                    <ManualInput
                        updatableValue={updatableValue}
                        type={inputType()}
                        required={required}
                        placeholder={schemaObject.example}
                        readOnly={readOnly || schemaObject.readOnly}
                        onFocus={onFocus}
                        onBlur={onBlur} />
                )
            }
        }

    }
}