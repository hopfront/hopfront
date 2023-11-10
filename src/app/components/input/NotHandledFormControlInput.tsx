import FormLabel from "@mui/joy/FormLabel";
import FormControl from "@mui/joy/FormControl";

export interface NotHandledFormControlInputProps {
}

export const NotHandledFormControlInput = ({}: NotHandledFormControlInputProps) => {
    return (
        <FormControl>
            <FormLabel>(property not handled yet)</FormLabel>
        </FormControl>
    )
}