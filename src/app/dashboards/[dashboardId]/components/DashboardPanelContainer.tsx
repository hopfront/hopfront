import React, {useState} from "react";
import Card from "@mui/joy/Card";
import {
    Box, CardContent,
    CircularProgress, Dropdown, IconButton, ListItemDecorator, Menu, MenuButton, MenuItem, Stack, Typography
} from "@mui/joy";
import {Delete, Edit, MoreVert} from "@mui/icons-material";

export interface DashboardPanelContainerProps {
    title: string
    loading?: boolean
    onEditClick: () => void
    onDeleteClick: () => void
    children?: React.ReactNode
}

export const DashboardPanelContainer = ({title, loading = false, onEditClick, onDeleteClick, children}: DashboardPanelContainerProps) => {
    const [showMoreButton, setShowMoreButton] = useState(false);

    return (
        <Card
            onMouseOver={() => setShowMoreButton(true)}
            onMouseLeave={() => setShowMoreButton(false)}>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography level="body-lg">
                    <Typography>{title}</Typography>
                </Typography>

                <Stack direction="row">
                    {loading && <Typography><CircularProgress size="sm"/></Typography>}
                    <Dropdown>
                        <MenuButton
                            slots={{root: IconButton}}
                            slotProps={{root: {variant: 'plain', color: 'neutral'}}}
                        >
                            {showMoreButton && <MoreVert/>}
                        </MenuButton>
                        <Menu placement='bottom-start'>
                            <MenuItem onClick={() => {
                                setShowMoreButton(false)
                                onEditClick();
                            }}>
                                <ListItemDecorator>
                                    <Edit/>
                                </ListItemDecorator>
                                Edit
                            </MenuItem>
                            <MenuItem color="danger" onClick={() => {
                                setShowMoreButton(false)
                                onDeleteClick();
                            }}>
                                <ListItemDecorator>
                                    <Delete/>
                                </ListItemDecorator>
                                Delete
                            </MenuItem>
                        </Menu>
                    </Dropdown>
                </Stack>
            </Box>
            <CardContent>
                {children}
            </CardContent>

        </Card>
    );
}