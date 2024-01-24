import { schemaRefToHumanLabel } from "@/app/lib/openapi/utils";
import Typography from "@mui/joy/Typography";

export interface SchemaRefLabelProps {
    schemaRef: string
}

export const SchemaRefLabel = ({ schemaRef }: SchemaRefLabelProps) => {
    return (
        <Typography fontFamily="monospace">
            {schemaRefToHumanLabel(schemaRef)}
        </Typography>
    );
}