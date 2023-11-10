import { UpdatableValue } from "@/app/lib/model/UpdatableValue"
import { FormLabel } from "@mui/joy"
import { ChangeEvent } from "react"
import { MarkdownFormHelperText } from "./MarkdownFormHelperText"

interface InputFileProps {
    required: boolean,
    disabled?: boolean
    placeholder?: string,
    updatableValue: UpdatableValue<any>,
    name?: string,
    description?: string,
}

export const FileInput = ({ required, disabled = false, updatableValue, name, description }: InputFileProps) => {
    const onFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            updatableValue.onValueUpdate(file);
        }
    }

    return (
        <>
            <FormLabel>{name || 'Upload file'}{required ? '*' : ''}</FormLabel>
            <input
                id="file-upload"
                type='file'
                disabled={disabled}
                required={required}
                onChange={event => onFileUpload(event)}
            />
            {description && <MarkdownFormHelperText text={description} />}
        </>
    )
}