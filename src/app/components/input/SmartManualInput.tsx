'use client'

import { useApiSpecs } from "@/app/hooks/useApiSpecs";
import { ForeignKey } from "@/app/lib/dto/OpenApiExtensions";
import { SchemaOrReference } from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { getStandaloneOperations } from "@/app/lib/openapi/utils";
import { Box, Input, MenuItem, MenuList } from "@mui/joy";
import { OpenAPIV3 } from "openapi-types";
import { HTMLInputTypeAttribute, useContext, useEffect, useRef, useState } from "react";
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
import { AdminContext, shouldShowAdminContent } from "@/app/context/AdminContext";

export interface SmartManualInputProps {
    updatableValue: UpdatableValue<any>
    type: HTMLInputTypeAttribute
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
    placeholder,
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
    const adminContext = useContext(AdminContext);

    const { data: apiSpecs } = useApiSpecs();
    const [dropDownOpen, setDropDownOpen] = useState(false);
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
        if (hasFocus && (!updatableValue.value || updatableValue.value.length === 0)) {
            setDropDownOpen(true);
        } else if (updatableValue.value && updatableValue.value.length > 0) {
            setDropDownOpen(false);
        }
    }, [updatableValue, hasFocus])

    // We do not show item menu if admin mode is enabled and admin is not logged in.
    const hasMenuItem = (menu?.items && menu.items.length > 0) === true && (adminContext.adminStatus?.isEnabled !== true || adminContext.isAuthenticated)
    const isSmartDropDownEnabled = relevantOperations.length > 0 || hasMenuItem;

    return (
        <>
            <Box
                ref={containerRef}
                sx={{ position: 'relative' }}>
                <Input
                    sx={{
                        ...sx,
                    }}
                    type={type}
                    //defaultValue={updatableValue.value}
                    value={updatableValue.value}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled || readOnly}
                    onChange={(event) => updatableValue.onValueUpdate(event.target.value)}
                    slotProps={{
                        input: {
                            min: min,
                            max: max,
                        }
                    }}
                    onFocus={() => { setDropDownOpen(true); setHasFocus(true); }}
                    onBlur={() => { setHasFocus(false); }}
                    readOnly={readOnly} />

                {isSmartDropDownEnabled && dropDownOpen && (
                    <Box sx={{ position: 'absolute', width: '100%', zIndex: 2 }}>
                        <MenuList sx={{ borderRadius: '8px' }}>
                            {relevantOperations.map((op) => (
                                <MenuItem
                                    key={`menu-item-${op.operation.getOperationId()}`}
                                    onClick={() => onOperationClick(op)}>
                                    <OperationLabel operation={op.operation} mode={"human"} />
                                </MenuItem>
                            ))}
                            {shouldShowAdminContent(adminContext) && menu?.items.map((item) => (
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