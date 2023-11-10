import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CircularProgress, Link, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

export interface OnboardingCompletedOnboardingAccordionProps {
    title: ReactNode
    expanded: boolean
    summarySx?: SxProps
    onClick: () => void
    onStepCompleted: () => void,
    isLoading: boolean
}

export default function OnboardingCompletedOnboardingAccordion(
    {
        title,
        expanded,
        summarySx,
        onClick,
        onStepCompleted,
        isLoading
    }: OnboardingCompletedOnboardingAccordionProps
) {
    return (
        <Accordion expanded={expanded}>
            <AccordionSummary indicator={null} onClick={() => { onClick }} sx={summarySx}>
                {title}
            </AccordionSummary>
            <AccordionDetails>
                <Card>
                    <Box display='flex'
                        flexDirection='column'
                        alignItems='center'
                        sx={{
                            py: 2,
                            px: 4,
                        }}>
                        <Typography level='title-lg' gutterBottom
                            sx={{ textAlign: 'center' }}>{'You\'re all setup!\u00A0\u00A0\u{1F389}'}</Typography>
                        <Typography sx={{ textAlign: 'center' }}>
                            If you are inspired by our project,
                            feel free to speak your mind, share your feedback and suggestions. <br />
                            You can submit a <Link href='https://github.com/hopfront/hopfront/issues' target="_blank" rel="noreferrer">GitHub issue</Link> or contact us at <Link href='mailto:support@hopfront.com'>
                            support@hopfront.com</Link>.
                        </Typography>
                    </Box>
                    <Button
                        variant='solid'
                        color='primary'
                        size='lg'
                        disabled={isLoading}
                        endDecorator={isLoading ?
                            <CircularProgress size='sm' /> : null}
                        sx={{
                            alignSelf: 'center'
                        }}
                        onClick={onStepCompleted}>
                        Hop right in!
                    </Button>
                </Card>
            </AccordionDetails>
        </Accordion>
    )
}