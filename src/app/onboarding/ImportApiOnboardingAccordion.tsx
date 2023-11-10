import { Check } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Card, Link, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import ImportApiSpec, { ImportMode } from "../settings/apis/imports/components/ImportApiSpec";

export interface ImportApiOnboardingAccordionProps {
    title: ReactNode
    expanded: boolean
    summarySx?: SxProps
    onClick: () => void
    onSkipClicked: (e: React.MouseEvent<HTMLAnchorElement>) => void
    onApiImported: (_: ImportMode, apiSpecId: string) => void,
    showImportSuccessAlert: boolean
}

export default function ImportApiOnboardingAccordion(
    {
        title,
        expanded,
        summarySx,
        onClick,
        onSkipClicked,
        onApiImported,
        showImportSuccessAlert
    }: ImportApiOnboardingAccordionProps
) {
    return (
        <Accordion expanded={expanded}>
            <AccordionSummary
                indicator={
                    <Button variant='plain' color='primary' onClick={(e) => onSkipClicked(e)}>
                        Skip (use demo API instead)
                    </Button>}
                onClick={onClick}
                sx={summarySx}>
                {title}
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    <Typography level='body-md'>
                        You can import your API using the <Link
                            href='https://spec.openapis.org/oas/latest'>OpenAPI
                            specification</Link> (v3.0+). <br />
                        You don&apos;t have one yet? No problem, you can automatically build it
                        using any of <Link
                            href='https://openapi-generator.tech/docs/generators/'>these
                            generators.</Link>
                    </Typography>

                    <Card
                        sx={{ mt: 1 }}>
                        <ImportApiSpec onImportSucceeded={onApiImported} />
                        {showImportSuccessAlert &&
                            <Alert startDecorator={<Check />}
                                color='success' sx={{ mt: 1 }}>
                                Api successfully imported!
                            </Alert>}
                    </Card>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}