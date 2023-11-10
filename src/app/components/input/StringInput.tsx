import {UpdatableValue} from "@/app/lib/model/UpdatableValue";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import {OpenAPIV3} from "openapi-types";
import {HTMLInputTypeAttribute, SyntheticEvent} from "react";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import {Monospace} from "../typography/Monospace";
import {InputMenu} from "@/app/components/input/InputMenu";
import {ManualInput, ManualInputValueType} from "@/app/components/input/ManualInput";

export interface StringInputProps {
    name?: string,
    updatableValue: UpdatableValue<string>
    schemaObject: NonArraySchemaObject
    debounceMillis?: number
    required?: boolean
    readOnly?: boolean
    menu?: InputMenu
}

export const StringInput = ({
                                updatableValue,
                                schemaObject,
                                debounceMillis = 0,
                                required,
                                readOnly,
                                menu
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
                const onInputChange = (value: ManualInputValueType) => {
                    updatableValue.onValueUpdate(value as string);
                };

                return (
                    <ManualInput
                        type={inputType()}
                        required={required}
                        placeholder={schemaObject.example}
                        onChange={onInputChange}
                        debounceMillis={debounceMillis}
                        defaultValue={updatableValue.value}
                        readOnly={readOnly || schemaObject.readOnly}
                        menu={menu}/>
                );
            }
        }

    }
}