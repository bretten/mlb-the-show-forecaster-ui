import React, {useState} from "react";
import {SeasonContext} from "../../contexts/SeasonContext.ts";

const defaultSeason = import.meta.env.VITE_DEFAULT_SEASON as number;
const availableSeasons = import.meta.env.VITE_AVAILABLE_SEASONS.split(',').map(Number);

/**
 * Season provider
 * @param children Any nested elements that need to reference the SeasonProvider
 * @constructor
 */
export const SeasonProvider = ({children}: { children: React.ReactNode }) => {
    const [season, setSeason] = useState(defaultSeason);

    const switchSeason = (newSeason: number) => {
        if (!availableSeasons.includes(newSeason)) {
            setSeason(defaultSeason);
            return;
        }
        setSeason(newSeason);
    }

    const value = {season, switchSeason, availableSeasons};
    return <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>
}