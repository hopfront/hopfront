import { Box, Button, Typography } from "@mui/joy";
import Image from "next/image";
import emptyViewPic from "../assets/empty_view.svg"

export default function EmptyApiSpecsView() {
    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            mt: -4
        }}>
            <Image src={emptyViewPic} alt='no APIs imported yet' width={350} height={350} />
            <Typography level="h3" gutterBottom sx={{mt: -4}}>
                Nothing to do yet?
            </Typography>
            <Typography
                level='body-md'
                gutterBottom
                sx={{
                    width: '70%',
                    textAlign: 'center'
                }}
            >
                Hop right in real business and let&apos;s import your first API&apos;s services right away
            </Typography>
            <Button
                component='a'
                href="/settings/apis/imports"
                size="lg"
                
                sx={{ mt: 2, width: 'auto', fontSize: 'md' }}>
                Import an API
            </Button>
        </Box>
    )
}