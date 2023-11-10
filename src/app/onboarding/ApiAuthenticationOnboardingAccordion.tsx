import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { ApiAuthConfigWidget } from "../api-specs/[apiSpecId]/settings/components/ApiAuthConfigWidget";
import { ApiContext } from "../lib/model/ApiContext";

export interface ApiAuthenticationOnboardingAccordionProps {
    title: ReactNode
    expanded: boolean
    summarySx?: SxProps
    onClick: () => void
    nextButton: ReactNode
    apiSpecId: string | undefined
    apiContext: ApiContext | undefined
}

export default function ApiAuthenticationOnboardingAccordion(
    {
        title,
        expanded,
        summarySx,
        onClick,
        nextButton,
        apiSpecId,
        apiContext
    }: ApiAuthenticationOnboardingAccordionProps
) {
    return (
        <Accordion expanded={expanded}>
            <AccordionSummary indicator={null} onClick={onClick} sx={summarySx}>
                {title}
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    {(apiSpecId && apiContext) &&
                        <Box>
                            <Typography level="title-md">
                                Do you need an authentication?
                            </Typography>
                            <ApiAuthConfigWidget
                                key={apiSpecId}
                                apiContext={apiContext}
                                sx={{ mt: 2 }}
                            />
                            {nextButton}
                        </Box>}
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}