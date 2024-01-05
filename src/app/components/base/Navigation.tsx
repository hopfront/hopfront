import { AdminContextProvider } from "@/app/context/AdminContext"
import { useApiSpecs } from "@/app/hooks/useApiSpecs"
import { useInstanceProperties } from "@/app/hooks/useInstanceProperties"
import Onboarding from "@/app/onboarding/Onboarding"
import { ONBOARDING_STEPS, OnBoardingStep } from "@/app/onboarding/model/OnboardingModel"
import { Box } from "@mui/joy"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ThreeDotsLoader from "../misc/ThreeDotsLoader"
import Header from "./Header"
import Sidebar from "./sidebar/Sidebar"

export interface NavigationProps {
    children: React.ReactNode
}

export default function Navigation({ children }: NavigationProps) {
    const router = useRouter();
    const { data: properties, isLoading: isPropertiesLoading, error: propertiesError } = useInstanceProperties();
    const { data: apiSpecsData, error: apiSpecsError, isLoading: isApiSpecsLoading } = useApiSpecs();
    const [setupsToShow, setSetupsToShow] = useState<OnBoardingStep[]>([]);
    const [showContent, setShowContent] = useState<boolean>(false);

    useEffect(() => {
        if (properties) {
            const updatedSteps = ONBOARDING_STEPS.map(step => {
                properties.setups.forEach(setup => {
                    if (setup.code === step.code && setup.status != 'TODO') {
                        step.status = setup.status;
                        return step;
                    }
                })
                return step;
            })

            let shouldShowOnboarding = false;
            updatedSteps.forEach(step => {
                if (['TODO', 'SEEN'].includes(step.status)) {
                    shouldShowOnboarding = true;
                }
            })
            setSetupsToShow(shouldShowOnboarding ? updatedSteps : []);
        }
    }, [properties])

    useEffect(() => {
        if ((!isPropertiesLoading && setupsToShow.length === 0) || propertiesError) {
            setShowContent(true);
        } else {
            setShowContent(false);
        }
    }, [setupsToShow, isPropertiesLoading, propertiesError])

    const onOnboardingCompleted = () => {
        setSetupsToShow([]);
        router.replace('/browse');
    }

    return (
        <AdminContextProvider>
            <Box
                minHeight="100dvh"
                display='flex'
                alignItems="center"
                justifyContent='center'
            >
                {(isPropertiesLoading || isApiSpecsLoading) && <ThreeDotsLoader />}
            </Box>

            <Box>
                {showContent &&
                    <Box sx={{
                        display: 'flex',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh'
                    }}>
                        <Header />
                        <Sidebar />
                        <Box
                            component="main"
                            className="MainContent"
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minWidth: 0,
                                height: '100dvh',
                                gap: 1,
                                overflow: 'auto',
                            }}
                        >
                            {children}
                        </Box>
                    </Box>}
                {!isPropertiesLoading && !isApiSpecsLoading && !propertiesError && setupsToShow.length > 0 &&
                    <Box
                        position='absolute'
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        display='flex'
                        flexDirection="column"
                        alignItems='center'
                        justifyContent='center'
                        overflow='auto'
                        sx={{
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'background.body',
                            zIndex: 36 // because of the Allotment pane which has a z-index of 35
                        }}>
                        <Onboarding
                            steps={setupsToShow}
                            apiSpecs={apiSpecsData?.apiSpecs ?? []}
                            onOnboardingCompleted={onOnboardingCompleted} />
                    </Box>}
            </Box>
        </AdminContextProvider>
    )
}