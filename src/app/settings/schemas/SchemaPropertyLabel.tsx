import {schemaRefTuHumanLabel} from "@/app/lib/openapi/utils";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";

export interface SchemaPropertyLabelProps {
    schemaRef: string
    propertyName: string
    onClick?: () => void
}

export const SchemaPropertyLabel = ({schemaRef, propertyName, onClick}: SchemaPropertyLabelProps) => {
    const typography = <><Typography fontFamily="monospace">
        {schemaRefTuHumanLabel(schemaRef)}.{propertyName}
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