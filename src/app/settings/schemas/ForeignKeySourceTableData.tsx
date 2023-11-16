import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";
import {useApiContext} from "@/app/hooks/useApiContext";
import {Skeleton} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {SchemaPropertyLabel} from "@/app/settings/schemas/SchemaPropertyLabel";

export interface ForeignKeySourceTableDataProps {
    source: ForeignKey
}

export const ForeignKeySourceTableData = ({source}: ForeignKeySourceTableDataProps) => {
    const {data: apiContext, error, isLoading} = useApiContext(source.apiSpecId);

    if (isLoading) {
        return <td><Skeleton><Typography/></Skeleton></td>;
    } else if (error) {
        return <ErrorAlert error={error}/>;
    } else if (apiContext) {
        return (
            <td>
                <Typography>
                    {apiContext.apiSpec.document.info.title || 'Untitled API'} {" > "}
                    <SchemaPropertyLabel schemaRef={source.schemaRef} propertyName={source.propertyName}/>
                </Typography>
            </td>
        );
    } else {
        return <td></td>
    }


}