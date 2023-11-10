import {UpdatableValue} from "@/app/lib/model/UpdatableValue";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import {OpenAPIV3} from "openapi-types";
import {MarkdownFormHelperText} from "./MarkdownFormHelperText";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import {SchemaInput} from "@/app/components/input/SchemaInput";
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {InputMenu} from "@/app/components/input/InputMenu";
import Typography from "@mui/joy/Typography";

const getDescription = (schema: SchemaOrReference | undefined): string | undefined => {
    if (schema && schema.hasOwnProperty('description')) {
        const nonArraySchema = schema as NonArraySchemaObject;
        return nonArraySchema.description;
    } else {
        return undefined;
    }
}

export interface SchemaFormControlInputProps {
    label: string
    updatableValue: UpdatableValue<any>
    schema?: SchemaOrReference
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    debounceMillis?: number
    menu?: InputMenu
    apiContext: ApiContext
}

export const SchemaFormControlInput = ({
                                           updatableValue,
                                           label,
                                           schema,
                                           required,
                                           disabled,
                                           readOnly,
                                           debounceMillis = 0,
                                           menu,
                                           apiContext
                                       }: SchemaFormControlInputProps) => {

    const description = getDescription(schema);

    return (
        <FormControl disabled={disabled}>
            <FormLabel>{label}{required ? <Typography level="body-xs" color="danger">*</Typography> : ''}</FormLabel>
            <SchemaInput
                updatableValue={updatableValue}
                schema={schema}
                required={required}
                readOnly={readOnly}
                debounceMillis={debounceMillis}
                menu={menu}
                apiContext={apiContext}/>
            {description && <MarkdownFormHelperText text={description}/>}
        </FormControl>
    );
}