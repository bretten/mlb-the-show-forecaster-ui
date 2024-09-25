import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {cleanup, render} from "@testing-library/react";
import {SignalRClient} from "../../../src/services/SignalRClient";
import {SignalRProvider} from "../../../src/components/signalr/SignalRProvider";
import {AuthContext} from "../../../src/contexts/AuthContext";
import {JobDefinitions} from "../../../src/components/dashboard/internals/jobDefinitions";

const jobsToMonitor = JobDefinitions;

vi.mock("../../../src/services/SignalRClient", () => {
    return {
        SignalRClient: vi.fn().mockImplementation(() => {
            return {
                start: vi.fn(() => Promise.resolve()),
                stop: vi.fn(() => Promise.resolve()),
                registerHandler: vi.fn(() => {
                }),
                unregisterHandler: vi.fn(() => {
                })
            };
        })
    };
})

describe('SignalRProvider', () => {

    beforeEach(() => {

    });

    afterEach(() => {
        cleanup();
    });

    it('provides the signalr client when authenticated and registers the handlers', async () => {
        // Mock client
        const mockClient = new SignalRClient("url");
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

        await render(<AuthContext.Provider value={mockAuthContext}>
                <SignalRProvider client={mockClient}>
                    <></>
                </SignalRProvider>
            </AuthContext.Provider>
        );

        expect(mockClient.start).to.toHaveBeenCalledTimes(1);
        expect(mockClient.registerHandler).to.toHaveBeenCalledTimes(jobsToMonitor.length);
    });

    it('unregisters the handlers when not authenticated', async () => {
        // Mock client
        const mockClient = new SignalRClient("url");
        // Mock auth context
        const mockAuthContext = {
            isAuthenticated: false,
            username: 'user1',
            role: 'Admins',
            isAdmin: true,
            login: vi.fn(),
            logout: vi.fn(),
            verify: vi.fn()
        };

        await render(<AuthContext.Provider value={mockAuthContext}>
                <SignalRProvider client={mockClient}>
                    <></>
                </SignalRProvider>
            </AuthContext.Provider>
        );

        expect(mockClient.stop).to.toHaveBeenCalledTimes(1);
        expect(mockClient.unregisterHandler).to.toHaveBeenCalledTimes(jobsToMonitor.length);
    });
});