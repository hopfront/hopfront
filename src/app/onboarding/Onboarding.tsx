import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";
import {ApiSpecsApi} from "@/app/lib/api/ApiSpecsApi";
import {DashboardApi} from "@/app/lib/api/DashboardApi";
import {ConnectivityTestOnboardingAccordion} from "@/app/onboarding/ConnectivityTestOnboardingAccordion";
import {Check, Warning} from "@mui/icons-material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
    AccordionGroup,
    Box,
    Button,
    Divider,
    Typography,
    accordionSummaryClasses
} from "@mui/joy";
import {OpenAPIV3} from "openapi-types";
import {useEffect, useState} from "react";
import {useApiContext} from "../hooks/useApiContext";
import {ApiSpec} from "../lib/dto/ApiSpec";
import {ServerLocalStorage} from "../lib/localstorage/ServerLocalStorage";
import {InstanceSetup, InstanceSetupStatus} from "../lib/model/InstanceProperties";
import {ImportMode} from "../settings/apis/imports/components/ImportApiSpec";
import ApiAuthenticationOnboardingAccordion from "./ApiAuthenticationOnboardingAccordion";
import ApiServersOnboardingAccordion from "./ApiServersOnboardingAccordion";
import ImportApiOnboardingAccordion from "./ImportApiOnboardingAccordion";
import NewsletterOnboardingAccordion from "./NewsletterOnboardingAccordion";
import OnboardingCompletedOnboardingAccordion from "./OnboardingCompletedOnboardingAccordion";
import WelcomeOnboardingStep from "./WelcomeOnboardingStep";
import {OnBoardingStep, OnBoardingStepCode} from "./model/OnboardingModel";
import {buildFavoritePetSampleDashboard, buildPetOverviewDashboard} from "@/app/onboarding/utils";
import {useInstanceProperties} from "@/app/hooks/useInstanceProperties";

const registerOnboardingStep = async (step: OnBoardingStep, date: Date) => {
    return fetch('/api/instance/properties/setups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: step.code,
            status: step.status,
            date: date
        } as InstanceSetup)
    })
}

type OnBoardingProps = {
    steps: OnBoardingStep[],
    apiSpecs: ApiSpec[],
    onOnboardingCompleted: () => void
}

export default function Onboarding({steps: initialSteps, apiSpecs, onOnboardingCompleted}: OnBoardingProps) {
    const {mutate: mutateProperties} = useInstanceProperties();
    const {usePageView, registerEvent} = useAnalytics();
    usePageView('onboarding');

    const [steps, setSteps] = useState<OnBoardingStep[]>(initialSteps);
    const initialActiveStep = steps.find(step => step.status === 'TODO' || step.status === 'SEEN') ?? steps[0];
    const [activeStep, setActiveStep] = useState<OnBoardingStep>(initialActiveStep);
    const [apiSpecId, setApiSpecId] = useState<string>('');
    const {data: apiContext, error, isLoading} = useApiContext(apiSpecId);
    const [submitOnboardingLoading, setSubmitOnboardingLoading] = useState<boolean>(false);
    const [showImportSuccessAlert, setShowImportSuccessAlert] = useState(false);
    const [defaultServer, setDefaultServer] = useState<OpenAPIV3.ServerObject | undefined>(undefined);

    useEffect(() => {
        if (apiSpecs.length > 0) {
            setApiSpecId(apiSpecs[0].id);
            setShowImportSuccessAlert(true);
        }
    }, [apiSpecs])

    useEffect(() => {
        if (activeStep && activeStep.status === 'TODO') {
            updateStep(activeStep, 'SEEN');
        }
    }, [activeStep])

    useEffect(() => {
        if (apiContext) {
            setDefaultServer(
                ServerLocalStorage.getApiServer(apiContext)
            )
        }
    }, [apiContext])

    const updateStep = (step: OnBoardingStep, status?: InstanceSetupStatus) => {
        if (status) {
            step.status = status;
            registerOnboardingStep(step, new Date())
                .then(() => mutateProperties());
        }
        setSteps(steps => steps.map(s => s.code === step.code ? step : s));
    }

    const onNextClicked = () => {
        registerEvent({
            category: "onboarding",
            action: "onboarding-next-clicked",
            name: "onboarding-step-" + activeStep.code
        });

        if (activeStep.code !== 'api-connectivity' && activeStep.code != 'api-servers') {
            updateStep(activeStep, 'DONE');
        }

        if (activeStep.code === 'api-servers') {
            defaultServer ? updateStep(activeStep, 'DONE') : updateStep(activeStep, 'FAILED');
        }
        setActiveStep(step => steps[steps.indexOf(step) + 1]);
    }

    const onSkipClicked = (e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e?.stopPropagation();

        registerEvent({
            category: "onboarding",
            action: "onboarding-skip-clicked",
            name: "onboarding-step-" + activeStep.code
        });

        const skippedSteps: OnBoardingStepCode[] = [];

        if (activeStep.code === 'api-import') {
            skippedSteps.push('api-authentication', 'api-servers', 'api-connectivity');
        }

        steps.forEach(step => {
            if (skippedSteps.includes(step.code)) {
                updateStep(step, 'JUMPED');
            } else if (step.code === activeStep.code) {
                updateStep(step, 'SKIPPED');
            }
        });

        setActiveStep(step => steps[steps.indexOf(step) + skippedSteps.length + 1]);
    }

    const onStepClicked = (type: OnBoardingStepCode) => {
        const step = steps.find(step => step.code === type);

        registerEvent({
            category: "onboarding",
            action: "onboarding-step-clicked",
            name: "onboarding-step-" + step,
        });

        if (step && ['SEEN', 'DONE', 'SKIPPED', 'FAILED'].includes(step.status)) {
            setActiveStep(step);
        }
    }

    const onOnboardingCompletedClicked = () => {
        setSubmitOnboardingLoading(true);

        registerEvent({
            category: "onboarding",
            action: "onboarding-completed-clicked",
        });

        if (apiContext) {
            closeOnboarding();
        } else { // We only import demo api spec if no api spec has been imported yet by the user.
            ApiSpecsApi.importApiSpecAsUrl('https://petstore3.swagger.io/api/v3/openapi.json', false)
                .then(petstoreApiSpecId => {
                    return Promise.all([
                        DashboardApi.updateDashboard(buildFavoritePetSampleDashboard(petstoreApiSpecId)),
                        DashboardApi.updateDashboard(buildPetOverviewDashboard(petstoreApiSpecId)),
                    ]);
                })
                .finally(() => {
                    closeOnboarding();
                });
        }
    }

    const closeOnboarding = () => {
        updateStep(activeStep, 'DONE')
        setSubmitOnboardingLoading(false);
        onOnboardingCompleted();
    }

    const onApiImportSucceeded = (_: ImportMode, apiSpecId: string) => {
        setShowImportSuccessAlert(true);
        setApiSpecId(apiSpecId);
        onNextClicked();
    }

    const nextButton = <Button variant='soft' color='primary' sx={{alignSelf: 'start', mt: 2}}
                               onClick={onNextClicked}>Next</Button>

    const stepIsDisabled = (type: OnBoardingStepCode): boolean => {
        const step = steps.find(s => s.code === type);
        return step ? ['TODO', 'JUMPED'].includes(step.status) : false;
    }

    const disabledSummaryStyle = (type: OnBoardingStepCode) => {
        if (stepIsDisabled(type)) {
            return {
                [`& [aria-expanded="false"]:hover`]: {
                    backgroundColor: 'transparent !important',
                    cursor: 'default'
                }
            };
        } else {
            return undefined;
        }
    }
    const getTitleColor = (type: OnBoardingStepCode) => {
        return type === activeStep.code ? "text.primary" : "neutral.softDisabledColor"
    }
    const getTitle = (type: OnBoardingStepCode) => {
        const step = steps.find(s => s.code === type);
        const index = step ? steps.indexOf(step) : null;
        let title: string;
        switch (type) {
            case 'api-import':
                title = 'Import your first API';
                break;
            case 'api-authentication':
                title = 'Authentication';
                break;
            case 'api-servers':
                title = 'Servers';
                break;
            case 'api-connectivity':
                title = 'Connectivity test';
                break;
            case 'newsletter-subscription':
                title = 'Newsletter';
                break;
            case 'onboarding-completed':
                title = 'Enjoy HopFront!';
                break;
            default:
                title = type;
        }

        title = index ? `${index}. ${title}` : title;

        switch (step?.status) {
            case 'SKIPPED':
                return (
                    <Typography display='flex' level="title-lg" textColor={getTitleColor(type)}>
                        {title} <CloseRoundedIcon sx={{ml: 0.5}}/>
                    </Typography>
                )
            case 'JUMPED':
                return (
                    <Typography display='flex' alignItems='baseline' level="title-lg" textColor={getTitleColor(type)}>
                        {title} <Typography level='body-sm' textColor={getTitleColor(type)}
                                            sx={{ml: 0.5}}>{'- skipped'}</Typography>
                    </Typography>
                )
            case 'FAILED':
                return (
                    <Typography display='flex' level="title-lg" textColor={getTitleColor(type)}>
                        {title} <Warning color='warning' sx={{ml: 0.5}}/>
                    </Typography>
                )
            case 'DONE':
                return (
                    <Typography display='flex' level="title-lg" textColor={getTitleColor(type)}>
                        {title} <Check color='success' sx={{ml: 0.5}}/>
                    </Typography>
                )
            default:
                return (
                    <Typography display='flex' level="title-lg" textColor={getTitleColor(type)}>
                        {title}
                    </Typography>
                )
        }
    }

    return (
        <Box
            display='flex'
            flexDirection='column'
            width={'100%'}
            height={'100%'}
            borderRadius={'8px'}
        >
            <Typography level='h1' sx={{m: 3}} gutterBottom>HopFront.</Typography>
            <Divider/>

            <WelcomeOnboardingStep
                visibility={activeStep.code === 'welcome'}
                onNextClicked={onNextClicked}/>

            {activeStep.code !== 'welcome' &&
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>

                    {<Box sx={{
                        p: 2,
                        mx: 2,
                        display: 'flex',
                        width: {
                            xs: '90%',
                            sm: '80%',
                            md: '80%',
                            lg: '1000px'
                        },
                        flexDirection: 'column'
                    }}>
                        <Box>
                            <AccordionGroup
                                size='lg'
                                transition='0.4s ease'
                                sx={{
                                    [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                                        transform: 'rotate(0deg)'
                                    },
                                    [`& [aria-expanded="false"] .${accordionSummaryClasses.indicator}`]: {
                                        display: 'none'
                                    },
                                    [`& [aria-expanded="true"]:hover`]: {
                                        backgroundColor: 'transparent !important',
                                        cursor: 'default'
                                    }
                                }}>
                                <ImportApiOnboardingAccordion
                                    title={getTitle('api-import')}
                                    expanded={activeStep.code === 'api-import'}
                                    summarySx={disabledSummaryStyle('api-import')}
                                    onClick={() => onStepClicked('api-import')}
                                    onSkipClicked={onSkipClicked}
                                    onApiImported={onApiImportSucceeded}
                                    showImportSuccessAlert={showImportSuccessAlert}
                                />

                                <ApiAuthenticationOnboardingAccordion
                                    title={getTitle('api-authentication')}
                                    expanded={activeStep.code === 'api-authentication'}
                                    summarySx={disabledSummaryStyle('api-authentication')}
                                    onClick={() => onStepClicked('api-authentication')}
                                    apiContext={apiContext}
                                    apiSpecId={apiSpecId}
                                    nextButton={nextButton}
                                />

                                <ApiServersOnboardingAccordion
                                    title={getTitle('api-servers')}
                                    expanded={activeStep.code === 'api-servers'}
                                    summarySx={disabledSummaryStyle('api-servers')}
                                    onClick={() => onStepClicked('api-servers')}
                                    apiContext={apiContext}
                                    nextButton={nextButton}
                                    defaultServer={defaultServer}
                                />

                                <ConnectivityTestOnboardingAccordion
                                    title={getTitle('api-connectivity')}
                                    expanded={activeStep.code === 'api-connectivity'}
                                    summarySx={disabledSummaryStyle('api-connectivity')}
                                    onClick={() => onStepClicked('api-connectivity')}
                                    shouldRunConnectivityTest={activeStep.code === 'api-connectivity'}
                                    nextButton={nextButton}
                                    onStepCompleted={state => updateStep(activeStep, state)}
                                    apiContext={apiContext}/>

                                <NewsletterOnboardingAccordion
                                    title={getTitle('newsletter-subscription')}
                                    expanded={activeStep.code === 'newsletter-subscription'}
                                    summarySx={disabledSummaryStyle('newsletter-subscription')}
                                    onClick={() => onStepClicked('newsletter-subscription')}
                                    onSkipClicked={onSkipClicked}
                                    onStepCompleted={onNextClicked}
                                />

                                <OnboardingCompletedOnboardingAccordion
                                    title={getTitle('onboarding-completed')}
                                    expanded={activeStep.code === 'onboarding-completed'}
                                    summarySx={disabledSummaryStyle('onboarding-completed')}
                                    onClick={() => onStepClicked('onboarding-completed')}
                                    onStepCompleted={onOnboardingCompletedClicked}
                                    isLoading={submitOnboardingLoading}
                                />
                            </AccordionGroup>
                        </Box>
                    </Box>}
                </Box>}
        </Box>
    )
}