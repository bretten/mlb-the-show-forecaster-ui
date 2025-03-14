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

    /**
     * The next job or null if none
     */
    nextJob: JobType | null;
}

const jobsMarketplaceUri = import.meta.env.VITE_JOBS_MARKETPLACE_URI_INVOKE;
const jobsPerformanceUri = import.meta.env.VITE_JOBS_PERFORMANCE_URI_INVOKE;
const jobsPlayersUri = import.meta.env.VITE_JOBS_PLAYERS_URI_INVOKE;

export const JobTrendReporter: JobType = {
    title: 'Trend Reporter',
    jobUri: jobsMarketplaceUri,
    methodName: 'TrendReporterJob',
    desc: 'Aggregates performance and administrative events to generate a comparison against player card prices.',
    nextJob: null
};
export const JobRosterUpdater: JobType = {
    title: 'Roster Update',
    jobUri: jobsMarketplaceUri,
    methodName: 'RosterUpdaterJob',
    desc: 'Checks MLB The Show servers for roster updates and applies any new changes to player cards. Dispatches player card change events.',
    nextJob: JobTrendReporter
};
export const JobPerformanceTracker: JobType = {
    title: 'Performance Tracker',
    jobUri: jobsPerformanceUri,
    methodName: 'PerformanceTrackerJob',
    desc: 'Gets the most recent stats from MLB',
    nextJob: JobRosterUpdater
};
export const JobCardPriceTracker: JobType = {
    title: 'Track Prices and Orders',
    jobUri: jobsMarketplaceUri,
    methodName: 'CardPriceTrackerJob',
    desc: 'Reads prices and orders from the append-only event store and builds a historical record for each player card listing.',
    nextJob: JobPerformanceTracker
};
export const JobCardListingImporter: JobType = {
    title: 'Import Listings',
    jobUri: jobsMarketplaceUri,
    methodName: 'CardListingImporterJob',
    desc: 'Checks MLB The Show servers for prices and orders of player cards. Imports into an append-only event store.',
    nextJob: JobCardPriceTracker
};
export const JobPlayerCardTracker: JobType = {
    title: 'Track Player Cards',
    jobUri: jobsMarketplaceUri,
    methodName: 'PlayerCardTrackerJob',
    desc: 'Checks MLB The Show servers for any new Player Cards. Dispatches new player card events.',
    nextJob: JobCardListingImporter
};
export const JobPlayerStatusTracker: JobType = {
    title: 'Player Tracker',
    jobUri: jobsPlayersUri,
    methodName: 'PlayerStatusTrackerJob',
    desc: 'Gets player status updates',
    nextJob: JobPlayerCardTracker
};
export const JobDefinitions: JobType[] = [
    JobPlayerStatusTracker,
    JobPlayerCardTracker,
    JobCardListingImporter,
    JobCardPriceTracker,
    JobPerformanceTracker,
    JobRosterUpdater,
    JobTrendReporter
];