import { ApiContext, SchemaOrReference } from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { getObjectHumanLabelValue } from "@/app/lib/openapi/utils";
import { ModalFormObject } from "@/app/components/modal/ModalFormObject";
import { Create } from "@mui/icons-material";
import { Button, Chip } from "@mui/joy";
import { useState } from "react";

export interface ObjectInputProps {
    updatableValue: UpdatableValue<any>
    schema: SchemaOrReference
    apiContext: ApiContext
}

export const ObjectInput = ({ updatableValue, schema, apiContext }: ObjectInputProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const onEditClick = () => {
        setModalOpen(true);
    }

    let objectName: string | undefined;

    if (updatableValue.value) {
        if (typeof updatableValue.value === "string") {
            // Sometimes an input will have the "object" type even though the value is a string (why?)
            objectName = updatableValue.value;
        } else {
            const mainProperty = getObjectHumanLabelValue(updatableValue.value);
            objectName = mainProperty ? updatableValue.value[mainProperty] : undefined;
            Object.keys(updatableValue.value).forEach(key => {
                if (objectName) {
                    return;
                }
                if (updatableValue.value[key]) {
                    objectName = `${key}: ${updatableValue.value[key]}`
                    return;
                }
            })
        }
    } else {
        objectName = 'object'
    }

    return (
        <>
            {updatableValue.value ? (
                <Chip onClick={onEditClick} variant='outlined'>
                    {objectName}
                </Chip>
            ) : (
                <Button variant="outlined" startDecorator={<Create />} onClick={onEditClick}>
                    Add
                </Button>
            )}
            <ModalFormObject
                open={modalOpen}
                updatableValue={{
                    value: updatableValue.value,
                    onValueUpdate: (value) => {
                        setModalOpen(false);
                        updatableValue.onValueUpdate(value);
                    }
                }}
                onCancel={() => setModalOpen(false)}
                schema={schema}
                apiContext={apiContext}
            />
        </>
    );
}