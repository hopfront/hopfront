import { Check } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { OpenAPIV3 } from "openapi-types";
import { ReactNode, useState } from "react";
import { ManualInput } from "../components/input/ManualInput";
import { useAnalytics } from "../hooks/analytics/useAnalytics";
import { isValidEmail } from "../lib/utils";
import HttpMethods = OpenAPIV3.HttpMethods;

export interface NewsletterOnboardingAccordionProps {
    title: ReactNode
    expanded: boolean
    summarySx?: SxProps
    onClick: () => void
    onSkipClicked: (e: React.MouseEvent<HTMLAnchorElement>) => void
    onStepCompleted: () => void
}

export default function NewsletterOnboardingAccordion(
    {
        title,
        expanded,
        summarySx,
        onClick,
        onSkipClicked,
        onStepCompleted
    }: NewsletterOnboardingAccordionProps
) {
    const { registerEvent } = useAnalytics();
    const [newsletterEmail, setNewsletterEmail] = useState<string>('');
    const [userSubscribedToNewsletter, setUserSubscribedToNewsletter] = useState<boolean>(false);

    const onNewsletterEmailSubscribed = () => {
        if (isValidEmail(newsletterEmail)) {
            registerEvent({
                category: "onboarding",
                action: "newsletter-subscribed",
                name: newsletterEmail,
            });
            setUserSubscribedToNewsletter(true);
            onStepCompleted();
        }
    }

    return (

        <Accordion expanded={expanded}>
            <AccordionSummary
                indicator={null}
                onClick={() => { onClick(); }}
                sx={summarySx}>
                {title}
            </AccordionSummary>
            <AccordionDetails>
                <Card
                    sx={{
                        alignSelf: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                    }}>
                    <Typography level="title-md">
                        HopFront&apos;s newsletter
                    </Typography>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onNewsletterEmailSubscribed();
                        }}
                        style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                        <ManualInput
                            type="email"
                            endDecorator={
                                userSubscribedToNewsletter && <Check color='success' />
                            }
                            updatableValue={{
                                value: newsletterEmail,
                                onValueUpdate: (value) => setNewsletterEmail(value as string)
                            }}
                            sx={{
                                width: {
                                    xs: '250px',
                                    sm: '350px',
                                    lg: '450px'
                                }
                            }}
                            placeholder="myself@email.com" />
                        <Button
                            type="submit"
                            color='primary'>
                            Subscribe
                        </Button>
                        <Button variant='plain' color='primary' onClick={(e) => onSkipClicked(e)}>
                            Skip
                        </Button>
                    </form>
                    <Typography level='body-sm'>
                        We&apos;ll send you updates about new features, improvements and offers.
                    </Typography>
                </Card>
            </AccordionDetails>
        </Accordion>
    )
}