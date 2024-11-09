import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {cleanup, render} from "@testing-library/react";
import {SignalRClient} from "../../../src/services/SignalRClient";
import {SignalRProvider} from "../../../src/components/signalr/SignalRProvider";
import {AuthContext} from "../../../src/contexts/AuthContext";
import {JobDefinitions} from "../../../src/components/dashboard/internals/jobDefinitions";
import {SeasonContext} from "../../../src/contexts/SeasonContext";

const jobsToMonitor = JobDefinitions;

const mocks = vi.hoisted(() => {
        return {
            SignalRClient: {
                start: vi.fn(() => Promise.resolve()),
                stop: vi.fn(() => Promise.resolve()),
                isConnected: vi.fn().mockReturnValue(true),
                registerHandler: vi.fn(() => {
                }),
                unregisterHandler: vi.fn(() => {
                }),
                invoke: vi.fn().mockResolvedValue({})
            }
        }
    }
);

vi.mock("../../../src/services/SignalRClient", () => {
    return {
        SignalRClient: vi.fn().mockImplementation(() => {
            return {
                start: mocks.SignalRClient.start,
                stop: mocks.SignalRClient.stop,
                isConnected: mocks.SignalRClient.isConnected,
                registerHandler: mocks.SignalRClient.registerHandler,
                unregisterHandler: mocks.SignalRClient.unregisterHandler,
                invoke: mocks.SignalRClient.invoke
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
        mocks.SignalRClient.isConnected.mockReturnValue(false);
        // Mock season
        const mockSeason = {
            season: 2024,
            switchSeason: vi.fn(),
            availableSeasons: [2024]
        };
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

        await render(<SeasonContext.Provider value={mockSeason}><AuthContext.Provider value={mockAuthContext}>
                <SignalRProvider client={mockClient}>
                    <></>
                </SignalRProvider>
            </AuthContext.Provider></SeasonContext.Provider>
        );

        expect(mockClient.start).to.toHaveBeenCalledTimes(1);
        expect(mockClient.registerHandler).to.toHaveBeenCalledTimes(jobsToMonitor.length);
    });

    it('unregisters the handlers when not authenticated', async () => {
        // Mock client
        const mockClient = new SignalRClient("url");
        mocks.SignalRClient.isConnected.mockReturnValue(true);
        // Mock season
        const mockSeason = {
            season: 2024,
            switchSeason: vi.fn(),
            availableSeasons: [2024]
        };
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

        await render(<SeasonContext.Provider value={mockSeason}><AuthContext.Provider value={mockAuthContext}>
                <SignalRProvider client={mockClient}>
                    <></>
                </SignalRProvider>
            </AuthContext.Provider></SeasonContext.Provider>
        );

        expect(mockClient.stop).to.toHaveBeenCalledTimes(1);
        expect(mockClient.unregisterHandler).to.toHaveBeenCalledTimes(jobsToMonitor.length);
    });
});