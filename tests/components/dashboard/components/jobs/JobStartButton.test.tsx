import {afterEach, assert, beforeEach, describe, it, Mock, vi} from "vitest";
import {cleanup, render, screen} from "@testing-library/react";
import {JobType} from "../../../../../src/components/dashboard/internals/jobDefinitions";
import {JobState} from "../../../../../src/components/dashboard/internals/jobStates";
import {AuthContext} from "../../../../../src/contexts/AuthContext";
import {SignalRContext} from "../../../../../src/contexts/SignalRContext";
import {JobStartButton} from "../../../../../src/components/dashboard/components/jobs/JobStartButton";
import {SeasonContext} from "../../../../../src/contexts/SeasonContext";

class MockJob implements JobType {
    title: string;
    jobUri: string;
    methodName: string;
    desc: string;

    constructor(title: string, jobUri: string, methodName: string, desc: string) {
        this.title = title;
        this.jobUri = jobUri;
        this.methodName = methodName;
        this.desc = desc;
    }
}

describe('JobStartButton', () => {
    // Mock fetch()
    let fetchMock: Mock;

    beforeEach(() => {
        fetchMock = vi.fn();
        // Mock the fetch function in window object (browser-like environment)
        window.fetch = fetchMock;
    });

    afterEach(() => {
        cleanup();
        vi.resetAllMocks();
    });

    it('renders when the authenticated user is an admin', async () => {
        // Mock season context
        const mockSeasonContext = {
            season: 2024,
            switchSeason: vi.fn(),
            availableSeasons: [2023, 2024]
        }
        // Mock auth context
        const mockAuthContext = {
            isAuthenticated: true,
            username: 'user1',
            role: 'Admins',
            isAdmin: true,
            login: vi.fn(),
            logout: vi.fn(),
            verify: vi.fn()
        };
        // Mock SignalR context
        const signalRContext = {
            methodsToStates: {
                method1: new JobState("Done", "Job finished", null)
            }
        };

        const mockJob = new MockJob("title1", "uri", "method1", "desc1");

        render(
            <SeasonContext.Provider value={mockSeasonContext}>
                <AuthContext.Provider value={mockAuthContext}>
                    <SignalRContext.Provider value={signalRContext}>
                        <JobStartButton job={mockJob}/>
                    </SignalRContext.Provider>
                </AuthContext.Provider>
            </SeasonContext.Provider>
        )

        const element = screen.getByLabelText("Start");
        assert.exists(element);
    });
});