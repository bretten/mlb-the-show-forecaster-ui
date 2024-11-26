import {afterEach, assert, beforeEach, describe, expect, it} from "vitest";
import {cleanup, fireEvent, render} from "@testing-library/react";
import React from "react";
import {useLayout} from "../../src/contexts/LayoutContext";
import {LayoutProvider} from "../../src/components/LayoutProvider";

const TestComponent = () => {
    const {isLoading, setIsLoading} = useLayout();
    return (
        <div>
            <span id="is-loading">{isLoading.toString()}</span>
            <button id="switcher-true" onClick={() => {
                setIsLoading(true);
            }}>TRUE
            </button>
            <button id="switcher-false" onClick={() => {
                setIsLoading(false);
            }}>FALSE
            </button>
        </div>
    );
};

describe('LayoutProvider', () => {
    beforeEach(() => {

    });

    afterEach(() => {
        cleanup();
    });

    it('provides and switches loading state for nested elements', () => {
        render(
            <LayoutProvider>
                <TestComponent/>
            </LayoutProvider>
        );

        const isLoadingElement = document.querySelector('#is-loading');
        assert.isNotNull(isLoadingElement);

        // Set isLoading = true
        fireEvent.click(document.querySelector('#switcher-true'))

        // Assert isLoading matches
        expect(isLoadingElement!.textContent).to.equal('true')

        // Set isLoading = false
        fireEvent.click(document.querySelector('#switcher-false'))

        // Assert isLoading matches
        expect(isLoadingElement!.textContent).to.equal('false')
    });
})