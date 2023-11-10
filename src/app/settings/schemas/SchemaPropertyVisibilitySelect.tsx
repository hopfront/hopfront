import {FormControl, Option, Select} from "@mui/joy";
import {PropertyVisibility} from "@/app/lib/dto/OpenApiExtensions";
import FormLabel from "@mui/joy/FormLabel";
import Typography from "@mui/joy/Typography";

export interface SchemaPropertyVisibilitySelectProps {
    value: PropertyVisibility
    onVisibilityChange: (visibility: PropertyVisibility) => void
    disabled?: boolean
}

export const SchemaPropertyVisibilitySelect = ({value, onVisibilityChange, disabled = false}: SchemaPropertyVisibilitySelectProps) => {
    return (
        <FormControl>
            {/* we do this to align the select with the property label input */}
            <FormLabel><Typography level="body-xs">&nbsp;</Typography></FormLabel>
            <Select
                sx={{maxWidth: 250}}
                disabled={disabled}
                value={value}
                onChange={(_, value) => {
                    const newValue = value === null ? undefined : value;

                    if (newValue) {
                        onVisibilityChange(newValue);
                    }
                }}>
                <Option value={"everywhere"}>Everywhere</Option>
                <Option value={"only-detail-views"}>Only in detail views</Option>
                <Option value={"only-config-views"}>Only in configuration views</Option>
            </Select>
        </FormControl>
    );
}