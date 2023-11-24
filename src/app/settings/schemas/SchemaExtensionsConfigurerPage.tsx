import { SchemaExtensionConfigurer } from "@/app/settings/schemas/SchemaExtensionConfigurer";
import React, { useState } from "react";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { SchemaSelect } from "@/app/components/select/SchemaSelect";
import {
    findRunnableOperationsFromSchema
} from "@/app/lib/openapi/utils";
import Typography from "@mui/joy/Typography";
import Table from "@mui/joy/Table";
import { OperationLabel } from "@/app/components/typography/OperationLabel";
import {
    RunnableOperationFromSchemaReasonsTableData
} from "@/app/settings/schemas/RunnableOperationFromSchemaReasonsTableData";
import { InfoTooltipIcon } from "@/app/components/misc/InfoTooltipIcon";

export interface SchemaExtensionsConfigurerPageProps {
    apiContext: ApiContext
    readOnly: boolean
}

export const SchemaExtensionsConfigurerPage = ({ apiContext, readOnly }: SchemaExtensionsConfigurerPageProps) => {
    const [selectedSchemaRef, setSelectedSchemaRef] = useState<string | undefined>();

    const runnableOperationFromSchemas = selectedSchemaRef
        ? findRunnableOperationsFromSchema(selectedSchemaRef, apiContext)
        : [];

    return (
        <>
            <SchemaSelect
                defaultSchemaRef={selectedSchemaRef}
                onSchemaRefSelected={schemaRef => setSelectedSchemaRef(schemaRef)}
                apiContext={apiContext}
                sx={{ mb: 4 }} />

            <Typography level="title-lg" sx={{ mb: 2 }}>
                Fields
            </Typography>

            {selectedSchemaRef && <SchemaExtensionConfigurer
                schemaRef={selectedSchemaRef}
                readOnly={readOnly}
                apiContext={apiContext} />}

            {runnableOperationFromSchemas.length > 0 &&
                <><Typography level="title-lg" sx={{ mt: 4, mb: 2 }}>
                    <Typography>Runnable operations</Typography>
                    <Typography sx={{ ml: 1 }}>
                        <InfoTooltipIcon>
                            <Typography>Runnable operations are operations that you can run from this schema (or part of it). They are inferred from multiple factors, mainly relationships between operation inputs (parameters & schemas) and outputs (schemas).</Typography><br />
                            <Typography>For example, if you create a Foreign Key from the response body of an operation the request body of an other operation, the former operation will be runnable from the response of the later.</Typography><br />
                            <Typography>It might be confusing at first, but the gist of it is that the input of an operation can be obtained from the output of another, and HopFront uses this fact to build a smart UI.</Typography><br />
                        </InfoTooltipIcon>
                    </Typography>
                </Typography >

                    <Table>
                        <thead>
                            <tr>
                                <th>Operation</th>
                                <th>Why is this operation runnable?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {runnableOperationFromSchemas.map((runnableOperation, index) => (
                                <tr key={`runnable-op-${index}`}>
                                    <td><OperationLabel operation={runnableOperation.operation} mode="technical" /></td>
                                    <td><RunnableOperationFromSchemaReasonsTableData reasons={runnableOperation.reasons} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </>}
        </>
    );
}