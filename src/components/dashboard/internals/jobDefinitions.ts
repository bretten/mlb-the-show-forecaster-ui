export interface JobType {
    /**
     * User-friendly name of the job
     */
    title: string;

    /**
     * SignalR unique identifier of the job
     */
    methodName: string;

    /**
     * User-friendly description of the job
     */
    desc: string;
}

export const JobDefinitions: JobType[] = [
    {
        title: 'Track Player Cards',
        methodName: 'ReceiveProgress',
        desc: 'Checks MLB The Show servers for any new Player Cards. Dispatches new player card events.'
    },
    {
        title: 'Track Prices',
        methodName: 'ReceiveProgress2',
        desc: 'Checks MLB The Show servers for the current and historical prices of Player Cards. Dispatches price change events.'
    },
    {
        title: 'Roster Update',
        methodName: 'ReceiveProgress3',
        desc: 'Checks MLB The Show servers for roster updates and applies any new changes to Player Cards. Dispatches player card change events.'
    }
];