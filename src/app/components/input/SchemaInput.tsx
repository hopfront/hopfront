import { ArrayInput } from "@/app/components/input/ArrayInput";
import { BooleanInput } from "@/app/components/input/BooleanInput";
import { InputMenu } from "@/app/components/input/InputMenu";
import { NotHandledFormControlInput } from "@/app/components/input/NotHandledFormControlInput";
import { ObjectInput } from "@/app/components/input/ObjectInput";
import { StringInput } from "@/app/components/input/StringInput";
import { ForeignKey } from "@/app/lib/dto/OpenApiExtensions";
import { ApiContext, SchemaOrReference } from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { resolveSchemaFromSchemaOrReference } from "@/app/lib/openapi/utils";
import SmartManualInput from "./SmartManualInput";

export interface SchemaInputProps {
    updatableValue: UpdatableValue<any>
    schema?: SchemaOrReference
    required?: boolean
    readOnly?: boolean
    menu?: InputMenu
    foreignKeys: ForeignKey[]
    apiContext?: ApiContext
}

export const SchemaInput = ({
    updatableValue,
    schema,
    required,
    readOnly,
    menu,
    foreignKeys,
    apiContext
}: SchemaInputProps) => {
    if (!schema || !apiContext) {
        return <StringInput
            updatableValue={updatableValue}
            schemaObject={{ type: 'string' }}
            required={false}
        />;
    }

    const schemaObject = resolveSchemaFromSchemaOrReference(schema, apiContext.apiSpec.document);

    switch (schemaObject.type) {
        case "object":
            return <ObjectInput
                updatableValue={updatableValue}
                schema={schema}
                apiContext={apiContext} />;
        case "array":
            return <ArrayInput
                updatableValue={updatableValue}
                schema={schema}
                apiContext={apiContext}
                foreignKeys={foreignKeys} />;
        case "boolean":
            return <BooleanInput
                updatableValue={updatableValue}
                schemaObject={schemaObject} />;
        case "integer":
        case "number":
            return <SmartManualInput
                type="number"
                foreignKeys={foreignKeys}
                updatableValue={updatableValue}
                schemaObject={schemaObject}
                required={required}
                readOnly={readOnly}
                menu={menu}
            />
        case "string":
            return <SmartManualInput
                type="string"
                foreignKeys={foreignKeys}
                updatableValue={updatableValue}
                schemaObject={schemaObject}
                required={required}
                readOnly={readOnly}
                menu={menu}
            />
        default:
            return <NotHandledFormControlInput />;
    }
}