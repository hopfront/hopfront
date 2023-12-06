import {
    ApiContext,
    SchemaOrReference
} from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { SchemaInput } from "@/app/components/input/SchemaInput";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { ForeignKey } from "@/app/lib/dto/OpenApiExtensions";

export interface ArrayItemInputProps {
    updatableValue: UpdatableValue<any>
    schema: SchemaOrReference
    onDeleteClick: () => void
    apiContext: ApiContext
    foreignKeys: ForeignKey[]
}

export const ArrayItemInput = ({ updatableValue, schema, onDeleteClick, apiContext, foreignKeys }: ArrayItemInputProps) => {
    return (
        <Stack direction="row">
            <SchemaInput
                foreignKeys={foreignKeys}
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