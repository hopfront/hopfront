import Typography from "@mui/joy/Typography";

export interface SecuritySchemeURLTypography {
    url?: string
}

export const SecuritySchemeURLTypography = ({url}: SecuritySchemeURLTypography) => {
    return <Typography fontFamily="monospace" variant="outlined">{url ? url : 'None'}</Typography>
}