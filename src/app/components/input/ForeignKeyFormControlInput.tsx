import { ForeignKey } from "@/app/lib/dto/OpenApiExtensions";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import {
    getSchemaByRef,
    getStandaloneOperations
} from "@/app/lib/openapi/utils";
import { Edit } from "@mui/icons-material";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { OpenAPIV3 } from "openapi-types";
import React, { useEffect, useRef, useState } from "react";
import { MarkdownFormHelperText } from "./MarkdownFormHelperText";
import ResponseObject = OpenAPIV3.ResponseObject;
import ReferenceObject = OpenAPIV3.ReferenceObject;
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import { SchemaOrReference } from "@/app/lib/model/ApiContext";
import SchemaObject = OpenAPIV3.SchemaObject;
import { useApiSpecs } from "@/app/hooks/useApiSpecs";
import ButtonGroup from "@mui/joy/ButtonGroup";
import { IconButton, Menu, MenuItem } from "@mui/joy";
import { SelectedObjectButton } from "@/app/components/input/SelectedObjectButton";
import { ModalOperationResponseSchemaSelector } from "@/app/components/foreign-keys/ModalOperationResponseSchemaSelector";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { ResponseSchemaSelectedObserver } from "@/app/lib/model/ResponseSchemaSelectedObserver";
import { useApiContext } from "@/app/hooks/useApiContext";
import { OperationLabel } from "@/app/components/typography/OperationLabel";
import Typography from "@mui/joy/Typography";

const getForeignKeyWithinSchema = (schemaRef: ReferenceObject, foreignKeys: ForeignKey[], document: OpenAPIV3.Document): ForeignKey | undefined => {
    return foreignKeys.find(foreignKey => schemaContainsForeignKey(schemaRef, foreignKey, document));
}

const schemaContainsPropertyName = (schema: SchemaObject, propertyName: string): boolean => {
    for (const otherSchemaPropertyName in schema.properties) {
        if (otherSchemaPropertyName === propertyName) {
            return true;
        }
    }

    return false;
}

const schemaContainsForeignKey = (schemaRef: ReferenceObject, foreignKey: ForeignKey, document: OpenAPIV3.Document): boolean => {
    const schema = getSchemaByRef(schemaRef.$ref, document);

    if (schemaRef.$ref === foreignKey.schemaRef) {
        if (schemaContainsPropertyName(schema, foreignKey.propertyName)) {
            return true;
        }
    } else {
        for (const schemaPropertyName in schema.properties) {
            const schemaProperty = schema.properties[schemaPropertyName];

            if (schemaProperty.hasOwnProperty('$ref')) {
                const schemaPropertyRef = schemaProperty as ReferenceObject;

                if (schemaRef.$ref !== schemaPropertyRef.$ref) {
                    if (schemaContainsForeignKey(schemaPropertyRef, foreignKey, document)) {
                        return true;
                    }
                }
            } else {
                const schemaPropertySchema = schemaProperty as SchemaObject;

                if (schemaPropertySchema.type === 'array') {
                    if (schemaPropertySchema.items.hasOwnProperty('$ref')) {
                        const schemaPropertyItemsRef = schemaPropertySchema.items as ReferenceObject;

                        if (schemaRef.$ref !== schemaPropertyItemsRef.$ref) {
                            if (schemaContainsForeignKey(schemaPropertyItemsRef, foreignKey, document)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }

    return false;
}

const getCachedSelectedObject = (cacheKey: string | undefined): any | undefined => {
    try {
        const persistedObjectString = cacheKey ? localStorage.getItem(cacheKey) : undefined;

        return persistedObjectString
            ? JSON.parse(persistedObjectString) as SelectedObject
            : undefined;
    } catch (error: any) {
        return undefined;
    }
}

interface SelectedObject {
    value: any
    schemaRef?: string
    apiSpecId: string
}

interface SelectedOperation {
    operation: StandaloneOperation
    responseSchemaSelectedObserver: ResponseSchemaSelectedObserver
}

interface OperationWithForeignKey {
    operation: StandaloneOperation
    foreignKey: ForeignKey;
}

export interface ForeignKeyFormControlInputProps {
    updatableValue: UpdatableValue<any>
    inputLabel?: string
    inputDescription?: string
    foreignKeys: ForeignKey[]
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    cacheKey?: string
    icon?: React.ReactNode
}

export const ForeignKeyFormControlInput = ({
    updatableValue,
    inputLabel,
    inputDescription,
    foreignKeys,
    required,
    disabled,
    readOnly,
    cacheKey,
    icon = <Edit />
}: ForeignKeyFormControlInputProps) => {


    const persistedSelectedObject = getCachedSelectedObject(cacheKey);

    const cachedValue = foreignKeys
        .flatMap(fk => {
            const persistedValue = persistedSelectedObject && persistedSelectedObject.value[fk.propertyName];

            if (persistedValue) {
                return [persistedValue];
            } else {
                return [];
            }
        })
        .find(anyFk => true);

    if (cachedValue && cachedValue != updatableValue.value) {
        updatableValue.onValueUpdate(cachedValue);
    }

    const { data: apiSpecs, error, isLoading } = useApiSpecs();
    const [selectedObject, setSelectedObject] = useState<SelectedObject | undefined>(persistedSelectedObject);
    const [menuItemOpen, setMenuItemOpen] = useState(false);
    const actionRef = useRef<() => void | null>(null);
    const anchorRef = useRef<HTMLDivElement>(null);

    // This part is because JoyUI ButtonGroup is buggy (menu does not close when user clicked outside of it).
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuItemOpen(false);
            }
        }
        if (menuItemOpen) {
            document.addEventListener('click', handleDocumentClick);
        }
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [menuItemOpen]);
    // ---- 

    const allOperations = apiSpecs
        ? apiSpecs.apiSpecs.flatMap(apiSpec => getStandaloneOperations(apiSpec))
        : [];

    const [selectedOperation, setSelectedOperation] = useState<SelectedOperation | undefined>();

    const { data: apiContext } = useApiContext(selectedOperation?.operation.apiSpec.id);

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
        setMenuItemOpen(false);
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

                    setSelectedObject(newSelectedObject);

                    if (cacheKey) {
                        localStorage.setItem(cacheKey, JSON.stringify(newSelectedObject));
                    }

                    updatableValue.onValueUpdate(foreignObject[operationWithForeignKey.foreignKey.propertyName]);
                    setMenuItemOpen(false);
                    setSelectedOperation(undefined);
                },
            }
        });
    };

    return (
        <FormControl disabled={disabled}>
            <FormLabel>
                {inputLabel}
                {required ? <Typography level="body-xs" color="danger">*</Typography> : ''}
            </FormLabel>
            <ButtonGroup
                ref={anchorRef}
                variant="outlined"
                aria-label="split button"
            >
                <SelectedObjectButton
                    selectedObject={selectedObject?.value || updatableValue.value}
                    selectedSchemaRef={selectedObject?.schemaRef}
                    apiSpecId={selectedObject?.apiSpecId} />
                {!readOnly &&
                    <IconButton
                        color="primary"
                        variant="outlined"
                        disabled={disabled || relevantOperations.length === 0}
                        aria-controls={menuItemOpen ? 'split-button-menu' : undefined}
                        aria-expanded={menuItemOpen ? 'true' : undefined}
                        aria-label="select object"
                        aria-haspopup="menu"
                        onMouseDown={() => {
                            if (relevantOperations.length !== 1) {
                                // @ts-ignore
                                actionRef.current = () => setMenuItemOpen(!menuItemOpen);
                            }
                        }}
                        onKeyDown={() => {
                            if (relevantOperations.length !== 1) {
                                // @ts-ignore
                                actionRef.current = () => setMenuItemOpen(!menuItemOpen);
                            }
                        }}
                        onClick={() => {
                            if (relevantOperations.length === 1) {
                                onOperationClick(relevantOperations[0]);
                            } else {
                                actionRef.current?.();
                            }

                        }}
                    >
                        {icon}
                    </IconButton>}
            </ButtonGroup>
            <Menu
                ref={menuRef}
                sx={{
                    zIndex: 'calc(var(--joy-zIndex-modal) + 1)'
                }}
                placement="auto-start"
                open={menuItemOpen}
                onClose={() => setMenuItemOpen(false)}
                anchorEl={anchorRef.current}>
                {relevantOperations.map((operationWithForeignKey) => {
                    return (
                        <MenuItem
                            key={`menu-item-${operationWithForeignKey.operation.getOperationId()}`}
                            onClick={() => onOperationClick(operationWithForeignKey)}>
                            <OperationLabel operation={operationWithForeignKey.operation} mode={"human"} />
                        </MenuItem>
                    );
                })}
            </Menu>
            {(apiContext && selectedOperation) &&
                <ModalOperationResponseSchemaSelector
                    open={true}
                    onCancel={() => setSelectedOperation(undefined)}
                    operation={selectedOperation.operation}
                    responseSchemaSelectedObserver={selectedOperation.responseSchemaSelectedObserver}
                    apiContext={apiContext} />}
            {inputDescription &&
                <MarkdownFormHelperText text={inputDescription} />}
        </FormControl>
    )
}