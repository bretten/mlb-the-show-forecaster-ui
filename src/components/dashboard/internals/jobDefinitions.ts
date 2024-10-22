export interface JobType {
    /**
     * User-friendly name of the job
     */
    title: string;

    /**
     * The URI of the job
     */
    jobUri: string;

    /**
     * SignalR unique identifier of the job
     */
    methodName: string;

    /**
     * User-friendly description of the job
     */
    desc: string;
}

const jobsMarketplaceUri = import.meta.env.VITE_JOBS_MARKETPLACE_URI_INVOKE;
const jobsPerformanceUri = import.meta.env.VITE_JOBS_PERFORMANCE_URI_INVOKE;
const jobsPlayersUri = import.meta.env.VITE_JOBS_PLAYERS_URI_INVOKE;

export const JobDefinitions: JobType[] = [
    {
        title: 'Trend Reporter',
        jobUri: jobsMarketplaceUri,
        methodName: 'TrendReporterJob',
        desc: 'Aggregates performance and administrative events to generate a comparison against player card prices.'
    },
    {
        title: 'Track Player Cards',
        jobUri: jobsMarketplaceUri,
        methodName: 'PlayerCardTrackerJob',
        desc: 'Checks MLB The Show servers for any new Player Cards. Dispatches new player card events.'
    },
    {
        title: 'Track Prices',
        jobUri: jobsMarketplaceUri,
        methodName: 'CardPriceTrackerJob',
        desc: 'Checks MLB The Show servers for the current and historical prices of player cards. Dispatches price change events.'
    },
    {
        title: 'Roster Update',
        jobUri: jobsMarketplaceUri,
        methodName: 'RosterUpdaterJob',
        desc: 'Checks MLB The Show servers for roster updates and applies any new changes to player cards. Dispatches player card change events.'
    },
    {
        title: 'Performance Tracker',
        jobUri: jobsPerformanceUri,
        methodName: 'PerformanceTrackerJob',
        desc: 'Gets the most recent stats from MLB'
    },
    {
        title: 'Player Tracker',
        jobUri: jobsPlayersUri,
        methodName: 'PlayerStatusTrackerJob',
        desc: 'Gets player status updates'
    },
];