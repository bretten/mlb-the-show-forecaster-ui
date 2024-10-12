import {afterEach, assert, beforeEach, describe, it, Mock, vi} from "vitest";
import {cleanup, render, screen} from "@testing-library/react";
import {JobType} from "../../../../../src/components/dashboard/internals/jobDefinitions";
import {JobState} from "../../../../../src/components/dashboard/internals/jobStates";
import {AuthContext} from "../../../../../src/contexts/AuthContext";
import {SignalRContext} from "../../../../../src/contexts/SignalRContext";
import {JobStartButton} from "../../../../../src/components/dashboard/components/jobs/JobStartButton";

class MockJob implements JobType {
    title: string;
    methodName: string;
    desc: string;

    constructor(title: string, methodName: string, desc: string) {
        this.title = title;
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
                method1: new JobState("Done", "Job finished")
            }
        };

        const mockJob = new MockJob("title1", "method1", "desc1");

        render(
            <AuthContext.Provider value={mockAuthContext}>
                <SignalRContext.Provider value={signalRContext}>
                    <JobStartButton job={mockJob}/>
                </SignalRContext.Provider>
            </AuthContext.Provider>
        )

        const element = screen.getByLabelText("Start");
        assert.exists(element);
    });
});