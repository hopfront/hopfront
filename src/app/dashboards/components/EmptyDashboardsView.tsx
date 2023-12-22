import { Architecture } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/joy";
import Image from "next/image";
import emptyViewPic from "../assets/empty_dashboards.svg";
import { WarningAlert } from "@/app/components/alert/WarningAlert";

export interface EmptyViewProps {
    onClick: () => void,
    isLoading: boolean,
    isAddDashboardAvailable: boolean
}

export default function EmptyDashboardsView({ onClick, isLoading, isAddDashboardAvailable }: EmptyViewProps) {

    return (
        <Box sx={{
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2
        }}>
            <Image src={emptyViewPic} alt='No dashboards yet' width={300} height={300} />
            <Typography level="h3" gutterBottom sx={{ mt: 2 }}>
                No dashboards yet?
            </Typography>
            <Typography
                level='body-md'
                gutterBottom
                sx={{
                    width: '50%',
                    textAlign: 'center'
                }}
            >
                Build your first HopFront dashboard and unlock the full potential of your business right now!
            </Typography>
            {isAddDashboardAvailable ?
                <Button
                    onClick={onClick}
                    loading={isLoading}
                    loadingPosition='end'
                    size='lg'
                    endDecorator={<Architecture />}
                    sx={{ mt: 2, width: 'auto', fontSize: 'md' }}>
                    Create dashboard
                </Button> :
                <WarningAlert title={'You are not an administrator.'}>
                    <Typography>Log in as an administrator or contact your administrator to create a dashboard.</Typography>
                </WarningAlert>
            }
        </Box>
    )
}