import {SchemaFormControlInput} from "@/app/components/input/SchemaFormControlInput";
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {UpdatableValue} from "@/app/lib/model/UpdatableValue";
import {ForeignKeyFormControlInput} from "@/app/components/input/ForeignKeyFormControlInput";
import {PropertyExtension} from "@/app/lib/dto/OpenApiExtensions";
import {resolveSchemaFromSchemaOrReference} from "@/app/lib/openapi/utils";
import {InputMenu} from "@/app/components/input/InputMenu";
import React, {useState} from "react";
import {AutoFixHigh, Settings} from "@mui/icons-material";
import {SchemaPropertyFetchValueModal} from "@/app/components/foreign-keys/SchemaPropertyFetchValueModal";
import {useRouter} from "next/navigation";

export interface SchemaPropertyFormControlInputProps {
    propertyParentSchemaRef?: string
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
                                                   propertyParentSchemaRef,
                                                   propertyName,
                                                   propertySchema,
                                                   propertyExtension,
                                                   updatableValue,
                                                   required,
                                                   disabled,
                                                   readOnly,
                                                   apiContext
                                               }: SchemaPropertyFormControlInputProps) => {

    const router = useRouter();
    const [fetchValueModalOpen, setFetchValueModalOpen] = useState(false);

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
        const buildSchemaFormControlInput = (menu: InputMenu | undefined) => {
            return <SchemaFormControlInput
                label={propertyName}
                updatableValue={updatableValue}
                schema={propertySchema}
                required={required}
                disabled={disabled}
                readOnly={readOnly}
                menu={menu}
                apiContext={apiContext}/>;
        }

        return (
            <>
                {buildSchemaFormControlInput(propertyParentSchemaRef ? {
                    icon: Settings,
                    items: [{
                        icon: AutoFixHigh,
                        text: 'Fetch value from an other operation',
                        onClick: () => setFetchValueModalOpen(true)
                    }]
                } : undefined)}
                {propertyParentSchemaRef && <SchemaPropertyFetchValueModal
                    open={fetchValueModalOpen}
                    onClose={() => setFetchValueModalOpen(false)}
                    onConfigurationUpdate={() => {
                        setFetchValueModalOpen(false);
                        router.refresh();
                    }}
                    property={{
                        schemaRef: propertyParentSchemaRef,
                        propertyName: propertyName
                    }}
                    propertyRequired={required || false}
                    inputWithoutForeignKeyPreview={buildSchemaFormControlInput(undefined)}
                    apiContext={apiContext}/>}
            </>
        );
    }
}