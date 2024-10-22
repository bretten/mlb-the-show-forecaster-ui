import {afterEach, assert, beforeEach, describe, expect, it} from "vitest";
import {cleanup, fireEvent, render} from "@testing-library/react";
import {useSeason} from "../../../src/contexts/SeasonContext";
import React from "react";
import {SeasonProvider} from "../../../src/components/season/SeasonProvider";

const TestComponent = () => {
    const season = useSeason();
    return (
        <div>
            <span id="season">{season.season}</span>
            <button id="switcher-2023" onClick={() => {
                season.switchSeason(2023)
            }}>Switch to 2023
            </button>
            <button id="switcher-2024" onClick={() => {
                season.switchSeason(2024)
            }}>Switch to 2024
            </button>
        </div>
    );
};

describe('SeasonProvider', () => {
    beforeEach(() => {

    });

    afterEach(() => {
        cleanup();
    });

    it('provides and switches season for nested elements', () => {
        render(
            <SeasonProvider>
                <TestComponent/>
            </SeasonProvider>
        );

        const seasonElement = document.querySelector('#season');
        assert.isNotNull(seasonElement);

        // Invoke the season change
        fireEvent.click(document.querySelector('#switcher-2023'))

        // Assert the season matches
        expect(seasonElement!.textContent).to.equal('2023')

        // Invoke the season change
        fireEvent.click(document.querySelector('#switcher-2024'))

        // Assert the season matches
        expect(seasonElement!.textContent).to.equal('2024')
    });
})