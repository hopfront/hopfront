import React from "react";
import {Link, Stack, Typography} from "@mui/joy";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {Feedback} from "@mui/icons-material";

export interface FeedbackModalProps {
    open: boolean
    onClose: () => void
}

export const FeedbackModal = ({open, onClose}: FeedbackModalProps) => {
    return (
        <ResponsiveModal open={open} onClose={onClose}>
            <>
                <Typography level="title-lg">
                    <Typography>
                        <Stack direction="row">
                            <Stack justifyContent="center">
                                <Feedback/>
                            </Stack>
                            <Typography sx={{ml: 1}}>User Feedback</Typography>
                        </Stack>
                    </Typography>
                </Typography>
                <Typography level="title-md" sx={{mt: 1}}>
                    HopFront is under active development!
                </Typography>
                <Typography>
                    You can report bugs or submit feature requests on <Link href='https://github.com/hopfront/hopfront/issues' target="_blank" rel="noreferrer">HopFront issues board</Link>
                </Typography>

                <Typography>
                    You can also tell us what you like/dislike about HopFront using <Link href='https://share-eu1.hsforms.com/1xvjf0HykSk6Uhi-O6Z0ACg2bzdzh' target="_blank" rel="noreferrer">this quick survey</Link>.
                </Typography>
            </>
        </ResponsiveModal>
    );
}