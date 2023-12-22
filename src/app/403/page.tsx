import { Box, Stack, Typography } from "@mui/joy";
import ForbiddenAccessSvg from "../403/assets/forbidden_access.svg"
import Image from "next/image";

export default function Page() {
    return (
        <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            sx={{ width: "100vw", height: "100vh" }}>
            <Stack direction={'column'}>
                <Image src={ForbiddenAccessSvg} alt="Forbidden access illustration" />
                <Typography level="h1" sx={{ textAlign: 'center', mt: 2 }}>
                    403 - Access Forbidden
                </Typography>
            </Stack>
        </Box>
    )
}