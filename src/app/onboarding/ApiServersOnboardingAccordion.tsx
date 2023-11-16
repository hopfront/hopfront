import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { OpenAPIV3 } from "openapi-types";
import { ReactNode } from "react";
import ServerConfiguration from "../api-specs/[apiSpecId]/settings/components/ServerConfiguration";
import { ApiContext } from "../lib/model/ApiContext";
import ServerObject = OpenAPIV3.ServerObject;

export interface ApiServersOnboardingAccordionProps {
    title: ReactNode
    expanded: boolean
    summarySx?: SxProps
    onClick: () => void
    nextButton: ReactNode
    apiContext: ApiContext | undefined
    defaultServer: OpenAPIV3.ServerObject | undefined
}

export default function ApiServersOnboardingAccordion(
    {
        title,
        expanded,
        summarySx,
        onClick,
        nextButton,
        apiContext,
        defaultServer
    }: ApiServersOnboardingAccordionProps
) {
    return (
        <Accordion expanded={expanded}>
            <AccordionSummary indicator={null} onClick={onClick} sx={summarySx}>
                {title}
            </AccordionSummary>
            <AccordionDetails>
                {apiContext &&
                    <Box>
                        <Typography level="title-md">Are these your servers?</Typography>
                        <ServerConfiguration
                            apiContext={apiContext}
                            defaultServer={defaultServer}
                            sx={{ mt: 1 }} />
                        {nextButton}
                    </Box>}
            </AccordionDetails>
        </Accordion>
    )
}