import CorsSettings from "@/app/api-specs/[apiSpecId]/settings/components/CorsSettings";
import { InfoAlert } from "@/app/components/alert/InfoAlert";
import { SuccessAlert } from "@/app/components/alert/SuccessAlert";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { getOperationDefaultInputs, getStandaloneOperations } from "@/app/lib/openapi/utils";
import { OperationService } from "@/app/lib/service/OperationService";
import { Warning } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { OpenAPIV3 } from "openapi-types";
import { ReactNode, useEffect, useState } from "react";
import { InstanceSetupStatus } from "../lib/model/InstanceProperties";
import HttpMethods = OpenAPIV3.HttpMethods;

export interface ConnectivityTestOnboardingAccordionProps {
    title: ReactNode
    expanded: boolean
    summarySx?: SxProps
    onClick: () => void
    nextButton: ReactNode
    shouldRunConnectivityTest: boolean
    onStepCompleted: (state: InstanceSetupStatus) => void
    apiContext?: ApiContext
}

export const ConnectivityTestOnboardingAccordion = ({
    title,
    expanded,
    summarySx,
    onClick,
    nextButton,
    shouldRunConnectivityTest,
    onStepCompleted,
    apiContext,
}: ConnectivityTestOnboardingAccordionProps) => {

    const [connectivityTestLoading, setConnectivityTestLoading] = useState(true);
    const [connectivityTestSucceeded, setConnectivityTestSucceeded] = useState<boolean | undefined>(undefined);
    const [showCORSSwitch, setShowCORSSwitch] = useState<boolean>(false);
    const [isCORSChecked, setIsCORSChecked] = useState<boolean>(false);

    const launchConnectivityTest = (apiContext: ApiContext) => {
        const operations = getStandaloneOperations(apiContext.apiSpec);

        if (operations.length === 0) {
            return;
        }

        const tryoutOperation =
            operations.find(op => op.method === HttpMethods.GET) ||
            operations[0];

        const operationDefaultInputs = getOperationDefaultInputs(tryoutOperation, undefined);

        setConnectivityTestLoading(true);
        OperationService.executeOperation(operationDefaultInputs, tryoutOperation, apiContext.config, apiContext.extension)
            .then(() => {
                setConnectivityTestSucceeded(true);
                setConnectivityTestLoading(false);
            })
            .catch(error => {
                setConnectivityTestSucceeded(false);
                setShowCORSSwitch(true);
                setConnectivityTestLoading(false);
            });
    };

    const retryConnectivityTest = () => {
        setConnectivityTestSucceeded(undefined);
    };

    useEffect(() => {
        if (shouldRunConnectivityTest) {
            if (apiContext && connectivityTestSucceeded === undefined) {
                launchConnectivityTest(apiContext);
            } else if (connectivityTestSucceeded !== undefined) {
                onStepCompleted(connectivityTestSucceeded ? 'DONE' : 'FAILED');
            }
        }
    }, [shouldRunConnectivityTest, connectivityTestSucceeded, apiContext]);

    const onCORSSwitch = (isChecked: boolean) => {
        setIsCORSChecked(isChecked);
        retryConnectivityTest();
    }

    return (
        <Accordion expanded={expanded}>
            <AccordionSummary indicator={null} onClick={onClick} sx={summarySx}>
                {title}
            </AccordionSummary>
            <AccordionDetails>
                {connectivityTestLoading &&
                    <Box display='flex'>
                        <Typography level='body-md' sx={{ mr: 1 }}>We&apos;re trying to reach your
                            API <Typography level='body-sm'>(up to 30
                                seconds)</Typography>...</Typography>
                    </Box>}
                {connectivityTestSucceeded === true &&
                    <Box display='flex' flexDirection='column'>
                        <SuccessAlert title="You successfully reached your API." />
                        {!isCORSChecked && <InfoAlert
                            title={'Please note that all HTTP requests are made directly from your browser to your API, HopFront does not handle any traffic.'}
                            sx={{ mt: 1 }} />}
                    </Box>}
                {connectivityTestSucceeded === false &&
                    <Box>
                        <Alert
                            sx={{
                                mt: 1,
                                alignItems: 'center'
                            }}
                            startDecorator={<Warning />}
                            variant="soft"
                            color="warning"
                            endDecorator={
                                <Button
                                    variant='soft'
                                    color='neutral'
                                    loading={connectivityTestLoading}
                                    onClick={retryConnectivityTest}>Retry</Button>
                            }>
                            <Typography level="body-sm" color="warning">
                                {isCORSChecked ?
                                    'We\'re still unable to connect to your services. Please double-check the Servers configuration step and your internet connection. If the issue continues, don\'t hesitate to contact our support team at support@hopfront.com.'
                                    : 'We failed to establish a connection to your API.'}
                            </Typography>
                        </Alert>
                    </Box>}
                {(showCORSSwitch && apiContext) &&
                    <Box sx={{ mt: 1 }}>
                        <CorsSettings specId={apiContext.apiSpec.id} onSwitch={onCORSSwitch} />
                    </Box>}
                {nextButton}
            </AccordionDetails>
        </Accordion>
    );
}