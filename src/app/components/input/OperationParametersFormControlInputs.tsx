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
    disabled: boolean,
    debounceMillis: number,
    apiContext: ApiContext
}

export const OperationParametersFormControlInputs = ({
                                                         operation,
                                                         parameters,
                                                         extensions,
                                                         onValueChanged,
                                                         disabled,
                                                         debounceMillis,
                                                         apiContext
                                                     }: ParametersFormControlInputsProps) => {
    return (
        <Stack maxWidth={400}>
            {parameters.map(param => {
                return <OperationParameterFormControlInput
                    key={`param-${param.parameter.name}`}
                    operation={operation}
                    parameter={param}
                    parameterExtensions={extensions}
                    onValueChanged={onValueChanged}
                    disabled={disabled}
                    debounceMillis={debounceMillis}
                    apiContext={apiContext}/>
            })}
        </Stack>
    )
}