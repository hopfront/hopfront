import {OperationFromSchemaReason} from "@/app/lib/model/OperationFromSchemaReason";
import Typography from "@mui/joy/Typography";
import {SchemaRefLabel} from "@/app/settings/schemas/SchemaRefLabel";
import {SchemaPropertyLabel} from "@/app/settings/schemas/SchemaPropertyLabel";
import {Monospace} from "@/app/components/typography/Monospace";

export interface RunnableOperationFromSchemaReasonsTableDataProps {
    reasons: OperationFromSchemaReason[]
}

const buildReasonElement = (reason: OperationFromSchemaReason): React.ReactNode => {
    if (reason.schemaRefAsRequestBody) {
        return (
            <Typography>
                <SchemaRefLabel schemaRef={reason.schemaRefAsRequestBody.schemaRef}/> is used as the Request Body
                (<Monospace>{reason.schemaRefAsRequestBody.contentType}</Monospace>) of this operation.
            </Typography>
        );
    } else if (reason.schemaForeignKey) {
        return (
            <Typography>
                <SchemaPropertyLabel schemaRef={reason.schemaForeignKey.foreignKey.schemaRef}
                                     propertyName={reason.schemaForeignKey.foreignKey.propertyName}/> is a Foreign Key
                of the property <SchemaPropertyLabel schemaRef={reason.schemaForeignKey.source.schemaRef}
                                        propertyName={reason.schemaForeignKey.source.propertyName}/> which is used as the Request Body (<Monospace>{reason.schemaForeignKey.source.requestBodyContentType}</Monospace>) of this operation.
            </Typography>
        );
    } else if (reason.parameterForeignKey) {
        return (
            <Typography>
                <SchemaPropertyLabel schemaRef={reason.parameterForeignKey.foreignKey.schemaRef}
                                     propertyName={reason.parameterForeignKey.foreignKey.propertyName}/> is a Foreign Key of the parameter <Typography fontFamily="monospace">{reason.parameterForeignKey.source.parameterName}</Typography> of this operation.
            </Typography>
        );
    } else {
        return <Typography variant="outlined" color="warning">Unknown reason</Typography>
    }
}

export const RunnableOperationFromSchemaReasonsTableData = ({reasons}: RunnableOperationFromSchemaReasonsTableDataProps) => {
    return (
        <td>
            <ul>
                {reasons.map(reason => {
                    return (
                        <li key={JSON.stringify(reason)}>
                            {buildReasonElement(reason)}
                        </li>
                    );
                })}
            </ul>
        </td>
    );
}