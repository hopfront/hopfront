import { Box, Card, Link } from "@mui/joy";
import Image from "next/image";
import addPanelSvg from "../assets/add_widget.svg";

export interface PanelPlaceholderProps {
    onClick: () => void
}

export default function PanelPlaceholder({ onClick }: PanelPlaceholderProps) {
    return <Card
        variant='outlined'
        orientation='horizontal'
        sx={{
            width: '100%',
            height: '200px',
            backgroundColor: 'primary.softBg',
            '&:hover': { boxShadow: 'sm', borderColor: 'neutral.outlinedHoverBorder' },
        }}
    >

        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box display='flex' flexDirection='column' gap={1} alignItems='center'>
                <Image src={addPanelSvg} alt='Add widget' width={125} />
                <Link
                    title="Create new panel"
                    aria-label="Create new panel"
                    underline='none'
                    overlay
                    component='button'
                    onClick={onClick}>Create a new panel</Link>
            </Box>
        </Box>
    </Card>
}