import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { resolveSchemaFromSchemaOrReference } from "@/app/lib/openapi/utils";
import { NotHandledFormControlInput } from "@/app/components/input/NotHandledFormControlInput";
import { ArrayInput } from "@/app/components/input/ArrayInput";
import { BooleanInput } from "@/app/components/input/BooleanInput";
import { IntegerInput } from "@/app/components/input/IntegerInput";
import { ObjectInput } from "@/app/components/input/ObjectInput";
import { StringInput } from "@/app/components/input/StringInput";
import {InputMenu} from "@/app/components/input/InputMenu";

export interface SchemaInputProps {
    updatableValue: UpdatableValue<any>
    debounceMillis?: number
    schema?: SchemaOrReference
    required?: boolean
    readOnly?: boolean
    menu?: InputMenu
    apiContext?: ApiContext
}

export const SchemaInput = ({ updatableValue, schema, debounceMillis = 0, required, readOnly, menu, apiContext }: SchemaInputProps) => {
    if (!schema || !apiContext) {
        return <StringInput updatableValue={updatableValue} schemaObject={{ type: 'string' }} required={false} debounceMillis={debounceMillis} />;
    }
    
    const schemaObject = resolveSchemaFromSchemaOrReference(schema, apiContext.apiSpec.document);

    switch (schemaObject.type) {
        case "object":
            return <ObjectInput updatableValue={updatableValue} schema={schema} apiContext={apiContext} />;
        case "array":
            return <ArrayInput updatableValue={updatableValue} schema={schema} apiContext={apiContext} />;
        case "boolean":
            return <BooleanInput updatableValue={updatableValue} schemaObject={schemaObject} />;
        case "integer":
        case "number":
            return <IntegerInput
                updatableValue={updatableValue}
                schemaObject={schemaObject}
                debounceMillis={debounceMillis}
                required={required}
                readOnly={readOnly}
                menu={menu} />;
        case "string":
            return <StringInput
                updatableValue={updatableValue}
                schemaObject={schemaObject}
                debounceMillis={debounceMillis}
                required={required}
                readOnly={readOnly}
                menu={menu} />;
        default:
            return <NotHandledFormControlInput />;
    }
}