import {SchemaFormControlInputs} from "@/app/components/input/SchemaFormControlInputs";
import {RequestBodyDefinition} from "@/app/lib/model/RequestBodyDefinition";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {UpdatableValue} from "@/app/lib/model/UpdatableValue";

export interface OperationBodyContentInputProps {
    requestBodyDefinition: RequestBodyDefinition
    bodyContent: UpdatableValue<any>
    readonlyProperties?: string[]
    apiContext: ApiContext
}

export const OperationBodyInput = ({requestBodyDefinition, bodyContent, readonlyProperties, apiContext}: OperationBodyContentInputProps) => {
    return (
        <SchemaFormControlInputs
            inputsUpdatableValue={bodyContent}
            schema={requestBodyDefinition.schema}
            readonlyProperties={readonlyProperties}
            apiContext={apiContext}/>
    );
}