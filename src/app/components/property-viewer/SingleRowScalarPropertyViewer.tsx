import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import {OpenAPIV3} from "openapi-types";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import {Monospace} from "@/app/components/typography/Monospace";
import { Skeleton } from "@mui/joy";

export interface SingleRowScalarPropertyViewerProps {
    property: any
    schema?: NonArraySchemaObject
    loading?: boolean
}

const isValidHttpUrl = (str: string): boolean => {
    let url;

    try {
        url = new URL(str);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

export const SingleRowScalarPropertyViewer = ({property, schema, loading = false}: SingleRowScalarPropertyViewerProps) => {
    if (!property) {
        return <Typography><Skeleton loading={loading}>-</Skeleton></Typography>
    }

    const string = property.toString();

    if (isValidHttpUrl(string)) {
        return (
            <span onClick={(event) => event.stopPropagation()}>
                <Link href={string}><Typography><Skeleton loading={loading}>{string}</Skeleton></Typography></Link>
            </span>
        );
    } else if (schema && (schema.format === 'date-time' || schema.format === 'date')) {
        return <Typography><Skeleton loading={loading}>{new Date(property).toLocaleString()}</Skeleton></Typography>;
    } else if (typeof property === 'boolean') {
        return <Typography fontFamily="monospace"><Skeleton loading={loading}>{string}</Skeleton></Typography>;
    } else if (schema && schema.enum) {
        return <Monospace variant="outlined"><Skeleton loading={loading}>{string}</Skeleton></Monospace>;
    } else {
        return <Typography><Skeleton loading={loading}>{string}</Skeleton></Typography>;
    }
}