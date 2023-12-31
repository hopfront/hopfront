import { Box, Stack, Typography } from "@mui/joy";
import ForbiddenAccessSvg from "../403/assets/forbidden_access.svg"
import Image from "next/image";

export default function Page() {
    return (
        <Box
            display='flex'
            alignItems='center'
            justifyContent='center'
            sx={{ width: "100%", height: "100%" }}>
            <Stack direction={'column'}>
                <Image src={ForbiddenAccessSvg} alt="Forbidden access illustration" width={450} />
                <Typography level="h1" sx={{ textAlign: 'center', mt: 2 }}>
                    Access Forbidden
                </Typography>
                <Typography level="title-md" sx={{ textAlign: 'center' }}>
                    You do not have enough rights to access this page.
                </Typography>
            </Stack>
        </Box>
    )
}