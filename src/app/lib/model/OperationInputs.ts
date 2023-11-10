import {ParameterWithValue} from "@/app/lib/model/ParameterWithValue";
import {OperationBody} from "@/app/lib/model/OperationBody";

export interface OperationInputs {
    body: OperationBody | undefined;
    parameters: ParameterWithValue[];
}
