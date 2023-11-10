import { FormHelperText } from "@mui/joy"
import ReactMarkdown from "react-markdown";

interface MarkdownFormHelperTextProps {
    text: string
}

export const MarkdownFormHelperText = ({ text }: MarkdownFormHelperTextProps) => {
    return (
        <FormHelperText sx={{ p: 0, mt: -1 }}>
            <ReactMarkdown>{text}</ReactMarkdown>
        </FormHelperText>
    )
}