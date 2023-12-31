import { SchemaPropertyFetchValueModal } from "@/app/components/foreign-keys/SchemaPropertyFetchValueModal";
import { InputMenu } from "@/app/components/input/InputMenu";
import { SchemaFormControlInput } from "@/app/components/input/SchemaFormControlInput";
import { PropertyExtension } from "@/app/lib/dto/OpenApiExtensions";
import { ApiContext, SchemaOrReference } from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { AutoFixHigh, Settings } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

    const buildSchemaFormControlInput = (menu: InputMenu | undefined) => {
        return <SchemaFormControlInput
            label={propertyName}
            updatableValue={updatableValue}
            schema={propertySchema}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            menu={menu}
            foreignKeys={propertyExtension?.foreignKeys ?? []}
            apiContext={apiContext} />;
    }

    const getInputMenu = (propertyParentSchemaRef: string | undefined) => {
        return propertyParentSchemaRef ? {
            icon: Settings,
            items: [{
                icon: AutoFixHigh,
                text: 'Fetch value from an other operation',
                onClick: () => setFetchValueModalOpen(true)
            }]
        } : undefined
    }

    return (
        <>
            {buildSchemaFormControlInput(getInputMenu(propertyParentSchemaRef))}
            {propertyParentSchemaRef &&
                <SchemaPropertyFetchValueModal
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
                    apiContext={apiContext} />}
        </>
    );
}