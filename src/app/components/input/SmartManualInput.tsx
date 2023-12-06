import { useApiSpecs } from "@/app/hooks/useApiSpecs";
import { ForeignKey } from "@/app/lib/dto/OpenApiExtensions";
import { SchemaOrReference } from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { getStandaloneOperations } from "@/app/lib/openapi/utils";
import { Box, Input, MenuItem, MenuList } from "@mui/joy";
import { OpenAPIV3 } from "openapi-types";
import { HTMLInputTypeAttribute, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ModalOperationResponseSchemaSelector } from "../foreign-keys/ModalOperationResponseSchemaSelector";
import { OperationLabel } from "../typography/OperationLabel";
import { OperationWithForeignKey, SelectedObject, SelectedOperation, getForeignKeyWithinSchema } from "./ForeignKeyFormControlInput";
import { InputMenu } from "./InputMenu";
import { ManualInputValueType } from "./ManualInput";
import ResponseObject = OpenAPIV3.ResponseObject;
import ReferenceObject = OpenAPIV3.ReferenceObject;
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import SchemaObject = OpenAPIV3.SchemaObject;

export interface SmartManualInputProps {
    updatableValue: UpdatableValue<any>
    type: HTMLInputTypeAttribute
    onChange: (value: ManualInputValueType) => void
    defaultValue?: ManualInputValueType
    placeholder?: string | undefined
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    debounceMillis?: number
    menu?: InputMenu
    foreignKeys: ForeignKey[]
    min?: number
    max?: number
    sx?: {}
}

export default function SmartManualInput({
    updatableValue,
    type,
    defaultValue,
    placeholder,
    onChange,
    required,
    disabled,
    debounceMillis = 0,
    readOnly,
    menu,
    foreignKeys,
    min,
    max,
    sx
}: SmartManualInputProps) {
    const onInputChange = useDebouncedCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        debounceMillis
    );

    const { data: apiSpecs } = useApiSpecs();
    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [inputValue, setInputValue] = useState(defaultValue?.toString() || '');
    const [hasFocus, setHasFocus] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const allOperations = apiSpecs
        ? apiSpecs.apiSpecs.flatMap(apiSpec => getStandaloneOperations(apiSpec))
        : [];

    const [selectedOperation, setSelectedOperation] = useState<SelectedOperation | undefined>();

    const relevantOperations: OperationWithForeignKey[] = allOperations.flatMap(op => {
        for (const responsesStatuses in op.operation.responses) {
            const response = op.operation.responses[responsesStatuses] as ResponseObject;
            for (let contentType in response.content) {
                const responseContent = response.content[contentType];
                const otherSchemaObject = responseContent.schema;

                if (otherSchemaObject && otherSchemaObject.hasOwnProperty('$ref')) {
                    const otherSchemaRef = otherSchemaObject as ReferenceObject;

                    const foreignKeyWithinSchema = getForeignKeyWithinSchema(otherSchemaRef, foreignKeys, op.apiSpec.document);

                    if (foreignKeyWithinSchema) {
                        return [{
                            operation: op,
                            foreignKey: foreignKeyWithinSchema
                        } as OperationWithForeignKey];
                    }
                } else if (otherSchemaObject && otherSchemaObject.hasOwnProperty('items')) {
                    const otherSchemaArray = otherSchemaObject as ArraySchemaObject;

                    const arrayItems = otherSchemaArray.items as SchemaOrReference;

                    if (arrayItems.hasOwnProperty('$ref')) {
                        const foreignKeyWithinSchema = getForeignKeyWithinSchema(arrayItems as ReferenceObject, foreignKeys, op.apiSpec.document);

                        if (foreignKeyWithinSchema) {
                            return [{
                                operation: op,
                                foreignKey: foreignKeyWithinSchema,
                            }];
                        }
                    }
                }
            }
        }

        return [];
    });

    const onOperationClick = (operationWithForeignKey: OperationWithForeignKey) => {
        setDropDownOpen(false);
        setSelectedOperation({
            operation: operationWithForeignKey.operation,
            responseSchemaSelectedObserver: {
                schemaRef: operationWithForeignKey.foreignKey.schemaRef,
                onValueSelected: foreignObject => {
                    const newSelectedObject: SelectedObject = {
                        value: foreignObject,
                        schemaRef: operationWithForeignKey.foreignKey.schemaRef,
                        apiSpecId: operationWithForeignKey.operation.apiSpec.id
                    };

                    // TODO cache

                    updatableValue.onValueUpdate(foreignObject[operationWithForeignKey.foreignKey.propertyName]);
                    setSelectedOperation(undefined);
                },
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setDropDownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [containerRef])

    useEffect(() => {
        if (hasFocus && inputValue.length === 0) {
            setDropDownOpen(true);
        } else if (inputValue.length > 0) {
            setDropDownOpen(false);
        }
    }, [inputValue, hasFocus])

    return (
        <>
            <Box
                ref={containerRef}
                sx={{ position: 'relative' }}>
                <Input
                    sx={{
                        ...sx,
                        "--Input-placeholderOpacity": 0.2
                    }}
                    type={type}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled || readOnly}
                    onChange={(event) => { onInputChange(event); setInputValue(event.target.value); }}
                    slotProps={{
                        input: {
                            min: min,
                            max: max,
                        }
                    }}
                    onFocus={() => { setDropDownOpen(true); setHasFocus(true); }}
                    onBlur={() => { setHasFocus(false); }}
                    readOnly={readOnly} />

                {dropDownOpen && (
                    <Box sx={{ position: 'absolute', width: '100%', zIndex: 2 }}>
                        <MenuList sx={{ borderRadius: '8px' }}>
                            {relevantOperations.map((op) => (
                                <MenuItem
                                    key={`menu-item-${op.operation.getOperationId()}`}
                                    onClick={() => onOperationClick(op)}>
                                    <OperationLabel operation={op.operation} mode={"human"} />
                                </MenuItem>
                            ))}
                            {menu?.items.map((item) => (
                                <MenuItem
                                    key={item.text}
                                    onClick={() => { item.onClick(); setDropDownOpen(false); }}>
                                    {item.text}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Box>
                )}
            </Box>
            {(selectedOperation) &&
                <ModalOperationResponseSchemaSelector
                    open={true}
                    onCancel={() => setSelectedOperation(undefined)}
                    operation={selectedOperation.operation}
                    responseSchemaSelectedObserver={selectedOperation.responseSchemaSelectedObserver}
                />}
        </>
    )
}