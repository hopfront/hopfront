import { Box } from "@mui/joy"
import ThreeDotsLoader from "./ThreeDotsLoader"

export const CenteredThreeDotsLoader = () => {
    return (
        <Box display='flex' alignContent='center' justifyContent='center' sx={{ height: '90dvh' }}>
            <ThreeDotsLoader />
        </Box>
    )
}