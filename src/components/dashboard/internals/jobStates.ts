export enum JobStates {
    /**
     * The job is ready to start
     */
    Ready = "Ready",

    /**
     * The job has begun processing
     */
    Start = "Start",

    /**
     * The job is in progress
     */
    InProgress = "In Progress",

    /**
     * The job has finished
     */
    Done = "Done",

    /**
     * The job encountered an error
     */
    Error = "Error"
}

/**
 * Represents a job state and a descriptive message
 */
export class JobState {
    /**
     * The state of the job
     * @private
     */
    private readonly _state: string;

    /**
     * A description to accompany the state
     * @private
     */
    private readonly _message: string;

    constructor(jobState: string, message: string) {
        this._state = jobState;
        this._message = message;
    }

    get state(): string {
        return this._state;
    }

    get message(): string {
        return this._message;
    }

    get isReady(): boolean {
        return this._state === JobStates.Ready;
    }

    get isStarted(): boolean {
        return this._state === JobStates.Start;
    }

    get isInProgress(): boolean {
        return this._state === JobStates.InProgress;
    }

    get isDone(): boolean {
        return this._state === JobStates.Done;
    }

    get isError(): boolean {
        return this._state === JobStates.Error;
    }

    static createReadyState(): JobState {
        return new JobState(JobStates.Ready, "...");
    }
}