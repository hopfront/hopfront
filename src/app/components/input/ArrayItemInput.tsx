import {
    ApiContext,
    SchemaOrReference
} from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { SchemaInput } from "@/app/components/input/SchemaInput";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import Stack from "@mui/joy/Stack";

export interface ArrayItemInputProps {
    updatableValue: UpdatableValue<any>
    schema: SchemaOrReference
    onDeleteClick: () => void
    apiContext: ApiContext
}

export const ArrayItemInput = ({ updatableValue, schema, onDeleteClick, apiContext }: ArrayItemInputProps) => {
    return (
        <Stack direction="row">
            <SchemaInput
                updatableValue={updatableValue}
                schema={schema}
                required={false}
                apiContext={apiContext} />
            <IconButton
                onClick={onDeleteClick}
                color="danger"
                variant="plain">
                <Delete />
            </IconButton>
        </Stack>
    );
}