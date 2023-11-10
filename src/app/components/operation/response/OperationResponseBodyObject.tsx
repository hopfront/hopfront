import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {findRunnableOperationsFromSchema, getReferenceObjectOrUndefined} from "@/app/lib/openapi/utils";
import {ButtonModalObjectOperationExecutor} from "@/app/components/operation/ButtonModalObjectOperationExecutor";
import {ObjectView} from "@/app/components/property-viewer/ObjectView";
import {OpenAPIV3} from "openapi-types";
import MediaTypeObject = OpenAPIV3.MediaTypeObject;
import {ApiContext} from "@/app/lib/model/ApiContext";
import {ResponseSchemaSelectedObserver} from "@/app/lib/model/ResponseSchemaSelectedObserver";
import {Box} from "@mui/joy";

export interface OperationResponseBodyObjectProps {
    body: any
    mediaType: MediaTypeObject
    loading?: boolean
    responseSchemaSelectedObserver?: ResponseSchemaSelectedObserver
    apiContext: ApiContext
}

export const OperationResponseBodyObject = ({
                                                body,
                                                mediaType,
                                                loading,
                                                apiContext,
                                                responseSchemaSelectedObserver
                                            }: OperationResponseBodyObjectProps) => {

    const runnableOperations = (): StandaloneOperation[] => {
        if (responseSchemaSelectedObserver) {
            return []; // we don't want to let the user "navigate away" from the pickable object
        }

        if (!mediaType.schema) {
            return [];
        }

        const schemaReference =
            getReferenceObjectOrUndefined(mediaType.schema);

        if (!schemaReference) {
            return [];
        }

        return findRunnableOperationsFromSchema(schemaReference.$ref, apiContext).map(op => op.operation);
    }

    const responseBodySchemaRef = mediaType.schema && getReferenceObjectOrUndefined(mediaType.schema);

    return (
        <Box>
            <ObjectView
                object={body}
                schemaRef={responseBodySchemaRef?.$ref}
                loading={loading}
                apiContext={apiContext}
                responseSchemaSelectedObserver={responseSchemaSelectedObserver}
            />

            <Box>
                {runnableOperations().map(op =>
                    <Box
                        key={'button' + op.getOperationId()}
                        sx={{mb: 1}}>
                        <ButtonModalObjectOperationExecutor
                            operation={op}
                            object={body}
                            objectSchema={mediaType.schema!}
                            disabled={loading}
                            apiContext={apiContext}/>
                    </Box>)}
            </Box>
        </Box>
    );
}