import Typography from "@mui/joy/Typography";
import {List} from "@mui/joy";
import {ReactNode} from "react";

export interface CrudListProps {
    title: string
    children?: ReactNode
}

export const TitledList = ({title, children}: CrudListProps) => {
    return (
        <>
            {title && <Typography
                id="ellipsis-list"
                level="body-xs"
                textTransform="uppercase"
                sx={{letterSpacing: '0.15rem'}}
            >
                {title}
            </Typography>}
            <List variant="outlined" aria-labelledby="ellipsis-list">
                {children}
            </List>
        </>

    );
}