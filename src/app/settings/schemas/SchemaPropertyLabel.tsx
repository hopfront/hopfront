import { schemaRefToHumanLabel } from "@/app/lib/openapi/utils";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";

export interface SchemaPropertyLabelProps {
    schemaRef: string
    propertyName: string
    onClick?: () => void
}

export const SchemaPropertyLabel = ({ schemaRef, propertyName, onClick }: SchemaPropertyLabelProps) => {
    const typography = <><Typography fontFamily="monospace">
        {schemaRefToHumanLabel(schemaRef)}.{propertyName}
    </Typography></>;

    if (onClick) {
        return (
            <Chip onClick={onClick}>
                {typography}
            </Chip>
        );
    } else {
        return typography;
    }
}