export interface InstanceProperties {
    instanceId: string
    setups: InstanceSetup[] // the list of all the setups that are already done
}


/**
* TODO: Step never visited
* SEEN: Step visited but not completed
* DONE: Step completed
* SKIPPED: Step skipped
* JUMPED: Step skipped because of a previous step
* FAILED: Step done but failed
*/
export type InstanceSetupStatus = 'TODO' | 'SEEN' | 'DONE' | 'SKIPPED' | 'JUMPED' | 'FAILED';

export interface InstanceSetup {
    code: string // the code of the instance setup (e.g. "newsletter-subscription")
    status: InstanceSetupStatus
    date: Date // the date at which the setup was done
}