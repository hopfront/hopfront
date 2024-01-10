import { Typography } from "@mui/joy"
import { WarningAlert } from "../../alert/WarningAlert"

interface NoSchemaOperationResponseProps {
    body: any
}

export const NoSchemaOperationResponse = ({ body }: NoSchemaOperationResponseProps) => {
    return (
        <>
            <WarningAlert title={'No schema was found for this response'} />
            <Typography>{JSON.stringify(body)}</Typography>
        </>
    )
}