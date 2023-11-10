import { InstanceSetupStatus } from "@/app/lib/model/InstanceProperties";

export type OnBoardingStepCode =
    'welcome'
    | 'api-import'
    | 'api-authentication'
    | 'api-servers'
    | 'api-connectivity'
    | 'newsletter-subscription'
    | 'onboarding-completed';

export interface OnBoardingStep {
    code: OnBoardingStepCode,
    status: InstanceSetupStatus
}

export const ONBOARDING_STEPS: OnBoardingStep[] = [
    { code: 'welcome', status: 'TODO' },
    { code: 'api-import', status: 'TODO' },
    { code: 'api-authentication', status: 'TODO' },
    { code: 'api-servers', status: 'TODO' },
    { code: 'api-connectivity', status: 'TODO' },
    { code: 'newsletter-subscription', status: 'TODO' },
    { code: 'onboarding-completed', status: 'TODO' }
];