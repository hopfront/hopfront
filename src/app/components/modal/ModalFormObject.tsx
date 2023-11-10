import { ApiContext, SchemaOrReference } from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { Button } from "@mui/joy";
import { ChangeEvent, useState } from "react";
import { ResponsiveModal } from "./ResponsiveModal";
import { SchemaFormControlInputs } from "../input/SchemaFormControlInputs";

export interface ModalFormObjectProps {
    open: boolean
    updatableValue: UpdatableValue<any>
    onCancel: (reason: string) => void
    schema: SchemaOrReference
    onSubmit?: () => void
    apiContext: ApiContext
}

export const ModalFormObject = ({ open, updatableValue, onCancel, schema, apiContext, onSubmit }: ModalFormObjectProps) => {
    const [value, setValue] = useState<any | undefined>(updatableValue.value);

    function onFormUpdateSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
        event.stopPropagation();
        updatableValue.onValueUpdate(value);
        onSubmit ? onSubmit() : {};
    }

    return (
        <ResponsiveModal open={open} onClose={(_, reason) => { onCancel(reason) }}>
            <form onSubmit={onFormUpdateSubmit}>
                <SchemaFormControlInputs
                    inputsUpdatableValue={{
                        value: value,
                        onValueUpdate: newValue => setValue(newValue),
                    }}
                    schema={schema}
                    apiContext={apiContext} />
                <Button type="submit">OK</Button>
            </form>
        </ResponsiveModal>
    );
}