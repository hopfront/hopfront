import {SchemaFormControlInput} from "@/app/components/input/SchemaFormControlInput";
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {UpdatableValue} from "@/app/lib/model/UpdatableValue";
import {ForeignKeyFormControlInput} from "@/app/components/input/ForeignKeyFormControlInput";
import {PropertyExtension} from "@/app/lib/dto/OpenApiExtensions";
import {resolveSchemaFromSchemaOrReference} from "@/app/lib/openapi/utils";

export interface SchemaPropertyFormControlInputProps {
    propertyName: string
    propertySchema: SchemaOrReference
    propertyExtension?: PropertyExtension
    updatableValue: UpdatableValue<any>
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    apiContext: ApiContext
}

export const SchemaPropertyFormControlInput = ({
                                                   propertyName,
                                                   propertySchema,
                                                   propertyExtension,
                                                   updatableValue,
                                                   required,
                                                   disabled,
                                                   readOnly,
                                                   apiContext
                                               }: SchemaPropertyFormControlInputProps) => {

    const propertySchemaObject =
        resolveSchemaFromSchemaOrReference(propertySchema, apiContext.apiSpec.document);

    if (propertyExtension && propertyExtension.foreignKeys.length > 0) {
        return (
            <ForeignKeyFormControlInput
                updatableValue={updatableValue}
                inputLabel={propertyName}
                inputDescription={propertySchemaObject.description}
                foreignKeys={propertyExtension.foreignKeys}
                required={required}
                disabled={disabled}
                readOnly={readOnly}/>
        );
    } else {
        return <SchemaFormControlInput
            label={propertyName}
            updatableValue={updatableValue}
            schema={propertySchema}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            apiContext={apiContext}/>;
    }
}