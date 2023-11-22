import { OperationParameterFetchValueModal } from "@/app/components/foreign-keys/OperationParameterFetchValueModal";
import { ForeignKeyFormControlInput } from "@/app/components/input/ForeignKeyFormControlInput";
import { InputMenu } from "@/app/components/input/InputMenu";
import { SchemaFormControlInput } from "@/app/components/input/SchemaFormControlInput";
import { ParameterExtension } from "@/app/lib/dto/OpenApiExtensions";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { ParameterWithValue } from "@/app/lib/model/ParameterWithValue";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { AutoFixHigh, Settings } from "@mui/icons-material";
import { Box } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";

export interface OperationParameterFormControlInputProps {
    operation: StandaloneOperation
    parameter: ParameterWithValue
    parameterExtensions?: ParameterExtension[]
    onValueChanged: (value: ParameterWithValue) => void
    disabled?: boolean
    debounceMillis?: number
    apiContext: ApiContext
}

const INPUT_MARGIN_BOTTOM = 2;

export const OperationParameterFormControlInput = ({
    operation,
    parameter,
    parameterExtensions = [],
    onValueChanged,
    disabled,
    debounceMillis,
    apiContext
}: OperationParameterFormControlInputProps) => {

    const router = useRouter();
    const [fetchValueModalOpen, setFetchValueModalOpen] = useState(false);

    const parameterExtension = parameterExtensions.find(p => p.parameterName === parameter.parameter.name);

    const buildSchemaFormControlInput = (menu: InputMenu | undefined) => {
        return <SchemaFormControlInput
            updatableValue={{
                value: parameter.value,
                onValueUpdate: value => {
                    onValueChanged({
                        parameter: parameter.parameter,
                        value: value,
                        readonly: parameter.readonly,
                    });
                }
            }}
            label={parameter.parameter.name}
            schema={parameter.parameter.schema}
            required={parameter.parameter.required || false}
            disabled={disabled}
            debounceMillis={debounceMillis}
            menu={menu}
            apiContext={apiContext} />;
    }

    if (parameterExtension && parameterExtension.foreignKeys.length > 0) {
        return (
            <Box key={parameter.parameter.name} sx={{ mb: INPUT_MARGIN_BOTTOM }}>
                <ForeignKeyFormControlInput
                    inputDescription={parameter.parameter.description}
                    inputLabel={parameter.parameter.name}
                    updatableValue={{
                        value: parameter.value,
                        onValueUpdate: (value) => {
                            onValueChanged({
                                parameter: parameter.parameter,
                                value: value,
                                readonly: parameter.readonly
                            });
                        }
                    }}
                    disabled={disabled || parameter.readonly}
                    foreignKeys={parameterExtension.foreignKeys}
                    cacheKey={`api:${apiContext.apiSpec.id}:operation:${operation.path}:parameter:${parameter.parameter.name}`}
                    schema={parameter.parameter.schema}
                    apiContext={apiContext}
                />
            </Box>
        );
    } else {
        return (
            <Box key={parameter.parameter.name} sx={{ mb: INPUT_MARGIN_BOTTOM }}>
                {buildSchemaFormControlInput({
                    icon: Settings,
                    items: [{
                        icon: AutoFixHigh,
                        text: 'Fetch value from an other operation',
                        onClick: () => setFetchValueModalOpen(true)
                    }]
                })}
                <OperationParameterFetchValueModal
                    operation={operation}
                    parameter={parameter.parameter}
                    open={fetchValueModalOpen}
                    onClose={() => setFetchValueModalOpen(false)}
                    onConfigurationUpdate={() => {
                        setFetchValueModalOpen(false);
                        router.refresh();
                    }}
                    inputWithoutForeignKeyPreview={buildSchemaFormControlInput(undefined)}
                    apiContext={apiContext} />
            </Box>
        );
    }
}