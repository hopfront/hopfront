import { ApiContext, SchemaOrReference } from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { randomInternalId, resolveSchemaFromSchemaOrReference } from "@/app/lib/openapi/utils";
import { ArrayItemInput } from "@/app/components/input/ArrayItemInput";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { OpenAPIV3 } from "openapi-types";
import { useEffect, useState } from "react";
import { ModalFormObject } from "../modal/ModalFormObject";
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import Typography from "@mui/joy/Typography";
import { ForeignKey } from "@/app/lib/dto/OpenApiExtensions";

interface ArrayItem {
    internalId: string
    value: any | undefined
}

export interface ArrayInputProps {
    updatableValue: UpdatableValue<any[]>
    schema: SchemaOrReference
    apiContext: ApiContext
    foreignKeys: ForeignKey[]
}

const RANDOM_INTERNAL_ID_LENGTH = 8;

export const ArrayInput = ({ updatableValue, schema, apiContext, foreignKeys }: ArrayInputProps) => {
    const [creationModalOpen, setCreationModalOpen] = useState(false);
    const [modalRefresher, setModalRefresher] = useState(0);

    const defaultArrayItems = (updatableValue.value || []).map(updatableValue => {
        return {
            value: updatableValue,
            internalId: randomInternalId(RANDOM_INTERNAL_ID_LENGTH)
        } as ArrayItem;
    });

    const [items, setItems] = useState<ArrayItem[]>(defaultArrayItems);

    useEffect(() => {
        if (!creationModalOpen) {
            setModalRefresher((value) => value + 1);
        }
    }, [creationModalOpen])

    const onDeleteClick = (internalId: string) => {
        const updatedItems = [...items].filter(value => value.internalId !== internalId);
        setItems(updatedItems);
    }

    const onAddClick = () => {
        setCreationModalOpen(true);
    }

    const onCreateObjectItem = (value: any) => {
        const updatedItems = [...items];

        updatedItems.push({
            internalId: randomInternalId(RANDOM_INTERNAL_ID_LENGTH),
            value: value
        });

        setItems(updatedItems);
        updatableValue.onValueUpdate(updatedItems.map(item => item.value));
    }

    const onArrayItemUpdate = (internalId: string, value: any) => {
        const updatedItems = [...items];
        const item = updatedItems.find(i => i.internalId === internalId);

        if (!item) {
            throw new Error(`Couldn't find item with internalId=${internalId}`);
        }

        item.value = value;
        setItems(updatedItems);
        updatableValue.onValueUpdate(updatedItems.map(item => item.value));
    }

    const arraySchemaObject =
        resolveSchemaFromSchemaOrReference(schema, apiContext.apiSpec.document) as ArraySchemaObject;

    if (arraySchemaObject.type !== "array") {
        return <Typography>Invalid schema type {arraySchemaObject.type} for array input</Typography>
    }

    return (
        <Stack direction="column" spacing={1}>
            {items.map(item => {
                return <ArrayItemInput
                    foreignKeys={foreignKeys}
                    key={item.internalId}
                    updatableValue={{
                        value: item.value,
                        onValueUpdate: (value) => onArrayItemUpdate(item.internalId, value),
                    }}
                    schema={arraySchemaObject.items}
                    onDeleteClick={() => onDeleteClick(item.internalId)}
                    apiContext={apiContext} />
            })}
            <Button
                variant="outlined"
                startDecorator={<Add />}
                onClick={onAddClick}>
                Add
            </Button>
            <ModalFormObject
                key={modalRefresher}
                open={creationModalOpen}
                updatableValue={{
                    value: undefined,
                    onValueUpdate: (value) => {
                        setCreationModalOpen(false);
                        onCreateObjectItem(value);
                    }
                }}
                onCancel={() => setCreationModalOpen(false)}
                schema={arraySchemaObject.items}
                apiContext={apiContext}
            />
        </Stack>
    );
}