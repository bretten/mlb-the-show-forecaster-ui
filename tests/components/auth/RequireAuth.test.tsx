import {afterEach, assert, beforeEach, describe, expect, it, vi} from "vitest";
import {act} from "@testing-library/react";
import {RequireAuth} from "../../../src/components/auth/RequireAuth";
import {AuthContext} from "../../../src/contexts/AuthContext";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {Container, createRoot} from "react-dom/client";

// Used to test RequireAuth
const TestComponent = () => {
    return (
        <div>
            <Routes>
                <Route path="/"
                       element={<RequireAuth><span id="login-success">Already authenticated</span></RequireAuth>}/>
                <Route path="/login" element={<span id="login-failure">Login required</span>}/>
            </Routes>
        </div>
    );
};

let container: Container | null;
describe('RequireAuth', () => {

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container!);
        container = null;
    });

    it('remains on current page while authenticated', async () => {
        const mockAuthContext = {
            isAuthenticated: true,
            username: 'user1',
            role: 'Admins',
            login: vi.fn(),
            logout: vi.fn(),
        };

        await act(async () => {
            createRoot(container!).render(
                <MemoryRouter>
                    <AuthContext.Provider value={mockAuthContext}>
                        <TestComponent/>
                    </AuthContext.Provider>
                </MemoryRouter>
            )
        });

        // Assert authenticated
        const loginSuccessElement = document.querySelector('#login-success')
        assert.isNotNull(loginSuccessElement);
        expect(loginSuccessElement!.textContent).to.equal('Already authenticated');
    });

    it('redirects to login page while unauthenticated', async () => {
        const mockAuthContext = {
            isAuthenticated: false,
            username: 'user1',
            role: 'Admins',
            login: vi.fn(),
            logout: vi.fn(),
        };

        await act(async () => {
            createRoot(container!).render(
                <MemoryRouter>
                    <AuthContext.Provider value={mockAuthContext}>
                        <TestComponent/>
                    </AuthContext.Provider>
                </MemoryRouter>
            )
        });

        // Assert login redirect
        const loginFailureElement = document.querySelector('#login-failure')
        assert.isNotNull(loginFailureElement);
        expect(loginFailureElement!.textContent).to.equal('Login required');
    });
});