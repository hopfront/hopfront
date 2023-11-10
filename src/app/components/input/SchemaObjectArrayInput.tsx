import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { getObjectHumanLabelValue, getObjectPropertyNames } from "@/app/lib/openapi/utils";
import { Add } from "@mui/icons-material";
import { Box, Chip, ChipDelete, Typography } from "@mui/joy";
import { OpenAPIV3 } from "openapi-types";
import { useEffect, useState } from "react";
import { MarkdownFormHelperText } from "./MarkdownFormHelperText";
import { ModalFormObject } from "../modal/ModalFormObject";
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import {ApiContext} from "@/app/lib/model/ApiContext";

interface SchemaObjectArrayInputProps {
    sx?: {}
    arrayUpdatableValue: UpdatableValue<any>
    arraySchema: ArraySchemaObject
    disabled?: boolean
    apiContext: ApiContext
}

export const SchemaObjectArrayInput = ({ sx, arrayUpdatableValue, arraySchema, disabled = false, apiContext }: SchemaObjectArrayInputProps) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [items, setItems] = useState<{}[]>([]);
    const [currentItem, setCurrentItem] = useState<{} | undefined>(undefined);
    const [modalKey, setModalKey] = useState(0);

    const callback = arrayUpdatableValue.onValueUpdate

    useEffect(() => {
        callback(items);
    }, [items, callback])

    function onModalValueUpdate(newValue: any) {
        if (!newValue) {
            return;
        }

        if (currentItem) { // we update
            setItems((items) =>
                items.map((item) => item === currentItem ? newValue : item)
            );
            setCurrentItem(undefined);
        } else { // we create
            setItems((value) => [...value, newValue]);
        }
    }

    function onAdd() {
        setCurrentItem(undefined);
        switchModal()
    }

    function removeItem(index: number) {
        const updatedItems = items.filter((_, itemIndex) => itemIndex !== index);
        setItems(updatedItems);
    }

    function onItemClick(index: number) {
        setCurrentItem(items[index]);
        switchModal();
    }

    // note: value update is directly handle by onModalValueUpdate()
    function onModalSubmit() {
        switchModal();
    }

    function onCancel() {
        switchModal();
        setCurrentItem(undefined);
    }

    function switchModal() {
        setModalOpen((value) => !value);
        setModalKey((value) => value + 1); // hack to refresh modal to get the most fresh data of currentItem
    }

    function getItemLabel(item: { [key: string]: any }): String {
        const humanKey = getObjectHumanLabelValue(item);
        const humanLabel = humanKey ? item[humanKey] : undefined;
        const firstKey = getObjectPropertyNames(item)[0]
        const firstValue = item[firstKey];
        return humanLabel ? humanLabel : `${firstKey}:${firstValue}`
    }

    return (
        <Box sx={{ ...sx }}>
            <Typography
                level="h4"
                fontWeight="lg"
                gutterBottom
                sx={{mt: 2}}>
                Parameters Array
            </Typography>
            <MarkdownFormHelperText text="You can choose multiple item to send" />
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                {items.map((item, index) => {
                    return (
                        <Chip
                            key={index}
                            size="md"
                            onClick={() => onItemClick(index)}
                            endDecorator={
                                <ChipDelete variant="soft" onDelete={() => { removeItem(index) }} />
                            }>
                            {getItemLabel(item)}
                        </Chip>
                    )
                })}
                <Chip
                    disabled={disabled}
                    onClick={onAdd}
                    variant='outlined'
                    color='primary'
                    endDecorator={<Add />}>Add</Chip>
            </Box>
            <ModalFormObject
                key={modalKey}
                open={isModalOpen}
                updatableValue={{
                    value: currentItem,
                    onValueUpdate: onModalValueUpdate
                }}
                onCancel={onCancel}
                schema={arraySchema.items}
                apiContext={apiContext}
                onSubmit={onModalSubmit} />
        </Box>

    );
}