import {ParameterWithValue} from "@/app/lib/model/ParameterWithValue";
import {ParameterExtension} from "@/app/lib/dto/OpenApiExtensions";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {OperationParameterFormControlInput} from "@/app/components/input/OperationParameterFormControlInput";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {Stack} from "@mui/joy";

export interface ParametersFormControlInputsProps {
    operation: StandaloneOperation
    parameters: ParameterWithValue[],
    extensions: ParameterExtension[],
    onValueChanged: (parameter: ParameterWithValue) => void,
    readonly: boolean,
    apiContext: ApiContext
}

export const OperationParametersFormControlInputs = ({
                                                         operation,
                                                         parameters,
                                                         extensions,
                                                         onValueChanged,
                                                         readonly,
                                                         apiContext
                                                     }: ParametersFormControlInputsProps) => {
    return (
        <Stack maxWidth={'90%'}>
            {parameters.map(param => {
                return <OperationParameterFormControlInput
                    key={`param-${param.parameter.name}`}
                    operation={operation}
                    parameter={param}
                    parameterExtensions={extensions}
                    onValueChanged={onValueChanged}
                    readonly={readonly}
                    apiContext={apiContext}/>
            })}
        </Stack>
    )
}